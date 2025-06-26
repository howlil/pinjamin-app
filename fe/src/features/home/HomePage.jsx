import { Box } from '@chakra-ui/react';
import AnimatedGridPattern from '@shared/components/AnimatedGridPattern';
import HeroSection from './components/HeroSection';
import BuildingGrid from './components/BuildingGrid';
import { useBuildings, useTodayBookings, useAvailabilityCheck } from './api/useBuildings';

const HomePage = () => {
    const { buildings, loading: buildingsLoading, error: buildingsError, refetch: refetchBuildings } = useBuildings();
    const { bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useTodayBookings();
    const {
        availableBuildings,
        loading: availabilityLoading,
        error: availabilityError,
        checkAvailability
    } = useAvailabilityCheck();

    const handleSearch = (searchTerm) => {
        // Search akan dihandle di BuildingGrid component
        console.log('Search:', searchTerm);
    };

    const handleFilterChange = (filter) => {
        // Filter akan dihandle di BuildingGrid component
        console.log('Filter:', filter);
    };

    return (
        <Box position="relative" overflow="hidden">
            {/* Global Animated Grid Background */}
            <Box position="fixed" top={0} left={0} w="100%" h="100%" zIndex={0}>
                <AnimatedGridPattern />
            </Box>

            <Box position="relative" zIndex={1}>
                <HeroSection
                    bookings={bookings}
                    bookingsLoading={bookingsLoading}
                    bookingsError={bookingsError}
                    refetch={refetchBookings}
                    availableBuildings={availableBuildings}
                    availabilityLoading={availabilityLoading}
                    availabilityError={availabilityError}
                    checkAvailability={checkAvailability}
                />

                {/* Building Grid Section */}
                <BuildingGrid
                    buildings={buildings}
                    loading={buildingsLoading}
                    error={buildingsError}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </Box>
        </Box>
    );
};

export default HomePage; 