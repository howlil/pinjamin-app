import { useState, useEffect } from 'react';
import { historyAPI } from './historyAPI';
import { showToast } from '@/shared/services/apiErrorHandler';

export const useBookingHistory = (filters = {}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchBookingHistory = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await historyAPI.getBookingHistory({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBookings(response.data || []);
                setPagination(response.pagination || {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: params.page || 1,
                    itemsPerPage: params.limit || 10
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat riwayat peminjaman');
            showToast('error', err.response?.data?.message || 'Gagal memuat riwayat peminjaman');
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => fetchBookingHistory(filters);

    return {
        bookings,
        loading,
        error,
        pagination,
        fetchBookingHistory,
        refetch
    };
};

