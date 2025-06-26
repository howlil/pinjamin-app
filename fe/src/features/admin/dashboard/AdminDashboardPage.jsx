import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
    SimpleGrid,
    Input,
    Button,
    Spinner,
    Center
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { Calendar, TrendingUp, Building, Users } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { COLORS } from '@utils/designTokens';
import { useDashboardStatistics } from './api/useDashboard';

const AdminDashboardPage = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);

    const {
        bookingStats,
        transactionStats,
        loading,
        error,
        refetch
    } = useDashboardStatistics(month, year);



    // Handle month-year picker change
    const handleDateChange = (e) => {
        const value = e.target.value; // YYYY-MM format
        setSelectedDate(value);

        if (value) {
            const [selectedYear, selectedMonth] = value.split('-');
            setMonth(parseInt(selectedMonth));
            setYear(parseInt(selectedYear));
        } else {
            setMonth(null);
            setYear(null);
        }
    };

    // Clear filter
    const clearFilter = () => {
        setSelectedDate('');
        setMonth(null);
        setYear(null);
    };

    // Prepare data for line charts
    const bookingChartData = bookingStats.map((item, index) => ({
        name: item.buildingName,
        bookings: item.totalBookings,
        index: index + 1
    }));

    const transactionChartData = transactionStats.map((item) => ({
        month: item.month,
        transactions: item.totalTransactions,
        revenue: item.totalRevenue / 1000000 // Convert to millions
    }));

    // Calculate totals
    const totalBookings = bookingStats.reduce((sum, item) => sum + item.totalBookings, 0);
    const totalTransactions = transactionStats.reduce((sum, item) => sum + item.totalTransactions, 0);
    const totalRevenue = transactionStats.reduce((sum, item) => sum + item.totalRevenue, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (error) {
        return (
            <Container maxW="6xl" py={8}>
                <Box p={6} bg="red.50" borderRadius="24px" textAlign="center">
                    <Text color="red.600">Error loading dashboard data: {error}</Text>
                    <Button mt={4} onClick={refetch} colorScheme="red" variant="outline">
                        Coba Lagi
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Filter Section */}
                <Box p={6} bg="white" borderRadius="24px" boxShadow="sm">
                    <HStack justify="space-between" align="end" wrap="wrap" spacing={4}>
                        <VStack spacing={2} align="start">
                            <Text fontSize="sm" fontWeight="600" color="gray.600">
                                Filter Periode
                            </Text>
                            <HStack spacing={3}>
                                <Box position="relative">
                                    <Input
                                        type="month"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        placeholder="Pilih bulan dan tahun"
                                        size="md"
                                        borderRadius="12px"
                                        w="200px"
                                    />
                                    <Box
                                        position="absolute"
                                        left={3}
                                        top="50%"
                                        transform="translateY(-50%)"
                                        pointerEvents="none"
                                        color="gray.400"
                                    >
                                        <Calendar size={16} />
                                    </Box>
                                </Box>

                                {selectedDate && (
                                    <Button
                                        onClick={clearFilter}
                                        variant="outline"
                                        size="md"
                                        borderRadius="12px"
                                        colorScheme="gray"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </HStack>
                        </VStack>

                        <Text fontSize="sm" color="gray.500">
                            {selectedDate
                                ? `Menampilkan data untuk ${new Date(selectedDate + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
                                : 'Menampilkan semua data'
                            }
                        </Text>
                    </HStack>
                </Box>

                {/* Stats Cards */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <Box p={6} bg="white" borderRadius="24px" boxShadow="sm">
                        <HStack spacing={3} mb={2}>
                            <Box p={2} bg="blue.100" borderRadius="8px">
                                <TrendingUp size={20} color={COLORS.primary} />
                            </Box>
                            <Text fontWeight="bold" color="gray.700">Total Peminjaman</Text>
                        </HStack>
                        {loading ? (
                            <Spinner size="lg" color={COLORS.primary} />
                        ) : (
                            <Text fontSize="2xl" fontWeight="bold" color={COLORS.primary}>
                                {totalBookings.toLocaleString('id-ID')}
                            </Text>
                        )}
                    </Box>

                    <Box p={6} bg="white" borderRadius="24px" boxShadow="sm">
                        <HStack spacing={3} mb={2}>
                            <Box p={2} bg="green.100" borderRadius="8px">
                                <Users size={20} color="green.600" />
                            </Box>
                            <Text fontWeight="bold" color="gray.700">Total Transaksi</Text>
                        </HStack>
                        {loading ? (
                            <Spinner size="lg" color="green.600" />
                        ) : (
                            <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                {totalTransactions.toLocaleString('id-ID')}
                            </Text>
                        )}
                    </Box>

                    <Box p={6} bg="white" borderRadius="24px" boxShadow="sm">
                        <HStack spacing={3} mb={2}>
                            <Box p={2} bg="purple.100" borderRadius="8px">
                                <Building size={20} color="purple.600" />
                            </Box>
                            <Text fontWeight="bold" color="gray.700">Total Pendapatan</Text>
                        </HStack>
                        {loading ? (
                            <Spinner size="lg" color="purple.600" />
                        ) : (
                            <Text fontSize="xl" fontWeight="bold" color="purple.600">
                                {formatCurrency(totalRevenue)}
                            </Text>
                        )}
                    </Box>
                </SimpleGrid>

                {/* Charts Section */}
                <VStack spacing={8} w="full">
                    {/* Booking Statistics Chart - Full Width */}
                    <Box p={6} bg="white" borderRadius="24px" boxShadow="sm" w="full">
                        <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
                            Statistik Peminjaman per Gedung
                        </Text>

                        {loading ? (
                            <Center h="400px">
                                <Spinner size="xl" color={COLORS.primary} />
                            </Center>
                        ) : bookingChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={bookingChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        interval={0}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => Math.round(value).toString()}
                                        domain={[0, 'dataMax + 1']}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value, name) => [
                                            `${Math.round(value)} peminjaman`,
                                            'Jumlah Peminjaman'
                                        ]}
                                        labelFormatter={(label) => `Gedung: ${label}`}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="bookings"
                                        stroke={COLORS.primary}
                                        strokeWidth={3}
                                        dot={{ fill: COLORS.primary, strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: COLORS.primary, strokeWidth: 2 }}
                                        name="Jumlah Peminjaman"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Center h="400px">
                                <Text color="gray.500">Tidak ada data peminjaman</Text>
                            </Center>
                        )}
                    </Box>

                    {/* Transaction Charts - Side by Side */}
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
                        {/* Transaction Count Chart */}
                        <Box p={6} bg="white" borderRadius="24px" boxShadow="sm">
                            <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
                                Jumlah Transaksi per Bulan
                            </Text>

                            {loading ? (
                                <Center h="300px">
                                    <Spinner size="xl" color="green.600" />
                                </Center>
                            ) : transactionChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={transactionChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => Math.round(value).toString()}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px'
                                            }}
                                            formatter={(value) => [`${value} transaksi`, 'Jumlah Transaksi']}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="transactions"
                                            stroke="#22c55e"
                                            strokeWidth={3}
                                            dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, stroke: "#22c55e", strokeWidth: 2 }}
                                            name="Jumlah Transaksi"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <Center h="300px">
                                    <Text color="gray.500">Tidak ada data transaksi</Text>
                                </Center>
                            )}
                        </Box>

                        {/* Revenue Chart */}
                        <Box p={6} bg="white" borderRadius="24px" boxShadow="sm">
                            <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
                                Pendapatan per Bulan
                            </Text>

                            {loading ? (
                                <Center h="300px">
                                    <Spinner size="xl" color="purple.600" />
                                </Center>
                            ) : transactionChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={transactionChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => `${value.toFixed(1)}M`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px'
                                            }}
                                            formatter={(value) => [
                                                formatCurrency(value * 1000000),
                                                'Total Pendapatan'
                                            ]}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 2 }}
                                            name="Pendapatan (Juta)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <Center h="300px">
                                    <Text color="gray.500">Tidak ada data pendapatan</Text>
                                </Center>
                            )}
                        </Box>
                    </SimpleGrid>
                </VStack>
            </VStack>
        </Container>
    );
};

export default AdminDashboardPage; 