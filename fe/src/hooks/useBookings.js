import { useState, useEffect } from 'react';
import { bookingApi } from '@/services/apiService';
import { showToast } from '@/utils/helpers';

export const useBookings = () => {
    // State management
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');

    const limit = 10; // Items per page

    // Fetch bookings data
    const fetchBookings = async (page = 1, search = '', status = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                ...(search && { search }),
                ...(status && { status })
            };

            const response = await bookingApi.getBookings(params);

            if (response.status === 'success') {
                setBookings(response.data || []);
                setTotalBookings(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch bookings');
            showToast.error('Gagal memuat data peminjaman');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        fetchBookings(1, searchTerm, statusFilter);
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'status') {
            setStatusFilter(value);
        }
        setCurrentPage(1);
        fetchBookings(1, searchTerm,
            filterType === 'status' ? value : statusFilter
        );
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchBookings(page, searchTerm, statusFilter);
    };

    // Approve booking
    const approveBooking = async (id) => {
        try {
            setActionLoading(true);
            await bookingApi.updateBookingStatus(id, 'APPROVED');
            showToast.success('Peminjaman berhasil disetujui');
            fetchBookings(currentPage, searchTerm, statusFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal menyetujui peminjaman');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Reject booking
    const rejectBooking = async (id, reason) => {
        try {
            setActionLoading(true);
            await bookingApi.updateBookingStatus(id, 'REJECTED', reason);
            showToast.success('Peminjaman berhasil ditolak');
            fetchBookings(currentPage, searchTerm, statusFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal menolak peminjaman');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Complete booking
    const completeBooking = async (id) => {
        try {
            setActionLoading(true);
            await bookingApi.updateBookingStatus(id, 'COMPLETED');
            showToast.success('Peminjaman berhasil diselesaikan');
            fetchBookings(currentPage, searchTerm, statusFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal menyelesaikan peminjaman');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Cancel booking
    const cancelBooking = async (id, reason) => {
        try {
            setActionLoading(true);
            await bookingApi.updateBookingStatus(id, 'CANCELLED', reason);
            showToast.success('Peminjaman berhasil dibatalkan');
            fetchBookings(currentPage, searchTerm, statusFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal membatalkan peminjaman');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Refresh data
    const refreshData = () => {
        fetchBookings(currentPage, searchTerm, statusFilter);
    };

    // Initial data fetch
    useEffect(() => {
        fetchBookings();
    }, []);

    return {
        // State
        bookings,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalBookings,
        actionLoading,
        statusFilter,

        // Actions
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        approveBooking,
        rejectBooking,
        completeBooking,
        cancelBooking,
        refreshData
    };
}; 