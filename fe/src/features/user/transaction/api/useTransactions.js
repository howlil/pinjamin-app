import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { transactionAPI } from './transactionAPI';

export const useTransactions = (filters = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchTransactions = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await transactionAPI.getUserTransactions({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setTransactions(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data transaksi');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const refetch = () => fetchTransactions();

    return {
        transactions,
        loading,
        error,
        pagination,
        fetchTransactions,
        refetch
    };
};

export const useCreateTransaction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createTransaction = async (transactionData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await transactionAPI.createTransaction(transactionData);

            if (response.status === 'success') {
                toast.success('Transaksi berhasil dibuat');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat transaksi');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createTransaction,
        loading,
        error
    };
};

export const useTransactionInvoice = () => {
    const [loading, setLoading] = useState(false);

    const generateInvoice = async (bookingsId) => {
        setLoading(true);
        try {
            // Validasi bookingsId sebelum request
            if (!bookingsId) {
                toast.error('ID booking tidak ditemukan');
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
                toast.success('Invoice berhasil dibuat dan akan diunduh');
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

            toast.error(errorMessage);
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

