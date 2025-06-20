import React, { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Building } from 'lucide-react';

import { GlassCard } from '@/components/ui';
import { useBuildings } from '@/hooks/useBuildings';
import { DataStateHandler, AdminSearchFilter } from '@/components/admin/common';
import { BuildingHeader, BuildingTable } from '@/components/admin/building';

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
        deleteBuilding,
        refreshData
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

    const handleExport = () => {
        // Implementation for exporting building data
        console.log('Export buildings');
    };

    const handleViewMap = () => {
        // Implementation for viewing building map
        console.log('View building map');
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
        <Box>
            {/* Header Section */}
            <BuildingHeader
                onRefresh={refreshData}
                onAddNew={handleAddNew}
                onExport={handleExport}
                onViewMap={handleViewMap}
            />

            {/* Search and Filter Section */}
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

            {/* Content Section */}
            <GlassCard p={6} mt={6}>
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
            </GlassCard>

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
        </Box>
    );
};

export default GedungPage; 