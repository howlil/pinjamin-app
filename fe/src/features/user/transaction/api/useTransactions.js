import { useState, useEffect } from 'react';
import { transactionAPI } from './transactionAPI';
import { showToast } from '@/shared/services/apiErrorHandler';

export const useTransactionHistory = (filters = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchTransactionHistory = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await transactionAPI.getTransactionHistory({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setTransactions(response.data || []);
                setPagination(response.pagination || {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: params.page || 1,
                    itemsPerPage: params.limit || 10
                });
            }
        } catch (err) {
            let errorMessage = err.response?.data?.message || 'Gagal memuat riwayat transaksi';

            // Jika ada detail errors, tambahkan ke pesan
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                const detailErrors = err.response.data.errors
                    .map(error => `${error.field}: ${error.message}`)
                    .join(', ');
                errorMessage = `${errorMessage}. Detail: ${detailErrors}`;
            }

            setError(errorMessage);
            showToast('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionHistory(filters);
    }, [filters.page]);

    const refetch = () => fetchTransactionHistory();

    return {
        transactions,
        loading,
        error,
        pagination,
        fetchTransactionHistory,
        refetch
    };
};

export const useTransactionInvoice = () => {
    const [loading, setLoading] = useState(false);

    const generateInvoice = async (bookingsId) => {
        setLoading(true);
        try {
            // Validasi bookingsId sebelum request
            if (!bookingsId) {
                showToast('error', 'ID booking tidak ditemukan');
                return false;
            }

            console.log('Generating invoice for bookingsId:', bookingsId); // Debug log
            const response = await transactionAPI.generateTransactionInvoice(bookingsId);

            if (response.status === 'success' && response.data?.invoiceUrl) {
                // Open the invoice in a new tab for download
                const invoiceUrl = response.data.invoiceUrl.startsWith('http')
                    ? response.data.invoiceUrl
                    : `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}${response.data.invoiceUrl}`;

                window.open(invoiceUrl, '_blank');
                showToast('success', 'Invoice berhasil dibuat dan akan diunduh');
                return true;
            }
        } catch (err) {
            let errorMessage = err.response?.data?.message || 'Gagal membuat invoice';

            // Jika ada detail errors, tambahkan ke pesan
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                const detailErrors = err.response.data.errors
                    .map(error => `${error.field}: ${error.message}`)
                    .join(', ');
                errorMessage = `${errorMessage}. Detail: ${detailErrors}`;
            }

            showToast('error', errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        generateInvoice,
        loading
    };
};

