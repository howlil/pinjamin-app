import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    useDisclosure
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PrimaryButton } from '@shared/components/Button';
import { H2, Text as CustomText } from '@shared/components/Typography';
import { ConfirmModal } from '@shared/components/Modal';
import { buildingManagementAPI } from './api/buildingManagementAPI';
import { facilityManagementAPI } from '../manageFacility/api/facilityManagementAPI';
import { buildingManagerAPI } from '../manageBuildingManager/api/buildingManagerAPI';
import BuildingTable from './components/BuildingTable';
import BuildingFilters from './components/BuildingFilters';

const ManageBuildingPage = () => {
    const navigate = useNavigate();

    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        currentPage: 1,
        limit: 10,
        itemsPerPage: 10,
        total: 0,
        totalItems: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10
    });
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure();

    useEffect(() => {
        fetchBuildings();
    }, [filters]);

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            // Filter out empty parameters to avoid API validation errors
            const queryParams = {};
            Object.keys(filters).forEach(key => {
                const value = filters[key];
                if (value !== '' && value !== null && value !== undefined) {
                    queryParams[key] = value;
                }
            });

            const response = await buildingManagementAPI.getAdminBuildings(queryParams);

            if (response.data) {
                const buildingsData = response.data || [];
                const paginationData = response.pagination || pagination;

                setBuildings(buildingsData);
                setPagination(paginationData);
            }
        } catch (error) {
            // Error handled in apiClient
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBuilding = async (buildingData) => {
        try {
            const response = await buildingManagementAPI.createBuilding(buildingData);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil dibuat');
                return response.data.data;
            }
        } catch (error) {
            // Error handled in apiClient
            throw error;
        }
    };

    const handleUpdateBuilding = async (id, buildingData) => {
        try {
            const response = await buildingManagementAPI.updateBuilding(id, buildingData);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil diperbarui');
                return response.data.data;
            }
        } catch (error) {
            // Error handled in apiClient
            throw error;
        }
    };

    const handleDeleteBuilding = async (id) => {
        setDeleteLoading(true);
        try {
            const response = await buildingManagementAPI.deleteBuilding(id);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil dihapus');
                fetchBuildings(); // Refresh data
                return response.data.data;
            }
        } catch (error) {
            // Error handled in apiClient
            throw error;
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleLoadFacilities = async () => {
        try {
            const response = await facilityManagementAPI.getFacilities();
            if (response.status === 'success') {
                return response.data || [];
            }
            return [];
        } catch (error) {
            // Error handled in apiClient
            return [];
        }
    };

    const handleLoadManagers = async () => {
        try {
            const response = await buildingManagerAPI.getAvailableBuildingManagers();
            if (response.status === 'success') {
                return response.data || [];
            }
            return [];
        } catch (error) {
            // Error handled in apiClient
            return [];
        }
    };

    const handleLoadBuilding = async (id) => {
        try {
            const response = await buildingManagementAPI.getAdminBuildings();
            if (response.data) {
                const building = response.data.find(b => b.id === id);
                return building || null;
            }
            return null;
        } catch (error) {
            // Error handled in apiClient
            return null;
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setFilters(prev => {
            const newFilters = { ...prev, page: 1 };
            if (value && value.trim() !== '') {
                newFilters.search = value;
            } else {
                delete newFilters.search;
            }
            return newFilters;
        });
    };

    const handleTypeFilter = (e) => {
        const value = e.target.value;
        setFilters(prev => {
            const newFilters = { ...prev, page: 1 };
            if (value && value !== '') {
                newFilters.buildingType = value;
            } else {
                delete newFilters.buildingType;
            }
            return newFilters;
        });
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleAddBuilding = () => {
        navigate('/admin/manage-building/create');
    };

    const handleViewBuilding = (building) => {
        navigate(`/admin/manage-building/detail/${building.id}`);
    };

    const handleEditBuilding = (building) => {
        navigate(`/admin/manage-building/edit/${building.id}`);
    };

    const handleDeleteClick = (building) => {
        setSelectedBuilding(building);
        onDeleteOpen();
    };

    const handleDeleteConfirm = async () => {
        try {
            await handleDeleteBuilding(selectedBuilding.id);
            onDeleteClose();
        } catch (error) {
            // Error handling is done in handleDeleteBuilding
        }
    };

    return (
        <Container maxW="full" py={8}>
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <HStack justify="space-between" align="center">
                    <Box>
                        <H2>Manajemen Gedung</H2>
                        <CustomText color="gray.600">
                            Kelola data gedung dan fasilitas
                        </CustomText>
                    </Box>
                    <PrimaryButton
                        leftIcon={<Plus size={20} />}
                        onClick={handleAddBuilding}
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
                <Box bg="white" borderRadius="24px" overflow="hidden" boxShadow="sm">
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
            />
        </Container>
    );
};

export default ManageBuildingPage;