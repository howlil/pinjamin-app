import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { scheduleAPI } from './scheduleAPI';

export const useSchedule = (filters = {}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSchedule = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await scheduleAPI.getUserBookings({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBookings(response.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat jadwal peminjaman');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const refetch = () => fetchSchedule();

    return {
        bookings,
        loading,
        error,
        fetchSchedule,
        refetch
    };
}; 