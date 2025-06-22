import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { bookingApi } from '../../services/booking/bookingService';

export const useUserHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const toast = useToast();

    // Fetch booking history data
    const fetchHistory = useCallback(async (page = 1, status = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: page,
                limit: 10,
                ...(status && { status })
            };

            console.log('Fetching user booking history with params:', params);

            const response = await bookingApi.getUserBookingHistory(params);
            console.log('API Response:', response);

            // Handle different response formats
            if (response && (response.success === true || response.success === undefined)) {
                // If response.success is true or undefined (direct data)
                const data = response.data || response;
                const bookingsData = data.bookings || data || [];

                console.log('Processed bookings data:', bookingsData);

                setBookings(Array.isArray(bookingsData) ? bookingsData : []);
                setCurrentPage(data.currentPage || page);
                setTotalPages(data.totalPages || Math.ceil((data.totalItems || bookingsData.length) / params.limit));
                setTotalItems(data.totalItems || bookingsData.length);
            } else {
                // If response indicates failure
                console.error('API returned failure:', response);
                throw new Error(response.message || response.error || 'Gagal memuat riwayat peminjaman');
            }
        } catch (err) {
            console.error('Error fetching user history:', err);
            const errorMessage = err.message || 'Gagal memuat riwayat peminjaman';

            setError(errorMessage);
            setBookings([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(0);

            // Only show toast if it's a real error (not just empty data)
            if (!errorMessage.includes('successfully') && !errorMessage.includes('berhasil')) {
                toast({
                    title: 'Error',
                    description: errorMessage,
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            }
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        fetchHistory(page, statusFilter);
    }, [fetchHistory, statusFilter]);

    // Handle status filter change
    const handleStatusFilter = useCallback((status) => {
        setStatusFilter(status);
        setCurrentPage(1);
        fetchHistory(1, status);
    }, [fetchHistory]);

    // Refresh data
    const refreshData = useCallback(() => {
        fetchHistory(currentPage, statusFilter);
    }, [fetchHistory, currentPage, statusFilter]);

    // Get status badge color
    const getStatusBadge = useCallback((status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
                return 'green';
            case 'PROCESSING':
                return 'orange';
            case 'REJECTED':
                return 'red';
            case 'COMPLETED':
                return 'blue';
            case 'CANCELLED':
                return 'gray';
            default:
                return 'gray';
        }
    }, []);

    // Get status text
    const getStatusText = useCallback((status) => {
        switch (status?.toUpperCase()) {
            case 'PROCESSING':
                return 'Diproses';
            case 'APPROVED':
                return 'Disetujui';
            case 'REJECTED':
                return 'Ditolak';
            case 'COMPLETED':
                return 'Selesai';
            case 'CANCELLED':
                return 'Dibatalkan';
            default:
                return status || 'Unknown';
        }
    }, []);

    // Format currency
    const formatCurrency = useCallback((amount) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }, []);

    // Format date
    const formatDate = useCallback((dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (err) {
            return dateString;
        }
    }, []);

    // Get statistics
    const getStats = useCallback(() => {
        const stats = {
            total: totalItems,
            processing: 0,
            approved: 0,
            completed: 0,
            rejected: 0,
            cancelled: 0
        };

        // Count by status (this is for current page only)
        // In real implementation, you might want to get this from API
        bookings.forEach(booking => {
            const status = booking.status?.toUpperCase();
            switch (status) {
                case 'PROCESSING':
                    stats.processing++;
                    break;
                case 'APPROVED':
                    stats.approved++;
                    break;
                case 'COMPLETED':
                    stats.completed++;
                    break;
                case 'REJECTED':
                    stats.rejected++;
                    break;
                case 'CANCELLED':
                    stats.cancelled++;
                    break;
            }
        });

        return stats;
    }, [bookings, totalItems]);

    useEffect(() => {
        fetchHistory(1, '');
    }, [fetchHistory]);

    return {
        // Data
        bookings,
        loading,
        error,
        currentPage,
        totalPages,
        totalItems,
        statusFilter,

        // Actions
        handlePageChange,
        handleStatusFilter,
        refreshData,

        // Utility functions
        getStatusBadge,
        getStatusText,
        formatCurrency,
        formatDate,
        getStats
    };
}; 