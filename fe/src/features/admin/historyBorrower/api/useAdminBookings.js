import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminBookingAPI } from './adminBookingAPI';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';

export const usePendingBookings = (filters = {}) => {
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
            const response = await adminBookingAPI.getPendingBookings({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBookings(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(extractErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const refetch = useCallback(() => fetchPendingBookings(), [fetchPendingBookings]);

    return {
        bookings,
        loading,
        error,
        pagination,
        fetchPendingBookings,
        refetch
    };
};

export const useAdminBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchBookingHistory = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Extract status for frontend filtering
            const { status, ...apiParams } = params;

            console.log('Fetching booking history with params:', apiParams);

            const response = await adminBookingAPI.getBookingHistory(apiParams);

            console.log('API Response:', response);

            if (response.status === 'success') {
                let filteredBookings = response.data || [];

                console.log('Raw bookings from API:', filteredBookings);

                // Filter out PROCESSING status bookings on frontend
                filteredBookings = filteredBookings.filter(booking =>
                    booking.status !== 'PROCESSING'
                );

                // Apply status filter if provided
                if (status) {
                    filteredBookings = filteredBookings.filter(booking =>
                        booking.status === status
                    );
                }

                console.log('Filtered bookings:', filteredBookings);

                setBookings(filteredBookings);

                // Set pagination properly
                setPagination(response.pagination || {
                    totalItems: filteredBookings.length,
                    totalPages: Math.ceil(filteredBookings.length / (params.limit || 10)),
                    currentPage: params.page || 1,
                    itemsPerPage: params.limit || 10
                });
            }
        } catch (err) {
            console.error('Error fetching booking history:', err);
            setError(extractErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const refetch = useCallback(() => fetchBookingHistory(), [fetchBookingHistory]);

    return {
        bookings,
        loading,
        error,
        pagination,
        fetchBookingHistory,
        refetch
    };
};

export const useBookingApproval = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const approveOrRejectBooking = async (id, approvalData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminBookingAPI.approveOrRejectBooking(id, approvalData);

            if (response.status === 'success') {
                const action = approvalData.bookingStatus === 'APPROVED' ? 'disetujui' : 'ditolak';
                toast.success(`Peminjaman berhasil ${action}`);
                return response.data;
            }
        } catch (err) {
            setError(extractErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        approveOrRejectBooking,
        loading,
        error
    };
};

export const useBookingRefund = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const processRefund = async (id, refundData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminBookingAPI.processRefund(id, refundData);

            if (response.status === 'success') {
                toast.success('Refund berhasil diproses');
                return response.data;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err, 'Gagal memproses refund');
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        processRefund,
        loading,
        error
    };
};

export const useRefundDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refundDetails, setRefundDetails] = useState(null);

    const getRefundDetails = async (bookingId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminBookingAPI.getRefundDetails(bookingId);

            if (response.status === 'success') {
                setRefundDetails(response.data);
                return response.data;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err, 'Gagal mengambil detail refund');
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearRefundDetails = () => {
        setRefundDetails(null);
        setError(null);
    };

    return {
        getRefundDetails,
        refundDetails,
        loading,
        error,
        clearRefundDetails
    };
}; 