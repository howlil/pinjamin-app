import React, { useState } from 'react';
import { Box, Container, VStack, useDisclosure } from '@chakra-ui/react';
import LoadingSkeleton from '@shared/components/LoadingSkeleton';
import { NoDataEmptyState } from '@shared/components/EmptyState';
import ErrorState from '@shared/components/ErrorState';
import CalendarView from './components/CalendarView';
import BookingPreviewModal from './components/BookingPreviewModal';
import { useSchedule } from './api/useSchedule';
import { Calendar } from 'lucide-react';

const SchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { schedule, loading, error, refetch, fetchScheduleForMonth } = useSchedule();

    // Debug logging
    console.log('SchedulePage - Schedule data:', schedule);
    console.log('SchedulePage - Loading:', loading);
    console.log('SchedulePage - Error:', error);

    const handleDateSelect = (date) => {
        console.log('Date selected:', date);
        setSelectedDate(date);
    };

    const handleBookingClick = (booking) => {
        console.log('Booking clicked:', booking);
        setSelectedBooking(booking);
        onOpen();
    };

    const handleMonthChange = (month, year) => {
        console.log('Month changed to:', month, year);
        fetchScheduleForMonth(month, year);
    };

    const handleCloseModal = () => {
        onClose();
        setSelectedBooking(null);
    };

    if (loading) {
        return (
            <Box minH="calc(100vh - 70px)" bg="rgba(248, 250, 252, 0.8)">
                <Container maxW="7xl" py={8}>
                    <VStack spacing={6} align="stretch">
                        {/* Header Skeleton */}
                        <Box
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(15px)"
                            borderRadius="24px"
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            p={6}
                        >
                            <LoadingSkeleton count={1} height="60px" />
                        </Box>

                        {/* Calendar Skeleton */}
                        <Box
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(15px)"
                            borderRadius="24px"
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            p={6}
                        >
                            <LoadingSkeleton count={8} height="100px" />
                        </Box>
                    </VStack>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box minH="calc(100vh - 70px)" bg="rgba(248, 250, 252, 0.8)">
                <Container maxW="7xl" py={8}>
                    <Box
                        bg="rgba(255, 255, 255, 0.9)"
                        backdropFilter="blur(15px)"
                        borderRadius="24px"
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        p={8}
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                    >
                        <ErrorState
                            variant="default"
                            message={error}
                            onRetry={refetch}
                        />
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box minH="calc(100vh - 70px)" bg="rgba(248, 250, 252, 0.8)">
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {schedule && schedule.length > 0 ? (
                        <CalendarView
                            bookings={schedule}
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            onBookingClick={handleBookingClick}
                            onMonthChange={(month, year) => {
                                console.log('Month changed to:', month, year);
                                fetchScheduleForMonth(month, year);
                            }}
                        />
                    ) : (
                        <Box
                            bg="rgba(255, 255, 255, 0.9)"
                            backdropFilter="blur(15px)"
                            borderRadius="24px"
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            p={8}
                            boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                        >
                            <NoDataEmptyState
                                icon={Calendar}
                                title="Belum Ada Jadwal"
                                message="Belum ada jadwal peminjaman yang tersedia. Silakan buat peminjaman baru di halaman beranda."
                            />
                        </Box>
                    )}
                </VStack>
            </Container>

            {/* Booking Preview Modal */}
            <BookingPreviewModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                booking={selectedBooking}
            />
        </Box>
    );
};

export default SchedulePage; 