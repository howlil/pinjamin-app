import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
    const [hasInitialLoad, setHasInitialLoad] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { schedule, loading, error, refetch, fetchScheduleForMonth } = useSchedule();
    const lastFetchedMonth = useRef(null);

    // Debug logging
    console.log('SchedulePage - Schedule data:', schedule);
    console.log('SchedulePage - Loading:', loading);
    console.log('SchedulePage - Error:', error);
    console.log('SchedulePage - Current calendar date:', currentCalendarDate);

    // Pastikan data di-fetch untuk bulan yang sedang ditampilkan saat initial load
    useEffect(() => {
        if (!hasInitialLoad) {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const monthKey = `${year}-${month}`;

            if (lastFetchedMonth.current !== monthKey) {
                console.log('SchedulePage initial load - fetching for current month/year:', month, year);
                lastFetchedMonth.current = monthKey;
                fetchScheduleForMonth(month, year);
                setHasInitialLoad(true);
            }
        }
    }, [hasInitialLoad]); // Only depend on hasInitialLoad to prevent loops

    const handleDateSelect = (date) => {
        console.log('Date selected:', date);
        setSelectedDate(date);
    };

    const handleBookingClick = (booking) => {
        console.log('Booking clicked:', booking);
        setSelectedBooking(booking);
        onOpen();
    };

    const handleMonthChange = useCallback((month, year) => {
        console.log('=== SchedulePage handleMonthChange ===');
        console.log('Month:', month, 'Year:', year);

        const monthKey = `${year}-${month}`;

        // Prevent duplicate calls for same month
        if (lastFetchedMonth.current === monthKey) {
            console.log('Skipping duplicate month change for:', monthKey);
            return;
        }

        console.log('Current calendar date before change:', currentCalendarDate);

        const newDate = new Date(year, month - 1, 1); // month - 1 karena JavaScript months are 0-indexed
        console.log('New calendar date to set:', newDate);

        lastFetchedMonth.current = monthKey;
        setCurrentCalendarDate(newDate);
        fetchScheduleForMonth(month, year);

        console.log('=== End handleMonthChange ===');
    }, []); // Remove all dependencies to prevent infinite loops

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
                    {/* Selalu tampilkan CalendarView, bahkan jika tidak ada schedule */}
                    <CalendarView
                        bookings={schedule || []}
                        selectedDate={selectedDate}
                        currentDate={currentCalendarDate}
                        onDateSelect={handleDateSelect}
                        onBookingClick={handleBookingClick}
                        onMonthChange={handleMonthChange}
                    />

                    {/* Tampilkan empty state jika tidak ada schedule */}
                    {(!schedule || schedule.length === 0) && (
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
                                message="Belum ada jadwal peminjaman untuk bulan ini. Silakan buat peminjaman baru di halaman beranda."
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