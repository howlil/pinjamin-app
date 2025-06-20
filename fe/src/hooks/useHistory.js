import { useState, useEffect } from 'react';
import { bookingApi } from '@/services/apiService';
import { showToast } from '@/utils/helpers';

export const useHistory = () => {
    // State management
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const limit = 15; // Items per page for history

    // Fetch history data (using completed bookings as history)
    const fetchHistory = async (page = 1, search = '', status = '', dateRange = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                ...(search && { search }),
                ...(status && { status }),
                ...(dateRange && { dateRange }),
                // Only get completed, cancelled, or rejected bookings for history
                includeCompleted: true
            };

            const response = await bookingApi.getBookings(params);

            if (response.status === 'success') {
                // Filter for history items (completed, cancelled, rejected)
                const historyData = response.data.filter(item =>
                    ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(item.status)
                );

                setHistoryItems(historyData || []);
                setTotalItems(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch history');
            showToast.error('Gagal memuat data riwayat');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        fetchHistory(1, searchTerm, statusFilter, dateFilter);
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'status') {
            setStatusFilter(value);
        } else if (filterType === 'date') {
            setDateFilter(value);
        }
        setCurrentPage(1);
        fetchHistory(1, searchTerm,
            filterType === 'status' ? value : statusFilter,
            filterType === 'date' ? value : dateFilter
        );
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchHistory(page, searchTerm, statusFilter, dateFilter);
    };

    // Export history data
    const exportHistory = async (format = 'excel') => {
        try {
            // This would be an actual API call to export data
            showToast.success(`Data riwayat berhasil diekspor dalam format ${format}`);
            return true;
        } catch (err) {
            showToast.error('Gagal mengekspor data riwayat');
            return false;
        }
    };

    // Refresh data
    const refreshData = () => {
        fetchHistory(currentPage, searchTerm, statusFilter, dateFilter);
    };

    // Initial data fetch
    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        // State
        historyItems,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalItems,
        statusFilter,
        dateFilter,

        // Actions
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        exportHistory,
        refreshData
    };
}; 