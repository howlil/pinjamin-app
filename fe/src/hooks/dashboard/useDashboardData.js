import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Building, Calendar, Users, TrendingUp } from 'lucide-react';
import { COLORS } from '../../utils/designTokens';
import { dashboardApi } from '../../services/dashboard/dashboardService';

export const useDashboardData = (month = null, year = null) => {
    const [stats, setStats] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [bookingsData, setBookingsData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [bookingStatistics, setBookingStatistics] = useState([]);
    const [transactionStatistics, setTransactionStatistics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Build query parameters
                const queryParams = {};
                if (month) queryParams.month = month;
                if (year) queryParams.year = year;

                // Fetch all data from API
                const [
                    bookingStatsResponse,
                    transactionStatsResponse
                ] = await Promise.all([
                    dashboardApi.getBookingStatistics(queryParams),
                    dashboardApi.getTransactionStatistics(queryParams)
                ]);

                // Process booking statistics
                if (bookingStatsResponse.status === 'success') {
                    setBookingStatistics(bookingStatsResponse.data);

                    // Transform booking statistics for chart
                    const bookingChartData = bookingStatsResponse.data.map(item => ({
                        name: item.buildingName,
                        value: item.totalBookings
                    }));
                    setBookingsData(bookingChartData);
                }

                // Process transaction statistics
                if (transactionStatsResponse.status === 'success') {
                    setTransactionStatistics(transactionStatsResponse.data);

                    // Transform transaction statistics for chart
                    const transactionChartData = transactionStatsResponse.data.map(item => ({
                        month: item.month,
                        value: item.totalTransactions,
                        revenue: item.totalRevenue
                    }));
                    setTransactionsData(transactionChartData);

                    // Calculate totals for stats
                    const totalRevenue = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalRevenue, 0);
                    const totalTransactions = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalTransactions, 0);

                    // Set stats with real data
                    setStats([
                        {
                            id: 1,
                            label: 'Total Gedung',
                            value: 0, // Will be updated when buildings API is ready
                            icon: Building,
                            change: '0%',
                            color: 'blue.500'
                        },
                        {
                            id: 2,
                            label: 'Total Peminjaman',
                            value: bookingStatsResponse.data.reduce((sum, item) => sum + item.totalBookings, 0),
                            icon: Calendar,
                            change: '+12%',
                            color: COLORS.primary
                        },
                        {
                            id: 3,
                            label: 'Total Transaksi',
                            value: totalTransactions,
                            icon: Users,
                            change: '+9%',
                            color: 'purple.500'
                        },
                        {
                            id: 4,
                            label: 'Total Pendapatan',
                            value: `Rp ${(totalRevenue / 1000000).toFixed(1)}jt`,
                            icon: TrendingUp,
                            change: '+23%',
                            color: 'orange.500'
                        }
                    ]);
                }

            } catch (err) {
                setError(err.message || 'Failed to fetch dashboard data');
                toast({
                    title: 'Error',
                    description: 'Failed to fetch dashboard data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });

                // Set empty states on error
                setStats([]);
                setBookings([]);
                setBookingsData([]);
                setTransactionsData([]);
                setBookingStatistics([]);
                setTransactionStatistics([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [month, year, toast]);

    const refreshDashboardData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Build query parameters
            const queryParams = {};
            if (month) queryParams.month = month;
            if (year) queryParams.year = year;

            // Fetch data from API
            const [
                bookingStatsResponse,
                transactionStatsResponse
            ] = await Promise.all([
                dashboardApi.getBookingStatistics(queryParams),
                dashboardApi.getTransactionStatistics(queryParams)
            ]);

            // Process all responses
            if (bookingStatsResponse.status === 'success') {
                setBookingStatistics(bookingStatsResponse.data);
                const bookingChartData = bookingStatsResponse.data.map(item => ({
                    name: item.buildingName,
                    value: item.totalBookings
                }));
                setBookingsData(bookingChartData);
            }

            if (transactionStatsResponse.status === 'success') {
                setTransactionStatistics(transactionStatsResponse.data);
                const transactionChartData = transactionStatsResponse.data.map(item => ({
                    month: item.month,
                    value: item.totalTransactions,
                    revenue: item.totalRevenue
                }));
                setTransactionsData(transactionChartData);

                // Calculate totals for stats
                const totalRevenue = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalRevenue, 0);
                const totalTransactions = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalTransactions, 0);

                setStats([
                    {
                        id: 1,
                        label: 'Total Gedung',
                        value: 0, // Will be updated when buildings API is ready
                        icon: Building,
                        change: '0%',
                        color: 'blue.500'
                    },
                    {
                        id: 2,
                        label: 'Total Peminjaman',
                        value: bookingStatsResponse.data.reduce((sum, item) => sum + item.totalBookings, 0),
                        icon: Calendar,
                        change: '+12%',
                        color: COLORS.primary
                    },
                    {
                        id: 3,
                        label: 'Total Transaksi',
                        value: totalTransactions,
                        icon: Users,
                        change: '+9%',
                        color: 'purple.500'
                    },
                    {
                        id: 4,
                        label: 'Total Pendapatan',
                        value: `Rp ${(totalRevenue / 1000000).toFixed(1)}jt`,
                        icon: TrendingUp,
                        change: '+23%',
                        color: 'orange.500'
                    }
                ]);
            }

            toast({
                title: 'Success',
                description: 'Dashboard data refreshed',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (err) {
            setError(err.message || 'Failed to refresh dashboard data');
            toast({
                title: 'Error',
                description: 'Failed to refresh dashboard data',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });

            // Set empty states on error
            setStats([]);
            setBookings([]);
            setBookingsData([]);
            setTransactionsData([]);
            setBookingStatistics([]);
            setTransactionStatistics([]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        stats,
        bookings,
        bookingsData,
        transactionsData,
        bookingStatistics,
        transactionStatistics,
        isLoading,
        error,
        refreshDashboardData
    };
}; 