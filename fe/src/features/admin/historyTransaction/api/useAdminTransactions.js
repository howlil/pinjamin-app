import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminTransactionAPI } from './adminTransactionAPI';

export const useAdminTransactions = () => {
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
            const response = await adminTransactionAPI.getAdminTransactions(params);

            // Handle both array and object response formats
            if (Array.isArray(response)) {
                // Direct array response
                setTransactions(response);
                setPagination({
                    totalItems: response.length,
                    totalPages: Math.ceil(response.length / 10),
                    currentPage: params.page || 1,
                    itemsPerPage: 10
                });
            } else if (response.status === 'success') {
                // Response with status object
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

export const useExportTransactions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const exportTransactions = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminTransactionAPI.exportTransactions();

            if (response.status === 'success' || response.data) {
                toast.success('Export transaksi berhasil diunduh');
                return response.data || response;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengexport transaksi');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        exportTransactions,
        loading,
        error
    };
}; 