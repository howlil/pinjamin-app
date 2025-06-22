import { useState, useEffect } from 'react';
import { transactionApi } from '@/services/transaction/transactionService';
import { showToast } from '@/utils/helpers';

export const useTransactions = () => {
    // State management
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // Filter states
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

    const limit = 10; // Items per page

    // Fetch transactions data
    const fetchTransactions = async (page = 1, search = '', paymentStatus = '', paymentMethod = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                ...(search && { search }),
                ...(paymentStatus && { paymentStatus }),
                ...(paymentMethod && { paymentMethod })
            };

            const response = await transactionApi.getTransactions(params);

            if (response.status === 'success') {
                setTransactions(response.data || []);
                setTotalTransactions(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch transactions');
            showToast.error('Gagal memuat data transaksi');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        fetchTransactions(1, searchTerm, paymentStatusFilter, paymentMethodFilter);
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'paymentStatus') {
            setPaymentStatusFilter(value);
        } else if (filterType === 'paymentMethod') {
            setPaymentMethodFilter(value);
        }
        setCurrentPage(1);
        fetchTransactions(1, searchTerm,
            filterType === 'paymentStatus' ? value : paymentStatusFilter,
            filterType === 'paymentMethod' ? value : paymentMethodFilter
        );
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchTransactions(page, searchTerm, paymentStatusFilter, paymentMethodFilter);
    };

    // Confirm payment
    const confirmPayment = async (id) => {
        try {
            setActionLoading(true);
            await transactionApi.updateTransactionStatus(id, 'PAID');
            showToast.success('Pembayaran berhasil dikonfirmasi');
            fetchTransactions(currentPage, searchTerm, paymentStatusFilter, paymentMethodFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal mengkonfirmasi pembayaran');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Cancel transaction
    const cancelTransaction = async (id) => {
        try {
            setActionLoading(true);
            await transactionApi.updateTransactionStatus(id, 'CANCELLED');
            showToast.success('Transaksi berhasil dibatalkan');
            fetchTransactions(currentPage, searchTerm, paymentStatusFilter, paymentMethodFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal membatalkan transaksi');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Process refund
    const processRefund = async (id, refundData) => {
        try {
            setActionLoading(true);
            await transactionApi.processRefund(id, refundData);
            showToast.success('Refund berhasil diproses');
            fetchTransactions(currentPage, searchTerm, paymentStatusFilter, paymentMethodFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal memproses refund');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Send payment reminder
    const sendPaymentReminder = async (id) => {
        try {
            setActionLoading(true);
            await transactionApi.sendPaymentReminder(id);
            showToast.success('Pengingat pembayaran berhasil dikirim');
            return true;
        } catch (err) {
            showToast.error('Gagal mengirim pengingat pembayaran');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Export transactions to Excel
    const exportTransactions = async (month, year) => {
        try {
            setActionLoading(true);

            console.log('=== EXPORT TRANSACTIONS ===');
            console.log('Month:', month, 'Year:', year);

            const params = {};
            if (month) params.month = month;
            if (year) params.year = year;

            const response = await transactionApi.exportTransactions(params);

            if (response.status === 'success' && response.data?.fileUrl) {
                // Create download link
                const downloadUrl = response.data.fileUrl;
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `transactions_${month || 'all'}_${year || new Date().getFullYear()}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast.success('Data transaksi berhasil diekspor');
                return true;
            } else {
                throw new Error('File URL tidak ditemukan dalam response');
            }
        } catch (err) {
            console.error('Export error:', err);
            showToast.error('Gagal mengekspor data transaksi');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Refresh data
    const refreshData = () => {
        fetchTransactions(currentPage, searchTerm, paymentStatusFilter, paymentMethodFilter);
    };

    // Initial data fetch
    useEffect(() => {
        fetchTransactions();
    }, []);

    return {
        // State
        transactions,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalTransactions,
        actionLoading,
        paymentStatusFilter,
        paymentMethodFilter,

        // Actions
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        confirmPayment,
        cancelTransaction,
        processRefund,
        sendPaymentReminder,
        exportTransactions,
        refreshData
    };
}; 