import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { scheduleAPI } from './scheduleAPI';

export const useSchedule = (month = null, year = null) => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [metadata, setMetadata] = useState({
        month: null,
        year: null,
        totalBookings: 0
    });

    const toast = useToast();

    const fetchSchedule = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await scheduleAPI.getBuildingsSchedule({
                month,
                year,
                ...params
            });

            console.log('Schedule API Response:', response);

            let scheduleData = [];

            if (Array.isArray(response)) {
                scheduleData = response;
            } else if (response.data) {
                if (Array.isArray(response.data)) {
                    scheduleData = response.data;
                } else if (response.data.schedule) {
                    scheduleData = response.data.schedule;
                }
            }

            // Transform data to match component expectations
            const transformedSchedule = scheduleData.map(item => ({
                id: item.id,
                date: item.startDate, // Map startDate to date
                time: `${item.startTime} - ${item.endTime}`, // Combine times
                startTime: item.startTime,
                endTime: item.endTime,
                buildingName: item.buildingDetail?.buildingName || 'Unknown Building',
                buildingId: item.buildingDetail?.buildingId,
                activityName: item.activityName || 'Meeting',
                status: item.status,
                borrowerName: item.borrowerDetail?.borrowerName || 'Unknown'
            }));

            console.log('Transformed Schedule:', transformedSchedule);
            setSchedule(transformedSchedule);

            setMetadata({
                month: month || new Date().getMonth() + 1,
                year: year || new Date().getFullYear(),
                totalBookings: scheduleData.length
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat jadwal');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat jadwal',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [month, year]);

    const refetch = () => fetchSchedule();

    return {
        schedule,
        loading,
        error,
        metadata,
        fetchSchedule,
        refetch
    };
}; 