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

    // Fetch admin bookings data (only PROCESSING status bookings)
    const fetchBookings = async (page = 1, search = '', status = '') => {
        try {
            setLoading(true);
            setError(null);

            console.log('=== FETCH ADMIN BOOKINGS ===');
            console.log('Page:', page, 'Search:', search, 'Status:', status);

            const params = {
                page,
                limit
            };

            // Use admin booking endpoint (only shows PROCESSING status)
            const response = await bookingApi.getAdminBookings(params);

            if (response.status === 'success') {
                let filteredBookings = response.data || [];

                // Apply client-side filtering for search and status if needed
                if (search) {
                    filteredBookings = filteredBookings.filter(booking =>
                        booking.borrowerName?.toLowerCase().includes(search.toLowerCase()) ||
                        booking.buildingName?.toLowerCase().includes(search.toLowerCase()) ||
                        booking.activityName?.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (status) {
                    filteredBookings = filteredBookings.filter(booking =>
                        booking.status === status
                    );
                }

                setBookings(filteredBookings);
                setTotalBookings(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);

                console.log('Admin bookings loaded:', filteredBookings.length);
            }
        } catch (err) {
            console.error('Error fetching admin bookings:', err);
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

    // Approve booking using new approval API
    const approveBooking = async (bookingId) => {
        try {
            setActionLoading(true);

            console.log('=== APPROVE BOOKING ===');
            console.log('Booking ID:', bookingId);

            await bookingApi.updateBookingApproval(bookingId, 'APPROVED');
            showToast.success('Peminjaman berhasil disetujui');
            fetchBookings(currentPage, searchTerm, statusFilter);
            return true;
        } catch (err) {
            console.error('Error approving booking:', err);
            showToast.error('Gagal menyetujui peminjaman');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Reject booking using new approval API
    const rejectBooking = async (bookingId, rejectionReason) => {
        try {
            setActionLoading(true);

            console.log('=== REJECT BOOKING ===');
            console.log('Booking ID:', bookingId);
            console.log('Rejection reason:', rejectionReason);

            await bookingApi.updateBookingApproval(bookingId, 'REJECTED', rejectionReason);
            showToast.success('Peminjaman berhasil ditolak');
            fetchBookings(currentPage, searchTerm, statusFilter);
            return true;
        } catch (err) {
            console.error('Error rejecting booking:', err);
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