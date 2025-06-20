import React, { useState } from 'react';
import {
    Box,
    SimpleGrid,
    Spinner,
    Center,
    Text,
    Flex,
    Heading
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Filter, Calendar } from 'lucide-react';

// Import modular components
import StatCards from '@/components/dashboard/StatCards';
import RecentBookingsTable from '@/components/dashboard/RecentBookingsTable';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import BookingStatsByBuilding from '@/components/dashboard/BookingStatsByBuilding';
import { GlassCard } from '@/components/ui';
import { DashboardFilters } from '@/components/admin/dashboard';

// Import hooks
import { useDashboardData } from '@/hooks/useDashboardData';
import { COLORS, ANIMATIONS } from '@/utils/designTokens';

const DashboardPage = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Fetch dashboard data with optional month/year filters
    const {
        stats,
        bookings,
        bookingsData,
        transactionsData,
        bookingStatistics,
        isLoading,
        error
    } = useDashboardData(selectedMonth, selectedYear);

    const handleBookingClick = (booking) => {
        console.log('Booking clicked:', booking);
        // In a real app, this might navigate to a booking detail page
    };

    // Generate year options (current year - 2 to current year)
    const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - 2 + i);

    const monthOptions = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' }
    ];

    if (isLoading) {
        return (
            <Center h="400px">
                <Spinner size="xl" color={COLORS.primary} thickness="4px" />
            </Center>
        );
    }

    return (
        <Box>
            {/* Welcome Section with Filters */}
            <GlassCard
                p={6}
                mb={6}
                as={motion.div}
                {...ANIMATIONS.card}
            >
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align={{ base: 'start', md: 'center' }}
                    gap={4}
                >
                    <Box>
                        <Heading
                            size="lg"
                            color={COLORS.black}
                            fontWeight="bold"
                            mb={2}
                        >
                            Selamat datang kembali! 👋
                        </Heading>
                        <Text color={COLORS.gray[600]} fontSize="md">
                            Berikut ringkasan aktivitas terbaru sistem peminjaman ruangan.
                        </Text>
                    </Box>
                    <DashboardFilters
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={setSelectedMonth}
                        onYearChange={setSelectedYear}
                        monthOptions={monthOptions}
                        yearOptions={yearOptions}
                    />
                </Flex>
            </GlassCard>

            {/* Stats Cards */}
            <Box
                as={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                mb={6}
            >
                <StatCards stats={stats} />
            </Box>

            {/* Main Content Grid */}
            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6} mb={6}>
                {/* Recent Activity */}
                <Box
                    as={motion.div}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <RecentBookingsTable
                        bookings={bookings}
                        onRowClick={handleBookingClick}
                    />
                </Box>

                {/* Analytics Chart */}
                <Box
                    as={motion.div}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <AnalyticsCard
                        bookingsData={bookingsData}
                        transactionsData={transactionsData}
                    />
                </Box>
            </SimpleGrid>

            {/* Secondary Content Grid */}
            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
                {/* Booking Statistics by Building */}
                <Box
                    as={motion.div}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <BookingStatsByBuilding
                        bookingStatistics={bookingStatistics}
                    />
                </Box>

                {/* System Insights */}
                <Box
                    as={motion.div}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    <GlassCard p={6} h="300px">
                        <Flex
                            align="center"
                            justify="center"
                            h="full"
                            direction="column"
                            gap={4}
                        >
                            <Box
                                w="80px"
                                h="80px"
                                borderRadius="full"
                                bg={`${COLORS.primary}15`}
                                border={`2px solid ${COLORS.primary}30`}
                                display="flex"
                                align="center"
                                justify="center"
                            >
                                <Calendar size={32} color={COLORS.primary} />
                            </Box>
                            <Text
                                color={COLORS.gray[600]}
                                textAlign="center"
                                fontSize="md"
                                fontWeight="medium"
                            >
                                Wawasan Sistem
                            </Text>
                            <Text
                                color={COLORS.gray[500]}
                                textAlign="center"
                                fontSize="sm"
                            >
                                Analisis mendalam tentang penggunaan ruangan dan tren peminjaman
                            </Text>
                        </Flex>
                    </GlassCard>
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default DashboardPage; 