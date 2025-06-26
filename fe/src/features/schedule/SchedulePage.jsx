import React, { useState } from 'react';
import { Box, Container, VStack, useDisclosure } from '@chakra-ui/react';
import LoadingSkeleton from '@shared/components/LoadingSkeleton';
import { NoDataEmptyState } from '@shared/components/EmptyState';
import ErrorState from '@shared/components/ErrorState';
import CalendarView from './components/CalendarView';
import BookingPreviewModal from './components/BookingPreviewModal';
import { useSchedule } from './api/useSchedule';

const SchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { schedule, loading, error, refetch } = useSchedule();

    // Debug log
    React.useEffect(() => {
        console.log('SchedulePage - schedule data:', schedule);
        console.log('SchedulePage - loading:', loading);
        console.log('SchedulePage - error:', error);
    }, [schedule, loading, error]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleBookingClick = (booking) => {
        console.log('Booking clicked:', booking);
        setSelectedBooking(booking);
        onOpen();
    };

    const handleCloseModal = () => {
        onClose();
        setSelectedBooking(null);
    };

    if (loading) {
        return (
            <Container maxW="7xl" py={8}>
                <VStack spacing={6} align="stretch">
                    <LoadingSkeleton count={1} height="60px" />
                    <LoadingSkeleton count={8} height="100px" />
                </VStack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="7xl" py={8}>
                <ErrorState
                    variant="default"
                    message={error}
                    onRetry={refetch}
                />
            </Container>
        );
    }

    return (
        <Box minH="calc(100vh - 70px)" bg="gray.50">
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
              
                    {schedule && schedule.length > 0 ? (
                        <CalendarView
                            bookings={schedule}
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            onBookingClick={handleBookingClick}
                        />
                    ) : (
                        <NoDataEmptyState
                            title="Belum Ada Jadwal"
                            message="Belum ada jadwal peminjaman yang tersedia. Silakan buat peminjaman baru di halaman beranda."
                        />
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