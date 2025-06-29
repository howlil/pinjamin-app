import { useState, useEffect } from 'react';
import { dashboardAPI } from './dashboardAPI';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';

export const useDashboardStatistics = (month = null, year = null) => {
    const [bookingStats, setBookingStats] = useState([]);
    const [transactionStats, setTransactionStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            setError(extractErrorMessage(err));
            throw err;
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
            setError(extractErrorMessage(err));
            throw err;
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
            setError(extractErrorMessage(err));
            throw err;
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