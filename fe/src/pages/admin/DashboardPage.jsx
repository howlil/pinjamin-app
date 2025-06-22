import React, { useState } from 'react';
import {
    Box,
    SimpleGrid,
    Spinner,
    Center,
    Text,
    Flex,
    Heading,
    Select,
    HStack,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Filter, Calendar, ChevronDown, BarChart3 } from 'lucide-react';

// Import modular components
import StatCards from '../../components/dashboard/StatCards';
import RecentBookingsTable from '../../components/dashboard/RecentBookingsTable';
import AnalyticsCard from '../../components/dashboard/AnalyticsCard';
import BookingStatsByBuilding from '../../components/dashboard/BookingStatsByBuilding';

// Import hooks
import { useDashboardData } from '../../hooks/dashboard';
import { COLORS } from '../../utils/designTokens';

const MotionBox = motion(Box);

const DashboardPage = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const padding = useBreakpointValue({ base: 4, md: 6 });

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

    // Get current time greeting
    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 17) return "Selamat Siang";
        return "Selamat Malam";
    };

    if (isLoading) {
        return (
            <Center h="400px">
                <MotionBox
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Spinner size="xl" color={COLORS.primary} thickness="4px" />
                </MotionBox>
            </Center>
        );
    }

    return (
        <Box>
            {/* Welcome Header with Filters */}
            <MotionBox
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                mb={6}
            >
                <Box
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    p={padding}
                    _hover={{
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
                    }}
                    transition="all 0.3s ease"
                >
                    <Flex
                        direction={{ base: 'column', lg: 'row' }}
                        justify="space-between"
                        align={{ base: 'start', lg: 'center' }}
                        gap={4}
                    >
                        <HStack spacing={4}>
                            <Box
                                w={14}
                                h={14}
                                borderRadius="16px"
                                bg="rgba(116, 156, 115, 0.15)"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                                _before={{
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bg: 'linear-gradient(135deg, rgba(116, 156, 115, 0.2), rgba(116, 156, 115, 0.05))',
                                    borderRadius: '16px'
                                }}
                            >
                                <BarChart3
                                    size={24}
                                    color={COLORS.primary}
                                    style={{ position: 'relative', zIndex: 1 }}
                                />
                            </Box>
                            <Box>
                                <Heading
                                    size={{ base: "md", md: "lg" }}
                                    color="#444444"
                                    fontWeight="bold"
                                    mb={1}
                                >
                                    {getTimeGreeting()}! 👋
                                </Heading>
                                <Text
                                    color="#666666"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    lineHeight="1.5"
                                >
                                    Berikut ringkasan aktivitas sistem peminjaman ruangan
                                </Text>
                            </Box>
                        </HStack>

                        {/* Compact Filters */}
                        <Box
                            bg="rgba(255, 255, 255, 0.1)"
                            backdropFilter="blur(8px)"
                            border="1px solid rgba(255, 255, 255, 0.15)"
                            borderRadius="12px"
                            p={3}
                        >
                            <HStack spacing={2} align="center">
                                <Box
                                    w={8}
                                    h={8}
                                    borderRadius="8px"
                                    bg="rgba(116, 156, 115, 0.15)"
                                    border="1px solid rgba(116, 156, 115, 0.2)"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Filter size={14} color={COLORS.primary} />
                                </Box>

                                <Select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    size="sm"
                                    bg="rgba(255, 255, 255, 0.1)"
                                    border="1px solid rgba(255, 255, 255, 0.2)"
                                    borderRadius="8px"
                                    color="#444444"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    _hover={{
                                        bg: "rgba(255, 255, 255, 0.15)",
                                        borderColor: "rgba(116, 156, 115, 0.3)"
                                    }}
                                    _focus={{
                                        bg: "rgba(255, 255, 255, 0.15)",
                                        borderColor: COLORS.primary,
                                        boxShadow: "0 0 0 1px rgba(116, 156, 115, 0.2)"
                                    }}
                                    icon={<ChevronDown size={12} />}
                                    w="110px"
                                >
                                    {monthOptions.map((month) => (
                                        <option
                                            key={month.value}
                                            value={month.value}
                                            style={{
                                                backgroundColor: '#ffffff',
                                                color: '#444444',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {month.label}
                                        </option>
                                    ))}
                                </Select>

                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    size="sm"
                                    bg="rgba(255, 255, 255, 0.1)"
                                    border="1px solid rgba(255, 255, 255, 0.2)"
                                    borderRadius="8px"
                                    color="#444444"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    _hover={{
                                        bg: "rgba(255, 255, 255, 0.15)",
                                        borderColor: "rgba(116, 156, 115, 0.3)"
                                    }}
                                    _focus={{
                                        bg: "rgba(255, 255, 255, 0.15)",
                                        borderColor: COLORS.primary,
                                        boxShadow: "0 0 0 1px rgba(116, 156, 115, 0.2)"
                                    }}
                                    icon={<ChevronDown size={12} />}
                                    w="80px"
                                >
                                    {yearOptions.map((year) => (
                                        <option
                                            key={year}
                                            value={year}
                                            style={{
                                                backgroundColor: '#ffffff',
                                                color: '#444444',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {year}
                                        </option>
                                    ))}
                                </Select>
                            </HStack>
                        </Box>
                    </Flex>
                </Box>
            </MotionBox>

            {/* Stats Cards */}
            <MotionBox
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                mb={6}
            >
                <StatCards stats={stats} />
            </MotionBox>

            {/* Main Content Grid */}
            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6} mb={6}>
                {/* Recent Activity */}
                <MotionBox
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                >
                    <RecentBookingsTable
                        bookings={bookings}
                        onRowClick={handleBookingClick}
                    />
                </MotionBox>

                {/* Analytics Chart */}
                <MotionBox
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                >
                    <AnalyticsCard
                        bookingsData={bookingsData}
                        transactionsData={transactionsData}
                    />
                </MotionBox>
            </SimpleGrid>

            {/* Secondary Content Grid */}
            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
                {/* Booking Statistics by Building */}
                <MotionBox
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                >
                    <BookingStatsByBuilding
                        bookingStatistics={bookingStatistics}
                    />
                </MotionBox>

                {/* System Insights */}
                <MotionBox
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
                >
                    <Box
                        bg="rgba(255, 255, 255, 0.08)"
                        backdropFilter="blur(16px)"
                        border="1px solid rgba(255, 255, 255, 0.12)"
                        borderRadius="20px"
                        boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                        p={padding}
                        h="300px"
                        _hover={{
                            borderColor: "rgba(255, 255, 255, 0.15)",
                            boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
                        }}
                        transition="all 0.3s ease"
                    >
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
                                borderRadius="20px"
                                bg="rgba(116, 156, 115, 0.15)"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                display="flex"
                                align="center"
                                justify="center"
                                position="relative"
                                _before={{
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bg: 'linear-gradient(135deg, rgba(116, 156, 115, 0.3), rgba(116, 156, 115, 0.1))',
                                    borderRadius: '20px'
                                }}
                                _hover={{
                                    transform: "scale(1.05)",
                                    borderColor: "rgba(116, 156, 115, 0.4)"
                                }}
                                transition="all 0.3s ease"
                            >
                                <Calendar
                                    size={32}
                                    color={COLORS.primary}
                                    style={{ position: 'relative', zIndex: 1 }}
                                />
                            </Box>
                            <Text
                                color="#444444"
                                textAlign="center"
                                fontSize="lg"
                                fontWeight="bold"
                            >
                                Wawasan Sistem
                            </Text>
                            <Text
                                color="#666666"
                                textAlign="center"
                                fontSize="sm"
                                fontWeight="medium"
                                lineHeight="1.6"
                                maxW="200px"
                            >
                                Analisis mendalam tentang penggunaan ruangan dan tren peminjaman
                            </Text>
                        </Flex>
                    </Box>
                </MotionBox>
            </SimpleGrid>
        </Box>
    );
};

export default DashboardPage; 