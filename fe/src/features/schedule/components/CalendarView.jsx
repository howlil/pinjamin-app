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
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@shared/components/Card';
import { H2, Label, Caption } from '@shared/components/Typography';
import { COLORS } from '@utils/designTokens';

const CalendarView = ({ bookings = [], onDateSelect, selectedDate, onBookingClick }) => {
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

        console.log('Looking for bookings on:', dateStr, 'in', bookings);

        return bookings.filter(booking => {
            const match = booking.date === dateStr;
            if (match) {
                console.log('Found booking:', booking);
            }
            return match;
        });
    };

    // Navigate months
    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    // Format month year
    const monthYear = currentDate.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <VStack spacing={6} align="stretch">
            {/* Calendar Header */}
            <Card variant="transparent">
                <VStack paddingBottom={8} spacing={4}>
                    {/* Month Navigation */}
                    <HStack justify="space-between" w="100%">
                        <IconButton
                            aria-label="Previous month"
                            icon={<ChevronLeft size={20} />}
                            variant="ghost"
                            onClick={() => navigateMonth(-1)}
                            borderRadius="full"
                            _hover={{ bg: `${COLORS.primary}20` }}
                        />

                        <H2 textAlign="center" color={COLORS.text}>
                            {monthYear}
                        </H2>

                        <IconButton
                            aria-label="Next month"
                            icon={<ChevronRight size={20} />}
                            variant="ghost"
                            onClick={() => navigateMonth(1)}
                            borderRadius="full"
                            _hover={{ bg: `${COLORS.primary}20` }}
                        />
                    </HStack>

                    {/* Status Legend */}
                    <HStack spacing={6} justify="center" flexWrap="wrap">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <HStack key={key} spacing={2}>
                                <Box
                                    w="12px"
                                    h="12px"
                                    bg={config.bgColor}
                                    borderRadius="sm"
                                />
                                <Caption color={COLORS.text}>
                                    {config.label}
                                </Caption>
                            </HStack>
                        ))}
                    </HStack>
                </VStack>

                <VStack spacing={0}>
                    {/* Day Headers */}
                    <Grid templateColumns="repeat(7, 1fr)" gap={0} w="100%">
                        {dayNames.map(day => (
                            <GridItem key={day}>
                                <Box
                                    p={3}
                                    textAlign="center"
                                    borderBottom="1px solid"
                                    borderColor="gray.200"
                                    bg="gray.50"
                                >
                                    <Label fontSize="sm" color="gray.600">
                                        {day}
                                    </Label>
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

                            return (
                                <GridItem key={index}>
                                    <Box
                                        minH="100px"
                                        p={2}
                                        borderRight="1px solid"
                                        borderBottom="1px solid"
                                        borderColor="gray.200"
                                        bg={isSelected ? `${COLORS.primary}10` : 'transparent'}
                                        cursor="pointer"
                                        onClick={() => onDateSelect && onDateSelect(dayData.date)}
                                        _hover={{
                                            bg: isSelected ? `${COLORS.primary}20` : `${COLORS.primary}05`
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <VStack spacing={1} align="stretch" h="100%">
                                            {/* Day Number */}
                                            <HStack justify="space-between" flexShrink={0}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight={isToday ? "bold" : "normal"}
                                                    color={
                                                        !dayData.isCurrentMonth ? "gray.400" :
                                                            isToday ? COLORS.primary :
                                                                COLORS.text
                                                    }
                                                    bg={isToday ? `${COLORS.primary}20` : 'transparent'}
                                                    borderRadius="full"
                                                    w={isToday ? "24px" : "auto"}
                                                    h={isToday ? "24px" : "auto"}
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    {dayData.day}
                                                </Text>
                                            </HStack>

                                            {/* Booking Slots - Scrollable */}
                                            <Box
                                                flex={1}
                                                overflowY="auto"
                                                overflowX="hidden"
                                                maxH="70px"
                                                css={{
                                                    '&::-webkit-scrollbar': {
                                                        width: '2px',
                                                    },
                                                    '&::-webkit-scrollbar-track': {
                                                        background: 'transparent',
                                                    },
                                                    '&::-webkit-scrollbar-thumb': {
                                                        background: COLORS.primary,
                                                        borderRadius: '2px',
                                                    },
                                                }}
                                            >
                                                <VStack spacing={1} align="stretch">
                                                    {dayBookings.map((booking, idx) => (
                                                       
                                                            <Badge
                                                                size="sm"
                                                                bg={statusConfig[booking.status]?.bgColor || '#9CA3AF'}
                                                                color="white"
                                                                fontSize="8px"
                                                                p={1}
                                                                borderRadius="4px"
                                                                textAlign="left"
                                                                cursor="pointer"
                                                                w="100%"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (onBookingClick) {
                                                                        onBookingClick(booking);
                                                                    }
                                                                }}
                                                                _hover={{
                                                                    transform: 'scale(1.02)',
                                                                    boxShadow: 'sm'
                                                                }}
                                                                transition="all 0.2s"
                                                            >
                                                                <VStack spacing={0} align="start" w="100%">
                                                                    <Text fontSize="7px" noOfLines={1} fontWeight="bold">
                                                                        {booking.activityName}
                                                                    </Text>
                                                                    <Text fontSize="6px" noOfLines={1} opacity={0.8}>
                                                                        {booking.startTime}-{booking.endTime}
                                                                    </Text>
                                                                    <Text fontSize="6px" noOfLines={1} opacity={0.8}>
                                                                        {booking.buildingName}
                                                                    </Text>
                                                                </VStack>
                                                            </Badge>
                                                    ))}
                                                </VStack>
                                            </Box>
                                        </VStack>
                                    </Box>
                                </GridItem>
                            );
                        })}
                    </Grid>
                </VStack>
            </Card>
        </VStack>
    );
};

export default CalendarView; 