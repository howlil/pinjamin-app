import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Building, Calendar, Users, TrendingUp } from 'lucide-react';
import { COLORS } from '@/utils/designTokens';
import { dashboardApi } from '@/services/apiService';

// Mock data - in a real app, this would come from an API
const mockStats = [
    {
        id: 1,
        label: 'Total Gedung',
        value: 24,
        icon: Building,
        change: '+4%',
        color: 'blue.500'
    },
    {
        id: 2,
        label: 'Total Peminjaman',
        value: 147,
        icon: Calendar,
        change: '+12%',
        color: COLORS.primary
    },
    {
        id: 3,
        label: 'Total Pengguna',
        value: 573,
        icon: Users,
        change: '+9%',
        color: 'purple.500'
    },
    {
        id: 4,
        label: 'Transaksi Bulan Ini',
        value: 'Rp 8,2jt',
        icon: TrendingUp,
        change: '+23%',
        color: 'orange.500'
    }
];

const mockBookings = [
    {
        id: 1,
        room: 'Seminar Gedung F',
        user: 'Ahmad Fauzi',
        date: '24 Mar 2024',
        time: '07:30 - 10:00',
        status: 'diproses'
    },
    {
        id: 2,
        room: 'Auditorium Utama',
        user: 'Dewi Safitri',
        date: '25 Mar 2024',
        time: '13:00 - 16:00',
        status: 'disetujui'
    },
    {
        id: 3,
        room: 'Ruang Rapat A',
        user: 'Budi Santoso',
        date: '26 Mar 2024',
        time: '09:00 - 12:00',
        status: 'ditolak'
    },
    {
        id: 4,
        room: 'Laboratorium Komputer',
        user: 'Siti Nuraini',
        date: '27 Mar 2024',
        time: '14:30 - 16:30',
        status: 'diproses'
    },
    {
        id: 5,
        room: 'Seminar Gedung G',
        user: 'Rudi Hermawan',
        date: '28 Mar 2024',
        time: '08:00 - 11:00',
        status: 'disetujui'
    }
];

const mockBookingsData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 59 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 81 },
    { month: 'Mei', value: 56 },
    { month: 'Jun', value: 55 }
];

const mockTransactionsData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 63 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 70 },
    { month: 'Mei', value: 75 },
    { month: 'Jun', value: 82 }
];

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

                // Fetch real data from API
                const [bookingStatsResponse, transactionStatsResponse] = await Promise.all([
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

                    // Update stats with real data
                    const totalRevenue = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalRevenue, 0);
                    const totalTransactions = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalTransactions, 0);

                    setStats([
                        ...mockStats.slice(0, 2), // Keep mock data for Total Gedung and Total Peminjaman
                        {
                            id: 3,
                            label: 'Total Transaksi',
                            value: totalTransactions,
                            icon: Calendar,
                            change: '+12%',
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
                } else {
                    // Use mock stats if API fails
                    setStats(mockStats);
                }

                // Keep mock data for recent bookings (you can replace this with real API later)
                setBookings(mockBookings);
            } catch (err) {
                setError(err.message || 'Failed to fetch dashboard data');
                toast({
                    title: 'Error',
                    description: 'Failed to fetch dashboard data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });

                // Fallback to mock data on error
                setStats(mockStats);
                setBookings(mockBookings);
                setBookingsData(mockBookingsData);
                setTransactionsData(mockTransactionsData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [month, year, toast]);

    const refreshDashboardData = async () => {
        // Re-fetch data
        setIsLoading(true);
        setError(null);

        try {
            // Build query parameters
            const queryParams = {};
            if (month) queryParams.month = month;
            if (year) queryParams.year = year;

            // Fetch real data from API
            const [bookingStatsResponse, transactionStatsResponse] = await Promise.all([
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

                // Update stats with real data
                const totalRevenue = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalRevenue, 0);
                const totalTransactions = transactionStatsResponse.data.reduce((sum, item) => sum + item.totalTransactions, 0);

                setStats([
                    ...mockStats.slice(0, 2), // Keep mock data for Total Gedung and Total Peminjaman
                    {
                        id: 3,
                        label: 'Total Transaksi',
                        value: totalTransactions,
                        icon: Calendar,
                        change: '+12%',
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

            // Keep mock data for recent bookings
            setBookings(mockBookings);

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

            // Fallback to mock data on error
            setStats(mockStats);
            setBookings(mockBookings);
            setBookingsData(mockBookingsData);
            setTransactionsData(mockTransactionsData);
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