import React from 'react';
import { Box, Container, Grid, GridItem, VStack } from '@chakra-ui/react';
import NavigationBar from '@/components/room/NavigationBar';
import RoomInfo from '@/components/room/RoomInfo';
import RoomCalendar from '@/components/room/RoomCalendar';
import BookingFormModal from '@/components/BookingFormModal';
import { useRoomDetail } from '@/hooks/useRoomDetail';

const RoomDetailPage = () => {
    const {
        roomData,
        buildingData,
        loading,
        error,
        reservations,
        isOpen,
        onOpen,
        onClose,
        formatCurrency,
        formatDate,
        getBookingStatusColor,
        getBookingStatusText,
        getBuildingTypeText
    } = useRoomDetail();

    return (
        <Box py={8} minH="100vh">
            <Container maxW="7xl">
                <VStack spacing={8} align="stretch">
                    {/* Navigation Bar */}
                    <NavigationBar />

                    {/* Main Content */}
                    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                        {/* Left Side - Room Details */}
                        <GridItem>
                            <RoomInfo
                                roomData={roomData}
                                loading={loading}
                                error={error}
                                formatCurrency={formatCurrency}
                                getBuildingTypeText={getBuildingTypeText}
                            />
                        </GridItem>

                        {/* Right Side - Calendar */}
                        <GridItem>
                            <RoomCalendar
                                reservations={reservations}
                                onBookRoom={onOpen}
                                formatDate={formatDate}
                                getBookingStatusColor={getBookingStatusColor}
                                getBookingStatusText={getBookingStatusText}
                            />
                        </GridItem>
                    </Grid>
                </VStack>
            </Container>

            {/* Booking Form Modal */}
            <BookingFormModal
                isOpen={isOpen}
                onClose={onClose}
                roomName={roomData?.name || 'Loading...'}
                buildingData={buildingData}
                roomData={roomData}
            />
        </Box>
    );
};

export default RoomDetailPage; 