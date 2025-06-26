import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { historyAPI } from './historyAPI';

export const useHistory = (filters = {}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchHistory = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await historyAPI.getUserBookingHistory({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBookings(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat riwayat peminjaman');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const refetch = () => fetchHistory();

    return {
        bookings,
        loading,
        error,
        pagination,
        fetchHistory,
        refetch
    };
};

