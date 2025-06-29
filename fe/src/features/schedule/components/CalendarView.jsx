import React, { useState, useMemo } from 'react';
import {
    Box,
    Grid,
    GridItem,
    VStack,
    HStack,
    Text,
    IconButton,
    Badge,
    Center,
    Flex
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { H2, H3, Label, Caption } from '@shared/components/Typography';
import { COLORS } from '@utils/designTokens';

const CalendarView = ({ bookings = [], onDateSelect, selectedDate, onBookingClick, onMonthChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const statusConfig = {
        APPROVED: {
            label: 'Disetujui',
            color: COLORS.primary,
            bgColor: COLORS.primary,
            textColor: 'white'
        },
        PENDING: {
            label: 'Diproses',
            color: '#FF8C00',
            bgColor: '#FF8C00',
            textColor: 'white'
        },
        PROCESSING: {
            label: 'Diproses',
            color: '#FF8C00',
            bgColor: '#FF8C00',
            textColor: 'white'
        },
        COMPLETED: {
            label: 'Selesai',
            color: '#9CA3AF',
            bgColor: '#9CA3AF',
            textColor: 'white'
        },
        CANCELLED: {
            label: 'Dibatalkan',
            color: '#EF4444',
            bgColor: '#EF4444',
            textColor: 'white'
        }
    };

    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of month and how many days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Previous month days to show
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();

        const calendar = [];

        // Previous month trailing days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            calendar.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, daysInPrevMonth - i)
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            calendar.push({
                day,
                isCurrentMonth: true,
                date: new Date(year, month, day)
            });
        }

        // Next month leading days
        const totalCells = Math.ceil(calendar.length / 7) * 7;
        let nextMonthDay = 1;
        while (calendar.length < totalCells) {
            calendar.push({
                day: nextMonthDay,
                isCurrentMonth: false,
                date: new Date(year, month + 1, nextMonthDay)
            });
            nextMonthDay++;
        }

        return calendar;
    }, [currentDate]);

    const getBookingsForDate = (date) => {
        // Format date to DD-MM-YYYY to match API format
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const dateStr = `${day}-${month}-${year}`;

        // Debug logging
        console.log('Filtering bookings for date:', dateStr);
        console.log('Available bookings:', bookings);

        const filteredBookings = bookings.filter(booking => {
            // Check both date and startDate properties for compatibility
            const bookingDate = booking.date || booking.startDate;
            console.log('Comparing:', bookingDate, 'with', dateStr);
            return bookingDate === dateStr;
        });

        console.log('Filtered bookings:', filteredBookings);
        return filteredBookings;
    };

    // Navigate months
    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);

            // Call onMonthChange if provided to fetch data for new month
            if (onMonthChange) {
                const month = newDate.getMonth() + 1; // JavaScript months are 0-indexed
                const year = newDate.getFullYear();
                onMonthChange(month, year);
            }

            return newDate;
        });
    };

    // Format month year
    const monthYear = currentDate.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                p={6}
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
            >
                <VStack spacing={4}>
                    {/* Title & Navigation */}
                    <HStack justify="space-between" w="100%" align="center">
                        <HStack spacing={3}>
                            <CalendarIcon size={24} color={COLORS.primary} />
                            <VStack align="start" spacing={0}>
                                <H2 color={COLORS.text} fontFamily="Inter, sans-serif">
                                    Jadwal Peminjaman
                                </H2>
                                <Text fontSize="sm" color="gray.600" fontFamily="Inter, sans-serif">
                                    Kelola dan pantau jadwal ruangan
                                </Text>
                            </VStack>
                        </HStack>

                        <HStack spacing={2}>
                            <IconButton
                                aria-label="Previous month"
                                icon={<ChevronLeft size={20} />}
                                variant="ghost"
                                onClick={() => navigateMonth(-1)}
                                borderRadius="full"
                                bg="rgba(255, 255, 255, 0.6)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                _hover={{
                                    bg: "rgba(255, 255, 255, 0.8)",
                                    transform: "translateY(-1px)"
                                }}
                                transition="all 0.2s"
                            />

                            <Center minW="200px">
                                <H3 textAlign="center" color={COLORS.text} fontFamily="Inter, sans-serif">
                                    {monthYear}
                                </H3>
                            </Center>

                            <IconButton
                                aria-label="Next month"
                                icon={<ChevronRight size={20} />}
                                variant="ghost"
                                onClick={() => navigateMonth(1)}
                                borderRadius="full"
                                bg="rgba(255, 255, 255, 0.6)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                _hover={{
                                    bg: "rgba(255, 255, 255, 0.8)",
                                    transform: "translateY(-1px)"
                                }}
                                transition="all 0.2s"
                            />
                        </HStack>
                    </HStack>

                    {/* Status Legend */}
                    <HStack spacing={6} justify="center" flexWrap="wrap">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <HStack key={key} spacing={2}>
                                <Box
                                    w="12px"
                                    h="12px"
                                    bg={config.bgColor}
                                    borderRadius="4px"
                                />
                                <Text fontSize="sm" color={COLORS.text} fontFamily="Inter, sans-serif">
                                    {config.label}
                                </Text>
                            </HStack>
                        ))}
                    </HStack>
                </VStack>
            </Box>

            {/* Calendar */}
            <Box
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                overflow="hidden"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
            >
                <VStack spacing={0}>
                    {/* Day Headers */}
                    <Grid templateColumns="repeat(7, 1fr)" gap={0} w="100%">
                        {dayNames.map(day => (
                            <GridItem key={day}>
                                <Box
                                    p={4}
                                    textAlign="center"
                                    bg="rgba(33, 209, 121, 0.05)"
                                    borderRight="1px solid rgba(215, 215, 215, 0.3)"
                                    _last={{ borderRight: "none" }}
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight="700"
                                        color={COLORS.primary}
                                        fontFamily="Inter, sans-serif"
                                    >
                                        {day}
                                    </Text>
                                </Box>
                            </GridItem>
                        ))}
                    </Grid>

                    {/* Calendar Days */}
                    <Grid templateColumns="repeat(7, 1fr)" gap={0} w="100%">
                        {calendarData.map((dayData, index) => {
                            const dayBookings = getBookingsForDate(dayData.date);
                            const isToday = dayData.date.toDateString() === new Date().toDateString();
                            const isSelected = selectedDate && dayData.date.toDateString() === selectedDate.toDateString();
                            const hasBookings = dayBookings.length > 0;

                            return (
                                <GridItem key={index}>
                                    <Box
                                        minH="120px"
                                        p={3}
                                        borderRight="1px solid rgba(215, 215, 215, 0.3)"
                                        borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                                        bg={isSelected ? "rgba(33, 209, 121, 0.08)" : "transparent"}
                                        cursor="pointer"
                                        onClick={() => onDateSelect && onDateSelect(dayData.date)}
                                        _hover={{
                                            bg: isSelected ? "rgba(33, 209, 121, 0.12)" : "rgba(33, 209, 121, 0.04)"
                                        }}
                                        transition="all 0.2s"
                                        _last={{ borderRight: "none" }}
                                    >
                                        <VStack spacing={2} align="stretch" h="100%">
                                            {/* Day Number */}
                                            <Flex justify="space-between" align="center">
                                                <Box
                                                    w="32px"
                                                    h="32px"
                                                    borderRadius="full"
                                                    bg={isToday ? COLORS.primary : "transparent"}
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    border={hasBookings && !isToday ? `2px solid ${COLORS.primary}` : "none"}
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight={isToday ? "700" : dayData.isCurrentMonth ? "600" : "400"}
                                                        color={
                                                            isToday ? "white" :
                                                                !dayData.isCurrentMonth ? "gray.400" :
                                                                    hasBookings ? COLORS.primary :
                                                                        COLORS.text
                                                        }
                                                        fontFamily="Inter, sans-serif"
                                                    >
                                                        {dayData.day}
                                                    </Text>
                                                </Box>
                                                {hasBookings && (
                                                    <Badge
                                                        bg={COLORS.primary}
                                                        color="white"
                                                        borderRadius="full"
                                                        fontSize="xs"
                                                        minW="20px"
                                                        h="20px"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        {dayBookings.length}
                                                    </Badge>
                                                )}
                                            </Flex>

                                            {/* Booking List */}
                                            <Box flex={1} overflowY="auto" maxH="80px">
                                                <VStack spacing={1} align="stretch">
                                                    {dayBookings.slice(0, 2).map((booking, idx) => (
                                                        <Box
                                                            key={idx}
                                                            bg={statusConfig[booking.status]?.bgColor || '#9CA3AF'}
                                                            borderRadius="8px"
                                                            p={2}
                                                            cursor="pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onBookingClick) {
                                                                    onBookingClick(booking);
                                                                }
                                                            }}
                                                            _hover={{
                                                                transform: 'scale(1.02)',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                            transition="all 0.2s"
                                                        >
                                                            <VStack spacing={0} align="start">
                                                                <Text
                                                                    fontSize="xs"
                                                                    fontWeight="600"
                                                                    color="white"
                                                                    noOfLines={1}
                                                                    fontFamily="Inter, sans-serif"
                                                                >
                                                                    {booking.activityName}
                                                                </Text>
                                                                <Text
                                                                    fontSize="xs"
                                                                    color="white"
                                                                    opacity={0.9}
                                                                    noOfLines={1}
                                                                    fontFamily="Inter, sans-serif"
                                                                >
                                                                    {booking.startTime}-{booking.endTime}
                                                                </Text>
                                                            </VStack>
                                                        </Box>
                                                    ))}
                                                    {dayBookings.length > 2 && (
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                            textAlign="center"
                                                            fontFamily="Inter, sans-serif"
                                                        >
                                                            +{dayBookings.length - 2} lainnya
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </Box>
                                        </VStack>
                                    </Box>
                                </GridItem>
                            );
                        })}
                    </Grid>
                </VStack>
            </Box>
        </VStack>
    );
};

export default CalendarView; 