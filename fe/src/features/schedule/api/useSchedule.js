import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { scheduleAPI } from './scheduleAPI';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';

export const useSchedule = (filters = {}) => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchParams, setLastFetchParams] = useState(null);

    // Transform API data to component format
    const transformScheduleData = (apiData) => {
        if (!Array.isArray(apiData)) return [];

        return apiData.map(item => {
            console.log('Transforming booking item:', item); // Debug log

            return {
                id: item.id,
                date: item.startDate, // API uses startDate, component expects date
                startDate: item.startDate,
                endDate: item.endDate, // Preserve endDate for multi-day bookings
                activityName: item.activityName,
                startTime: item.startTime,
                endTime: item.endTime,
                status: item.status,
                borrowerName: item.borrowerDetail?.borrowerName || 'Unknown',
                buildingName: item.buildingDetail?.buildingName || 'Unknown Building',
                buildingId: item.buildingDetail?.buildingId,
                // Add additional fields for better display
                title: item.activityName,
                time: `${item.startTime} - ${item.endTime}`,
                organizer: {
                    name: item.borrowerDetail?.borrowerName || 'Unknown',
                    avatar: null
                },
                // Add date range info for display
                isMultiDay: item.endDate && item.endDate !== item.startDate,
                dateRange: item.endDate && item.endDate !== item.startDate
                    ? `${item.startDate} - ${item.endDate}`
                    : item.startDate
            };
        });
    };

    const fetchSchedule = useCallback(async (params = {}) => {
        // Get current month and year if not provided
        const now = new Date();
        const defaultParams = {
            month: now.getMonth() + 1, // JavaScript months are 0-indexed
            year: now.getFullYear(),
            ...filters,
            ...params
        };

        // Create unique key for params to prevent duplicate calls
        const paramsKey = JSON.stringify(defaultParams);

        // Prevent duplicate calls with same parameters
        if (loading || paramsKey === lastFetchParams) {
            console.log('Skipping duplicate API call with same params:', defaultParams);
            return;
        }

        setLoading(true);
        setError(null);
        setLastFetchParams(paramsKey);

        try {
            console.log('Fetching schedule with params:', defaultParams);

            const response = await scheduleAPI.getBuildingsSchedule(defaultParams);

            console.log('Schedule API Response:', response); // Debug log

            let scheduleData = [];

            if (Array.isArray(response)) {
                scheduleData = response;
            } else if (response.status === 'success' && response.data) {
                scheduleData = response.data.schedule || [];
            } else if (response.data) {
                scheduleData = Array.isArray(response.data.schedule) ? response.data.schedule : [];
            }

            // Transform the data
            const transformedData = transformScheduleData(scheduleData);
            console.log('Transformed Schedule Data:', transformedData); // Debug log

            setSchedule(transformedData);
        } catch (err) {
            console.error('Schedule fetch error:', err);
            setError(extractErrorMessage(err));
            setSchedule([]);
            setLastFetchParams(null); // Reset on error to allow retry
        } finally {
            setLoading(false);
        }
    }, []); // Remove filters dependency to prevent infinite loops

    // Function to fetch schedule for specific month/year
    const fetchScheduleForMonth = useCallback((month, year) => {
        console.log('Fetching schedule for month/year:', month, year);
        fetchSchedule({ month, year });
    }, [fetchSchedule]);

    // Tidak auto-fetch saat initialization, biarkan SchedulePage yang control
    // useEffect(() => {
    //     fetchSchedule();
    // }, [fetchSchedule]);

    const refetch = useCallback(() => fetchSchedule(), [fetchSchedule]);

    return {
        schedule,
        loading,
        error,
        fetchSchedule,
        fetchScheduleForMonth,
        refetch
    };
}; 