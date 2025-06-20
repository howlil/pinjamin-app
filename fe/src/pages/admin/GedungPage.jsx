import React, { useState } from 'react';
import { Box, useDisclosure, Flex } from '@chakra-ui/react';
import { Building, Plus } from 'lucide-react';

import { PrimaryButton } from '@/components/ui';
import { useBuildings } from '@/hooks/useBuildings';
import { DataStateHandler, AdminSearchFilter, PageHeader, PageWrapper } from '@/components/admin/common';
import { BuildingTable } from '@/components/admin/building';

// Building type options for filter
const BUILDING_TYPE_OPTIONS = [
    { value: 'SEMINAR', label: 'Seminar' },
    { value: 'LABORATORY', label: 'Laboratorium' },
    { value: 'PKM', label: 'PKM' },
    { value: 'MULTIFUNCTION', label: 'Multifungsi' }
];

const GedungPage = () => {
    // Custom hook for all business logic
    const {
        buildings,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalBuildings,
        actionLoading,
        buildingTypeFilter,
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        createBuilding,
        updateBuilding,
        deleteBuilding
    } = useBuildings();

    // Local state for UI interactions
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    // Modal states - implement these later with specific modals
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

    // Handle actions
    const handleView = (building) => {
        setSelectedBuilding(building);
        onViewOpen();
    };

    const handleEdit = (building) => {
        setSelectedBuilding(building);
        onFormOpen();
    };

    const handleDelete = async (building) => {
        // This would open a delete confirmation modal in a real implementation
        const success = await deleteBuilding(building.id);
        if (success) {
            // Could show success feedback
        }
    };

    const handleAddNew = () => {
        setSelectedBuilding(null);
        onFormOpen();
    };

    // Prepare filters for search component
    const filters = [
        {
            key: 'buildingType',
            label: 'Tipe Gedung',
            value: buildingTypeFilter,
            options: BUILDING_TYPE_OPTIONS,
            onChange: (value) => handleFilterChange('buildingType', value)
        }
    ];

    return (
        <PageWrapper>
            {/* Page Header */}
            <PageHeader
                title="Kelola Gedung"
                subtitle="Manajemen data gedung dan fasilitas"
                icon={Building}
                action={
                    <PrimaryButton
                        leftIcon={<Plus size={18} />}
                        onClick={handleAddNew}
                        size="lg"
                    >
                        Tambah Gedung
                    </PrimaryButton>
                }
            />

            {/* Search and Filter Section */}
            <Box mb={6}>
                <AdminSearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearch={handleSearch}
                    searchPlaceholder="Cari gedung berdasarkan nama atau deskripsi..."
                    filters={filters}
                    totalItems={totalBuildings}
                    currentItems={buildings.length}
                    itemLabel="gedung"
                />
            </Box>

            {/* Content Section */}
            <DataStateHandler
                loading={loading}
                error={error}
                data={buildings}
                emptyMessage="Belum ada data gedung"
                emptySearchMessage="Tidak ada gedung yang sesuai dengan pencarian"
                loadingMessage="Memuat data gedung..."
                isSearching={Boolean(searchTerm || buildingTypeFilter)}
                onAddNew={handleAddNew}
                addNewLabel="Tambah Gedung Pertama"
                EmptyIcon={Building}
            >
                <BuildingTable
                    buildings={buildings}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalBuildings}
                    onPageChange={handlePageChange}
                />
            </DataStateHandler>

            {/* Modals would go here */}
            {/* 
            <BuildingDetailModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                building={selectedBuilding}
            />
            <BuildingFormModal
                isOpen={isFormOpen}
                onClose={onFormClose}
                building={selectedBuilding}
                onSubmit={selectedBuilding ? updateBuilding : createBuilding}
            />
            */}
        </PageWrapper>
    );
};

export default GedungPage; 