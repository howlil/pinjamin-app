import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { adminTransactionAPI } from './adminTransactionAPI';

export const useAdminTransactions = (filters = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const toast = useToast();

    const fetchTransactions = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminTransactionAPI.getAdminTransactions({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setTransactions(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data transaksi');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat data transaksi',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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

export const useExportTransactions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const exportTransactions = async (month = null, year = null) => {
        setLoading(true);
        setError(null);

        try {
            const params = {};
            if (month) params.month = month;
            if (year) params.year = year;

            const response = await adminTransactionAPI.exportTransactions(params);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Export transaksi berhasil dibuat',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengexport transaksi');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal mengexport transaksi',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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