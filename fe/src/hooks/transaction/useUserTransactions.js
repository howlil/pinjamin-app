import { useState, useEffect } from 'react';
import { transactionApi } from '@/services/transaction/transactionService';
import { bookingApi } from '@/services/booking/bookingService';
import { showToast } from '@/utils/helpers';

export const useUserTransactions = () => {
    // State management
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [generatingInvoice, setGeneratingInvoice] = useState(false);

    const limit = 10; // Items per page

    // Fetch user transaction history
    const fetchUserTransactions = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit
            };

            console.log('=== FETCH USER TRANSACTIONS ===');
            console.log('Fetching page:', page);

            const response = await transactionApi.getUserTransactionHistory(params);

            if (response.status === 'success') {
                setTransactions(response.data || []);
                setTotalTransactions(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
                console.log('User transactions loaded:', response.data?.length || 0);
            }
        } catch (err) {
            console.error('Error fetching user transactions:', err);
            setError(err.message || 'Failed to fetch transaction history');
            showToast.error('Gagal memuat riwayat transaksi');
        } finally {
            setLoading(false);
        }
    };

    // Generate and download invoice
    const generateInvoice = async (bookingId, buildingName) => {
        try {
            setGeneratingInvoice(true);

            console.log('=== GENERATE INVOICE ===');
            console.log('Booking ID:', bookingId);

            const response = await bookingApi.generateInvoice(bookingId);

            if (response.status === 'success' && response.data?.invoiceUrl) {
                // Create full URL if relative path
                let invoiceUrl = response.data.invoiceUrl;
                if (invoiceUrl.startsWith('/')) {
                    // Get the base URL from environment or fallback to default
                    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                    invoiceUrl = baseUrl + invoiceUrl;
                }

                // Open invoice in new tab for download
                window.open(invoiceUrl, '_blank');

                showToast.success(`Invoice ${buildingName} berhasil dibuat`);

            } else {
                throw new Error(response.message || 'Gagal membuat invoice');
            }
        } catch (err) {
            console.error('Error generating invoice:', err);

            let errorMessage = 'Gagal membuat invoice';
            if (err.message) {
                errorMessage = err.message;
            } else if (err.data?.message) {
                errorMessage = Array.isArray(err.data.message)
                    ? err.data.message.join(', ')
                    : err.data.message;
            }

            showToast.error(errorMessage);
        } finally {
            setGeneratingInvoice(false);
        }
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchUserTransactions(page);
    };

    // Refresh data
    const refreshData = () => {
        fetchUserTransactions(currentPage);
    };

    // Initial data fetch
    useEffect(() => {
        fetchUserTransactions();
    }, []);

    return {
        // State
        transactions,
        loading,
        error,
        currentPage,
        totalPages,
        totalTransactions,
        generatingInvoice,

        // Actions
        handlePageChange,
        refreshData,
        generateInvoice
    };
}; 