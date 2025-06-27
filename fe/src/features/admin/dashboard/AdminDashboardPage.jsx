import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
    SimpleGrid,
    Spinner,
    Center
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { Calendar, TrendingUp, Building, Users, BarChart3 } from 'lucide-react';
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
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';
import { useDashboardStatistics } from './api/useDashboard';
import DashboardMonthYearPicker from './components/DashboardMonthYearPicker';
import ErrorState from '@shared/components/ErrorState';

const AdminDashboardPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('');
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
    const handlePeriodChange = (value) => {
        setSelectedPeriod(value);

        if (value) {
            const [selectedMonth, selectedYear] = value.split('-');
            setMonth(parseInt(selectedMonth));
            setYear(parseInt(selectedYear));
        } else {
            setMonth(null);
            setYear(null);
        }
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
            <Container maxW="7xl" py={8}>
                <ErrorState
                    title="Error Loading Dashboard"
                    description={error}
                    onRetry={refetch}
                />
            </Container>
        );
    }

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <HStack justify="space-between" align="center">
                    <HStack spacing={4}>
                        <Box
                            p={3}
                            bg="rgba(33, 209, 121, 0.1)"
                            borderRadius="16px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <BarChart3 size={28} color={COLORS.primary} />
                        </Box>
                        <Box>
                            <Text
                                fontSize="3xl"
                                fontWeight="800"
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Dashboard Admin
                            </Text>
                            <Text
                                fontSize="md"
                                color="gray.600"
                                fontFamily="Inter, sans-serif"
                            >
                                Analisis performa dan statistik sistem
                            </Text>
                        </Box>
                    </HStack>
                </HStack>

                {/* Filter Section */}
                <Box
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(15px)"
                    borderRadius={`${CORNER_RADIUS.components.cards}px`}
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    p={6}
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                >
                    <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
                        <VStack spacing={2} align="start">
                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.600"
                                fontFamily="Inter, sans-serif"
                            >
                                Filter Periode
                            </Text>
                            <DashboardMonthYearPicker
                                value={selectedPeriod}
                                onChange={handlePeriodChange}
                                placeholder="Semua Periode"
                            />
                        </VStack>

                        <VStack spacing={1} align="end">
                            <Text
                                fontSize="sm"
                                color="gray.500"
                                fontFamily="Inter, sans-serif"
                            >
                                Status Filter
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={selectedPeriod ? COLORS.primary : "gray.500"}
                                fontFamily="Inter, sans-serif"
                            >
                                {selectedPeriod
                                    ? (() => {
                                        const [month, year] = selectedPeriod.split('-');
                                        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                                            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                                        return `${monthNames[parseInt(month) - 1]} ${year}`;
                                    })()
                                    : 'Menampilkan semua data'
                                }
                            </Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Stats Cards */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <Box
                        bg="rgba(255, 255, 255, 0.9)"
                        backdropFilter="blur(15px)"
                        borderRadius={`${CORNER_RADIUS.components.cards}px`}
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        p={6}
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)"
                        }}
                        transition="all 0.3s ease"
                    >
                        <HStack spacing={3} mb={3}>
                            <Box
                                p={3}
                                bg="rgba(33, 209, 121, 0.1)"
                                borderRadius="12px"
                                border="1px solid rgba(33, 209, 121, 0.2)"
                            >
                                <TrendingUp size={20} color={COLORS.primary} />
                            </Box>
                            <Text
                                fontWeight="600"
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Total Peminjaman
                            </Text>
                        </HStack>
                        {loading ? (
                            <Spinner size="lg" color={COLORS.primary} />
                        ) : (
                            <Text
                                fontSize="2xl"
                                fontWeight="700"
                                color={COLORS.primary}
                                fontFamily="Inter, sans-serif"
                            >
                                {totalBookings.toLocaleString('id-ID')}
                            </Text>
                        )}
                    </Box>

                    <Box
                        bg="rgba(255, 255, 255, 0.9)"
                        backdropFilter="blur(15px)"
                        borderRadius={`${CORNER_RADIUS.components.cards}px`}
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        p={6}
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)"
                        }}
                        transition="all 0.3s ease"
                    >
                        <HStack spacing={3} mb={3}>
                            <Box
                                p={3}
                                bg="rgba(34, 197, 94, 0.1)"
                                borderRadius="12px"
                                border="1px solid rgba(34, 197, 94, 0.2)"
                            >
                                <Users size={20} color="green.600" />
                            </Box>
                            <Text
                                fontWeight="600"
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Total Transaksi
                            </Text>
                        </HStack>
                        {loading ? (
                            <Spinner size="lg" color="green.600" />
                        ) : (
                            <Text
                                fontSize="2xl"
                                fontWeight="700"
                                color="green.600"
                                fontFamily="Inter, sans-serif"
                            >
                                {totalTransactions.toLocaleString('id-ID')}
                            </Text>
                        )}
                    </Box>

                    <Box
                        bg="rgba(255, 255, 255, 0.9)"
                        backdropFilter="blur(15px)"
                        borderRadius={`${CORNER_RADIUS.components.cards}px`}
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        p={6}
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)"
                        }}
                        transition="all 0.3s ease"
                    >
                        <HStack spacing={3} mb={3}>
                            <Box
                                p={3}
                                bg="rgba(139, 92, 246, 0.1)"
                                borderRadius="12px"
                                border="1px solid rgba(139, 92, 246, 0.2)"
                            >
                                <Building size={20} color="purple.600" />
                            </Box>
                            <Text
                                fontWeight="600"
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Total Pendapatan
                            </Text>
                        </HStack>
                        {loading ? (
                            <Spinner size="lg" color="purple.600" />
                        ) : (
                            <Text
                                fontSize="xl"
                                fontWeight="700"
                                color="purple.600"
                                fontFamily="Inter, sans-serif"
                            >
                                {formatCurrency(totalRevenue)}
                            </Text>
                        )}
                    </Box>
                </SimpleGrid>

                {/* Charts Section */}
                <VStack spacing={8} w="full">
                    {/* Booking Statistics Chart - Full Width */}
                    <Box
                        bg="rgba(255, 255, 255, 0.9)"
                        backdropFilter="blur(15px)"
                        borderRadius={`${CORNER_RADIUS.components.cards}px`}
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        p={6}
                        w="full"
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                    >
                        <Text
                            fontSize="lg"
                            fontWeight="700"
                            mb={4}
                            color={COLORS.text}
                            fontFamily="Inter, sans-serif"
                        >
                            Statistik Peminjaman per Gedung
                        </Text>

                        {loading ? (
                            <Center h="400px">
                                <VStack spacing={4}>
                                    <Spinner size="xl" color={COLORS.primary} />
                                    <Text color="gray.600" fontFamily="Inter, sans-serif">
                                        Memuat data statistik...
                                    </Text>
                                </VStack>
                            </Center>
                        ) : bookingChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={bookingChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        interval={0}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                                        tickFormatter={(value) => Math.round(value).toString()}
                                        domain={[0, 'dataMax + 1']}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid rgba(215, 215, 215, 0.5)',
                                            borderRadius: '12px',
                                            fontFamily: 'Inter, sans-serif'
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
                                <Text color="gray.500" fontFamily="Inter, sans-serif">
                                    Tidak ada data peminjaman
                                </Text>
                            </Center>
                        )}
                    </Box>

                    {/* Transaction Charts - Side by Side */}
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
                        {/* Transaction Count Chart */}
                        <Box
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(15px)"
                            borderRadius={`${CORNER_RADIUS.components.cards}px`}
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            p={6}
                            boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                        >
                            <Text
                                fontSize="lg"
                                fontWeight="700"
                                mb={4}
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Jumlah Transaksi per Bulan
                            </Text>

                            {loading ? (
                                <Center h="300px">
                                    <VStack spacing={4}>
                                        <Spinner size="xl" color="green.600" />
                                        <Text color="gray.600" fontFamily="Inter, sans-serif">
                                            Memuat data transaksi...
                                        </Text>
                                    </VStack>
                                </Center>
                            ) : transactionChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={transactionChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                                            tickFormatter={(value) => Math.round(value).toString()}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid rgba(215, 215, 215, 0.5)',
                                                borderRadius: '12px',
                                                fontFamily: 'Inter, sans-serif'
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
                                    <Text color="gray.500" fontFamily="Inter, sans-serif">
                                        Tidak ada data transaksi
                                    </Text>
                                </Center>
                            )}
                        </Box>

                        {/* Revenue Chart */}
                        <Box
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(15px)"
                            borderRadius={`${CORNER_RADIUS.components.cards}px`}
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            p={6}
                            boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                        >
                            <Text
                                fontSize="lg"
                                fontWeight="700"
                                mb={4}
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Pendapatan per Bulan
                            </Text>

                            {loading ? (
                                <Center h="300px">
                                    <VStack spacing={4}>
                                        <Spinner size="xl" color="purple.600" />
                                        <Text color="gray.600" fontFamily="Inter, sans-serif">
                                            Memuat data pendapatan...
                                        </Text>
                                    </VStack>
                                </Center>
                            ) : transactionChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={transactionChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                                            tickFormatter={(value) => `${value.toFixed(1)}M`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid rgba(215, 215, 215, 0.5)',
                                                borderRadius: '12px',
                                                fontFamily: 'Inter, sans-serif'
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
                                    <Text color="gray.500" fontFamily="Inter, sans-serif">
                                        Tidak ada data pendapatan
                                    </Text>
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