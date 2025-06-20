import { useState, useEffect } from 'react';
import { bookingApi } from '@/services/apiService';
import { showToast } from '@/utils/helpers';

export const useAdminBookingHistory = () => {
    // State management
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // Filter states
    const [buildingFilter, setBuildingFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const limit = 10; // Items per page

    // Fetch admin booking history
    const fetchBookingHistory = async (page = 1, buildingId = '', startDate = '', endDate = '') => {
        try {
            setLoading(true);
            setError(null);

            console.log('=== FETCH ADMIN BOOKING HISTORY ===');
            console.log('Page:', page, 'Building:', buildingId, 'Start:', startDate, 'End:', endDate);

            const params = {
                page,
                limit,
                ...(buildingId && { buildingId }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate })
            };

            const response = await bookingApi.getAdminBookingHistory(params);

            if (response.status === 'success') {
                setBookings(response.data || []);
                setTotalBookings(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
                console.log('Admin booking history loaded:', response.data?.length || 0);
            }
        } catch (err) {
            console.error('Error fetching admin booking history:', err);
            setError(err.message || 'Failed to fetch booking history');
            showToast.error('Gagal memuat riwayat peminjaman');
        } finally {
            setLoading(false);
        }
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'building':
                setBuildingFilter(value);
                break;
            case 'startDate':
                setStartDateFilter(value);
                break;
            case 'endDate':
                setEndDateFilter(value);
                break;
            default:
                break;
        }
        setCurrentPage(1);
        fetchBookingHistory(1,
            filterType === 'building' ? value : buildingFilter,
            filterType === 'startDate' ? value : startDateFilter,
            filterType === 'endDate' ? value : endDateFilter
        );
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchBookingHistory(page, buildingFilter, startDateFilter, endDateFilter);
    };

    // Process refund for a booking
    const processRefund = async (bookingId, refundData) => {
        try {
            setActionLoading(true);

            console.log('=== PROCESS BOOKING REFUND ===');
            console.log('Booking ID:', bookingId);
            console.log('Refund data:', refundData);

            await bookingApi.processRefund(bookingId, refundData);
            showToast.success('Refund berhasil diproses');
            fetchBookingHistory(currentPage, buildingFilter, startDateFilter, endDateFilter);
            return true;
        } catch (err) {
            console.error('Error processing refund:', err);
            showToast.error('Gagal memproses refund');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Clear filters
    const clearFilters = () => {
        setBuildingFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
        setCurrentPage(1);
        fetchBookingHistory(1, '', '', '');
    };

    // Refresh data
    const refreshData = () => {
        fetchBookingHistory(currentPage, buildingFilter, startDateFilter, endDateFilter);
    };

    // Initial data fetch
    useEffect(() => {
        fetchBookingHistory();
    }, []);

    return {
        // State
        bookings,
        loading,
        error,
        currentPage,
        totalPages,
        totalBookings,
        actionLoading,
        buildingFilter,
        startDateFilter,
        endDateFilter,

        // Actions
        handleFilterChange,
        handlePageChange,
        processRefund,
        clearFilters,
        refreshData
    };
}; 