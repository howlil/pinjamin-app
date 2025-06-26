import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { dashboardAPI } from './dashboardAPI';

export const useDashboardStatistics = (month = null, year = null) => {
    const [bookingStats, setBookingStats] = useState([]);
    const [transactionStats, setTransactionStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchStatistics = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {};
            if (month) params.month = month;
            if (year) params.year = year;

            const [bookingResponse, transactionResponse] = await Promise.all([
                dashboardAPI.getBookingStatistics(params),
                dashboardAPI.getTransactionStatistics(params)
            ]);

            if (bookingResponse.status === 'success') {
                setBookingStats(bookingResponse.data || []);
            }

            if (transactionResponse.status === 'success') {
                setTransactionStats(transactionResponse.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat statistik dashboard');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat statistik dashboard',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [month, year]);

    const refetch = () => fetchStatistics();

    return {
        bookingStats,
        transactionStats,
        loading,
        error,
        refetch
    };
};

export const useBookingStatistics = (month = null, year = null) => {
    const [bookingStats, setBookingStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchBookingStatistics = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {};
            if (month) params.month = month;
            if (year) params.year = year;

            const response = await dashboardAPI.getBookingStatistics(params);

            if (response.status === 'success') {
                setBookingStats(response.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat statistik peminjaman');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat statistik peminjaman',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingStatistics();
    }, [month, year]);

    const refetch = () => fetchBookingStatistics();

    return {
        bookingStats,
        loading,
        error,
        refetch
    };
};

export const useTransactionStatistics = (month = null, year = null) => {
    const [transactionStats, setTransactionStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchTransactionStatistics = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {};
            if (month) params.month = month;
            if (year) params.year = year;

            const response = await dashboardAPI.getTransactionStatistics(params);

            if (response.status === 'success') {
                setTransactionStats(response.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat statistik transaksi');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat statistik transaksi',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionStatistics();
    }, [month, year]);

    const refetch = () => fetchTransactionStatistics();

    return {
        transactionStats,
        loading,
        error,
        refetch
    };
}; 