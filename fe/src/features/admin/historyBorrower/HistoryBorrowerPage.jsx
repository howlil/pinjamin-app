import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    HStack,
    Button,
    Flex,
    Spacer,
    IconButton
} from '@chakra-ui/react';
import { RefreshCw, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminBookingHistory } from './api/useAdminBookings';
import PaginationControls from '../../../shared/components/PaginationControls';
import HistoryTable from './components/HistoryTable';
import StatusFilter from './components/StatusFilter';
import DateFilter from './components/DateFilter';
import BuildingFilter from './components/BuildingFilter';

const HistoryBorrowerPage = () => {
    const [filters, setFilters] = useState({
        status: '',
        buildingId: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 10
    });

    const [showFilters, setShowFilters] = useState(false);

    const {
        bookings,
        loading,
        error,
        pagination,
        fetchBookingHistory,
        refetch
    } = useAdminBookingHistory();

    // Stabilize the fetch function to prevent infinite loops
    const fetchData = useCallback(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            ...(filters.status && { status: filters.status }),
            ...(filters.buildingId && { buildingId: filters.buildingId }),
            ...(filters.startDate && { startDate: filters.startDate }),
            ...(filters.endDate && { endDate: filters.endDate })
        };

        console.log('Fetching with filters:', params);
        fetchBookingHistory(params);
    }, [
        filters.page,
        filters.limit,
        filters.status,
        filters.buildingId,
        filters.startDate,
        filters.endDate
    ]);

    // Initial load and fetch data when filters change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusChange = (status) => {
        setFilters(prev => ({
            ...prev,
            status,
            page: 1 // Reset to first page when filter changes
        }));
    };

    const handleBuildingChange = (buildingId) => {
        setFilters(prev => ({
            ...prev,
            buildingId,
            page: 1
        }));
    };

    const handleStartDateChange = (startDate) => {
        setFilters(prev => ({
            ...prev,
            startDate,
            page: 1
        }));
    };

    const handleEndDateChange = (endDate) => {
        setFilters(prev => ({
            ...prev,
            endDate,
            page: 1
        }));
    };

    const handleClearDateFilter = () => {
        setFilters(prev => ({
            ...prev,
            startDate: '',
            endDate: '',
            page: 1
        }));
    };

    const handleClearAllFilters = () => {
        setFilters(prev => ({
            ...prev,
            status: '',
            buildingId: '',
            startDate: '',
            endDate: '',
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleLimitChange = (newLimit) => {
        setFilters(prev => ({
            ...prev,
            limit: newLimit,
            page: 1
        }));
    };

    const handleRefresh = useCallback(() => {
        const params = {
            page: filters.page,
            limit: filters.limit,
            ...(filters.status && { status: filters.status }),
            ...(filters.buildingId && { buildingId: filters.buildingId }),
            ...(filters.startDate && { startDate: filters.startDate }),
            ...(filters.endDate && { endDate: filters.endDate })
        };

        fetchBookingHistory(params);
        toast.success('Data Diperbarui');
    }, [
        filters.page,
        filters.limit,
        filters.status,
        filters.buildingId,
        filters.startDate,
        filters.endDate,
        fetchBookingHistory
    ]);

    const activeFiltersCount = [
        filters.status,
        filters.buildingId,
        filters.startDate,
        filters.endDate
    ].filter(Boolean).length;

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={6} align="stretch">
              
                {/* Controls */}
                <Box
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    p={4}
                >
                    <Flex align="center" wrap="wrap" gap={4}>
                        <HStack spacing={3}>
                            <Button
                                leftIcon={<Filter size={16} />}
                                bg={showFilters ? "#21D179" : "rgba(33, 209, 121, 0.1)"}
                                color={showFilters ? "white" : "#21D179"}
                                borderRadius="9999px"
                                size="sm"
                                border={showFilters ? "none" : "1px solid rgba(33, 209, 121, 0.3)"}
                                _hover={{
                                    bg: showFilters ? "#16B866" : "rgba(33, 209, 121, 0.2)",
                                    transform: "translateY(-1px)"
                                }}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                            </Button>

                            <IconButton
                                icon={<RefreshCw size={16} />}
                                bg="rgba(33, 209, 121, 0.1)"
                                color="#21D179"
                                borderRadius="9999px"
                                size="sm"
                                border="1px solid rgba(33, 209, 121, 0.3)"
                                _hover={{
                                    bg: "rgba(33, 209, 121, 0.2)",
                                    transform: "translateY(-1px)"
                                }}
                                onClick={handleRefresh}
                                isLoading={loading}
                                aria-label="Refresh data"
                            />

                            {activeFiltersCount > 0 && (
                                <Button
                                    size="sm"
                                    bg="rgba(255, 99, 99, 0.1)"
                                    color="#FF6363"
                                    borderRadius="9999px"
                                    border="1px solid rgba(255, 99, 99, 0.3)"
                                    _hover={{
                                        bg: "rgba(255, 99, 99, 0.2)",
                                        transform: "translateY(-1px)"
                                    }}
                                    onClick={handleClearAllFilters}
                                >
                                    Hapus Semua Filter
                                </Button>
                            )}
                        </HStack>

                        <Spacer />

                        <Text fontSize="sm" color="#2A2A2A" opacity={0.7}>
                            Total: {pagination.totalItems || 0} peminjaman
                        </Text>
                    </Flex>
                </Box>

                {/* Filters */}
                {showFilters && (
                    <Box
                        bg="rgba(255, 255, 255, 0.8)"
                        backdropFilter="blur(15px)"
                        borderRadius="24px"
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        p={6}
                        position="relative"
                        zIndex={10}
                    >
                        <HStack spacing={6} align="start" wrap="wrap">
                            <StatusFilter
                                selectedStatus={filters.status}
                                onStatusChange={handleStatusChange}
                            />

                            <BuildingFilter
                                selectedBuildingId={filters.buildingId}
                                onBuildingChange={handleBuildingChange}
                            />

                            <DateFilter
                                startDate={filters.startDate}
                                endDate={filters.endDate}
                                onStartDateChange={handleStartDateChange}
                                onEndDateChange={handleEndDateChange}
                                onClearFilter={handleClearDateFilter}
                            />
                        </HStack>
                    </Box>
                )}

                {/* Main Content */}
                <Box
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    overflow="hidden"
                    position="relative"
                    zIndex={1}
                >
                    <HistoryTable
                        bookings={bookings}
                        loading={loading}
                        onRefresh={handleRefresh}
                    />

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <Box p={4} borderTop="1px solid rgba(215, 215, 215, 0.3)">
                            <PaginationControls
                                currentPage={pagination.currentPage || 1}
                                totalPages={pagination.totalPages || 1}
                                onPageChange={handlePageChange}
                                itemsPerPage={pagination.itemsPerPage || 10}
                                onItemsPerPageChange={handleLimitChange}
                                totalItems={pagination.totalItems || 0}
                            />
                        </Box>
                    )}
                </Box>

                {/* Error State */}
                {error && !loading && (
                    <Box
                        bg="rgba(255, 99, 99, 0.1)"
                        backdropFilter="blur(15px)"
                        borderRadius="24px"
                        border="1px solid rgba(255, 99, 99, 0.3)"
                        p={4}
                    >
                        <Text color="#FF6363" fontSize="sm">
                            {error}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
};

export default HistoryBorrowerPage; 