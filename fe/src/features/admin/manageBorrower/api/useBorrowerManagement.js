import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { borrowerManagementAPI } from './borrowerManagementAPI';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';

export const usePendingBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchPendingBookings = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = {
                page: pagination.currentPage,
                limit: pagination.itemsPerPage,
                includeDetails: true, // Request detail lengkap untuk modal
                ...params
            };

            const response = await borrowerManagementAPI.getPendingBookings(queryParams);

            if (response.status === 'success') {
                setBookings(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(extractErrorMessage(err));
            console.error('Error fetching pending bookings:', err);
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.itemsPerPage]);

    useEffect(() => {
        fetchPendingBookings();
    }, [fetchPendingBookings]);

    const refresh = useCallback(() => {
        fetchPendingBookings();
    }, [fetchPendingBookings]);

    const handlePageChange = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    }, []);

    return {
        bookings,
        loading,
        error,
        pagination,
        refresh,
        handlePageChange
    };
};

export const useBookingApproval = () => {
    const [loading, setLoading] = useState(false);

    const approveBooking = async (bookingId, approvalData) => {
        setLoading(true);
        try {
            const response = await borrowerManagementAPI.updateBookingApproval(bookingId, approvalData);

            if (response.status === 'success') {
                if (approvalData.bookingStatus === 'APPROVED') {
                    toast.success('Peminjaman berhasil disetujui');
                } else {
                    toast.success('Peminjaman berhasil ditolak');
                }
                return response;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err, 'Gagal memproses approval');
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        approveBooking,
        loading
    };
};

