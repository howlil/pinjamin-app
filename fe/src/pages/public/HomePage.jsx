import React from 'react';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// Import modular components
import {
    HeroSection,
    HeroContent,
    SearchForm,
    AvailableRoomsList,
    BuildingCardGrid,
    BuildingPagination,
    FeaturesSection
} from '@/components/home';

// Import hook for buildings data
import { usePublicBuildings } from '@/hooks/usePublicBuildings';

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

    const handleRoomClick = (buildingId) => {
        navigate(`/room/${buildingId}`);
    };

    return (
        <Box position="relative" minH="100vh">
            <HeroSection>
                <Box>
                    <HeroContent />
                    <SearchForm
                        onSearch={handleSearch}
                        buildingTypes={getBuildingTypes()}
                    />
                </Box>
                <AvailableRoomsList onRoomClick={handleRoomClick} />
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

            <FeaturesSection />
        </Box>
    );
};

export default HomePage; 