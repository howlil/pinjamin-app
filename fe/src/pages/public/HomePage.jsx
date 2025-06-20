import React from 'react';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// Import modular components
import {
    HeroSection,
    HeroContent,
    SearchForm,
    TodayBookingsList,
    BuildingCardGrid,
    BuildingPagination,
    AvailabilityModal,
} from '@/components/home';

// Import hooks for buildings data and availability check
import { usePublicBuildings } from '@/hooks/usePublicBuildings';
import { useAvailabilityCheck } from '@/hooks/useAvailabilityCheck';

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

    return (
        <Box position="relative" minH="100vh">
            <HeroSection>
                <Box>
                    <HeroContent />
                    <SearchForm
                        onSearch={handleSearch}
                        onCheckAvailability={checkAvailability}
                        buildingTypes={getBuildingTypes()}
                        loading={loading || availabilityLoading}
                    />
                </Box>
                <TodayBookingsList />
            </HeroSection>

            <BuildingCardGrid
                buildings={buildings}
                loading={loading}
                error={error}
                onCardClick={handleRoomClick}
                onDetailsClick={handleRoomClick}
                formatCurrency={formatCurrency}
                getBuildingTypeColor={getBuildingTypeColor}
                getBuildingTypeText={getBuildingTypeText}
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


            {/* Availability Check Modal */}
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