import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { buildingsAPI } from '@features/home/api/buildingsAPI';

export const useBuildingDetail = (buildingId) => {
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchBuildingDetail = async () => {
        if (!buildingId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.getBuildingDetail(buildingId);

            if (response.status === 'success') {
                setBuilding(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat detail gedung');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat detail gedung',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuildingDetail();
    }, [buildingId]);

    const refetch = () => fetchBuildingDetail();

    return {
        building,
        loading,
        error,
        refetch
    };
};

export const useAvailabilityCheck = () => {
    const [availableBuildings, setAvailableBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const checkAvailability = async (date, time) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.checkAvailability({ date, time });

            if (response.status === 'success') {
                setAvailableBuildings(response.data.availableBuildings || []);
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengecek ketersediaan');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal mengecek ketersediaan',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        availableBuildings,
        loading,
        error,
        checkAvailability
    };
};

export const useBuildingSchedule = (buildingId, month, year) => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalBookings, setTotalBookings] = useState(0);

    const toast = useToast();

    const fetchBuildingSchedule = async () => {
        if (!buildingId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.getBuildingSchedule({ month, year });
            if (response.status === 'success') {
                setSchedule(response.data.schedule || []);
                setTotalBookings(response.data.totalBookings || 0);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat jadwal gedung');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat jadwal gedung',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuildingSchedule();
    }, [buildingId, month, year]);

    const refetch = () => fetchBuildingSchedule();

    return {
        schedule,
        totalBookings,
        loading,
        error,
        refetch
    };
}; 