import React, { useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// Import modular components
import {
    HeroSection,
    HeroContent,
    SearchForm,
    TodayBookingsList,
    AvailableRoomsList,
    BuildingCardGrid,
    BuildingPagination,
    AvailabilityModal,
} from '../../components/home';

// Import hooks for buildings data and availability check
import { usePublicBuildings } from '../../hooks/building';
import { useAvailabilityCheck } from '../../hooks/building';
import { useTodayBookings } from '../../hooks/booking';

const HomePage = () => {
    const navigate = useNavigate();

    // Use buildings hook for API integration
    const {
        buildings,
        loading,
        error,
        pagination,
        handleSearch,
        handlePageChange,
        handleItemsPerPageChange,
        formatCurrency,
        getBuildingTypeColor,
        getBuildingTypeText,
        getBuildingTypes
    } = usePublicBuildings();

    // Use availability check hook
    const {
        availableBuildings,
        loading: availabilityLoading,
        error: availabilityError,
        searchCriteria,
        isOpen: isAvailabilityModalOpen,
        onClose: onAvailabilityModalClose,
        checkAvailability,
        formatCurrency: formatAvailabilityCurrency,
        formatDisplayDate,
        clearResults
    } = useAvailabilityCheck();

    // Use today bookings hook
    const { bookings: todayBookings, isLoading: todayLoading } = useTodayBookings();

    // Debug logging
    useEffect(() => {
        console.log('HomePage - availableBuildings:', availableBuildings);
        console.log('HomePage - searchCriteria:', searchCriteria);
        console.log('HomePage - availabilityLoading:', availabilityLoading);
        console.log('HomePage - isAvailabilityModalOpen:', isAvailabilityModalOpen);
    }, [availableBuildings, searchCriteria, availabilityLoading, isAvailabilityModalOpen]);

    const handleRoomClick = (buildingId) => {
        navigate(`/room/${buildingId}`);
    };

    const handleViewDetails = (buildingId) => {
        onAvailabilityModalClose();
        navigate(`/room/${buildingId}`);
    };

    const handleSelectBuilding = (building) => {
        onAvailabilityModalClose();
        navigate(`/room/${building.id}`);
    };

    // Transform today bookings for AvailableRoomsList - always show today's bookings
    const transformedTodayRooms = todayBookings.map(booking => ({
        id: booking.bookingId,
        name: booking.buildingName,
        location: booking.activityName,
        time: `${booking.startTime} - ${booking.endTime}`
    }));

    console.log('HomePage - transformedTodayRooms:', transformedTodayRooms);

    // Left content for hero section
    const leftContent = (
        <VStack spacing={8} align="stretch">
            <HeroContent />
            <SearchForm
                onCheckAvailability={checkAvailability}
                loading={availabilityLoading}
            />
        </VStack>
    );

    // Right content for hero section - always show today's bookings
    const rightContent = (
        <AvailableRoomsList
            rooms={transformedTodayRooms}
            loading={todayLoading}
            searchCriteria={null} // Always null since search results go to modal
        />
    );

    return (
        <Box position="relative" minH="100vh">
            {/* Hero Section with 2 grid layout */}
            <HeroSection
                leftContent={leftContent}
                rightContent={rightContent}
            />

            {/* Building Cards Grid */}
            <BuildingCardGrid
                buildings={buildings}
                loading={loading}
                error={error}
                onCardClick={handleRoomClick}
                onDetailsClick={handleRoomClick}
                onSearch={handleSearch}
                formatCurrency={formatCurrency}
                getBuildingTypeColor={getBuildingTypeColor}
                getBuildingTypeText={getBuildingTypeText}
                getBuildingTypes={getBuildingTypes}
            />

            {/* Add pagination if there are buildings */}
            {!loading && !error && buildings.length > 0 && (
                <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }}>
                    <BuildingPagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </Box>
            )}

            {/* Availability Check Modal - shows search results */}
            <AvailabilityModal
                isOpen={isAvailabilityModalOpen}
                onClose={onAvailabilityModalClose}
                buildings={availableBuildings}
                loading={availabilityLoading}
                error={availabilityError}
                searchCriteria={searchCriteria}
                formatCurrency={formatAvailabilityCurrency}
                formatDisplayDate={formatDisplayDate}
                onViewDetails={handleViewDetails}
                onSelectBuilding={handleSelectBuilding}
            />
        </Box>
    );
};

export default HomePage; 