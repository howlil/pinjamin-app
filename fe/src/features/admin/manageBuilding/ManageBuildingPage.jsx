import React, { useState, useCallback } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    useDisclosure,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { Plus, RefreshCw, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '@shared/components/Button';
import { H2, Text as CustomText } from '@shared/components/Typography';
import { ConfirmModal } from '@shared/components/Modal';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';
import { useBuildingManagement, useDeleteBuilding } from './api/useBuildingManagement';
import BuildingTable from './components/BuildingTable';
import BuildingFilters from './components/BuildingFilters';
import ErrorState from '@shared/components/ErrorState';

const ManageBuildingPage = () => {
    const navigate = useNavigate();

    // Filter state
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        buildingType: ''
    });

    const [selectedBuilding, setSelectedBuilding] = useState(null);

    // Hooks
    const {
        buildings,
        loading,
        error,
        pagination,
        refetch
    } = useBuildingManagement(filters);

    const { deleteBuilding, loading: deleteLoading } = useDeleteBuilding();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure();

    // Filter handlers
    const handleSearch = useCallback((e) => {
        const value = e.target.value;
        setFilters(prev => ({
            ...prev,
            page: 1, // Reset to first page when searching
            search: value
        }));
    }, []);

    const handleTypeFilter = useCallback((e) => {
        const value = e.target.value;
        setFilters(prev => ({
            ...prev,
            page: 1, // Reset to first page when filtering
            buildingType: value
        }));
    }, []);

    const handlePageChange = useCallback((page) => {
        setFilters(prev => ({ ...prev, page }));
    }, []);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    // Building actions
    const handleAddBuilding = useCallback(() => {
        navigate('/admin/manage-building/create');
    }, [navigate]);

    const handleViewBuilding = useCallback((building) => {
        navigate(`/admin/manage-building/detail/${building.id}`);
    }, [navigate]);

    const handleEditBuilding = useCallback((building) => {
        navigate(`/admin/manage-building/edit/${building.id}`);
    }, [navigate]);

    const handleDeleteClick = useCallback((building) => {
        setSelectedBuilding(building);
        onDeleteOpen();
    }, [onDeleteOpen]);

    const handleDeleteConfirm = async () => {
        try {
            await deleteBuilding(selectedBuilding.id);
            onDeleteClose();
            refetch(); // Refresh data after deletion
        } catch (error) {
            // Error handling is done in useDeleteBuilding hook
        }
    };

    if (error) {
        return (
            <Container maxW="7xl" px={6} py={8}>
                <ErrorState
                    title="Error Loading Buildings"
                    description={error}
                    onRetry={handleRefresh}
                />
            </Container>
        );
    }

    return (
        <Container maxW="7xl" px={6} py={8}>
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <HStack justify="space-end" align="end" w="100%" >

                    <PrimaryButton
                        leftIcon={<Plus size={20} />}
                        onClick={handleAddBuilding}
                        fontFamily="Inter, sans-serif"
                        _hover={{
                            transform: "translateY(-2px)"
                        }}
                    >
                        Tambah Gedung
                    </PrimaryButton>
                </HStack>

                {/* Filters */}
                <BuildingFilters
                    filters={filters}
                    onSearchChange={handleSearch}
                    onTypeFilterChange={handleTypeFilter}
                />

                {/* Table */}
                <Box
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(15px)"
                    borderRadius={`${CORNER_RADIUS.components.table}px`}
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    overflow="hidden"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                >
                    <BuildingTable
                        buildings={buildings}
                        loading={loading}
                        pagination={pagination}
                        onView={handleViewBuilding}
                        onEdit={handleEditBuilding}
                        onDelete={handleDeleteClick}
                        onAddBuilding={handleAddBuilding}
                        onPageChange={handlePageChange}
                    />
                </Box>
            </VStack>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                title="Hapus Gedung"
                message={`Apakah Anda yakin ingin menghapus gedung "${selectedBuilding?.buildingName}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteLoading}
                confirmText="Hapus"
                cancelText="Batal"
                isDelete
            />
        </Container>
    );
};

export default ManageBuildingPage;