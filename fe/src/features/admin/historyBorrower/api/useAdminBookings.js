import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { adminBookingAPI } from './adminBookingAPI';

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

    const toast = useToast();

    const fetchPendingBookings = async (params = {}) => {
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
            setError(err.response?.data?.message || 'Gagal memuat data peminjaman pending');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat data peminjaman pending',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    const refetch = () => fetchPendingBookings();

    return {
        bookings,
        loading,
        error,
        pagination,
        fetchPendingBookings,
        refetch
    };
};

export const useAdminBookingHistory = (filters = {}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const toast = useToast();

    const fetchBookingHistory = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminBookingAPI.getBookingHistory({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBookings(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat riwayat peminjaman');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat riwayat peminjaman',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    const refetch = () => fetchBookingHistory();

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

    const toast = useToast();

    const approveOrRejectBooking = async (id, approvalData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminBookingAPI.approveOrRejectBooking(id, approvalData);

            if (response.status === 'success') {
                const action = approvalData.bookingStatus === 'APPROVED' ? 'disetujui' : 'ditolak';
                toast({
                    title: 'Berhasil',
                    description: `Peminjaman berhasil ${action}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memproses approval peminjaman');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memproses approval peminjaman',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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

    const toast = useToast();

    const processRefund = async (id, refundData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminBookingAPI.processRefund(id, refundData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Refund berhasil diproses',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memproses refund');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memproses refund',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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