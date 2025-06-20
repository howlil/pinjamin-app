import React from 'react';
import { Box, Container, VStack } from '@chakra-ui/react';
import BookingTabs from '@/components/booking/BookingTabs';
import BookingPagination from '@/components/booking/BookingPagination';
import { useBookingHistory } from '@/hooks/useBookingHistory';

const BookingHistoryPage = () => {
    const {
        bookings,
        currentPage,
        totalItems,
        itemsPerPage,
        handlePrevPage,
        handleNextPage
    } = useBookingHistory();

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={6} align="stretch">
                    <BookingTabs bookings={bookings} />

                    {/* Pagination */}
                    <BookingPagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                    />
                </VStack>
            </Container>
        </Box>
    );
};

export default BookingHistoryPage; 