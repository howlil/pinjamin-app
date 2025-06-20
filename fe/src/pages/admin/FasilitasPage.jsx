import React, { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Settings } from 'lucide-react';

import { GlassCard } from '@/components/ui';
import { useFacilities } from '@/hooks/useFacilities';
import DataStateHandler from '@/components/admin/common/DataStateHandler';
import {
    FacilityHeader,
    FacilitySearchBar,
    FacilityTable,
    FacilityFormModal,
    FacilityDeleteModal,
    FacilityDetailModal
} from '@/components/admin/facility';

const FasilitasPage = () => {
    // Custom hook for all business logic
    const {
        facilities,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalFacilities,
        actionLoading,
        setSearchTerm,
        handleSearch,
        handlePageChange,
        createFacility,
        updateFacility,
        deleteFacility,
        refreshData
    } = useFacilities();

    // Local state for UI interactions
    const [selectedFacility, setSelectedFacility] = useState(null);

    // Modal states
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    // Handle actions
    const handleAddNew = () => {
        setSelectedFacility(null);
        onFormOpen();
    };

    const handleView = (facility) => {
        setSelectedFacility(facility);
        onViewOpen();
    };

    const handleEdit = (facility) => {
        setSelectedFacility(facility);
        onFormOpen();
    };

    const handleDelete = (facility) => {
        setSelectedFacility(facility);
        onDeleteOpen();
    };

    const handleFormSubmit = async (formData, facilityId) => {
        if (facilityId) {
            return await updateFacility(facilityId, formData);
        } else {
            return await createFacility(formData);
        }
    };

    const handleDeleteConfirm = async (facilityId) => {
        return await deleteFacility(facilityId);
    };

    return (
        <Box>
            {/* Header Section */}
            <FacilityHeader
                onRefresh={refreshData}
                onAddNew={handleAddNew}
            />

            {/* Search Section */}
            <FacilitySearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                totalItems={totalFacilities}
                currentItems={facilities.length}
            />

            {/* Content Section */}
            <GlassCard p={6} mt={6}>
                <DataStateHandler
                    loading={loading}
                    error={error}
                    data={facilities}
                    emptyMessage="Belum ada data fasilitas"
                    emptySearchMessage="Tidak ada fasilitas yang sesuai dengan pencarian"
                    loadingMessage="Memuat data fasilitas..."
                    isSearching={Boolean(searchTerm)}
                    onAddNew={handleAddNew}
                    addNewLabel="Tambah Fasilitas Pertama"
                    EmptyIcon={Settings}
                >
                    <FacilityTable
                        facilities={facilities}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </DataStateHandler>
            </GlassCard>

            {/* Modals */}
            <FacilityFormModal
                isOpen={isFormOpen}
                onClose={onFormClose}
                facility={selectedFacility}
                onSubmit={handleFormSubmit}
                isLoading={actionLoading}
            />

            <FacilityDeleteModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                facility={selectedFacility}
                onConfirm={handleDeleteConfirm}
                isLoading={actionLoading}
            />

            <FacilityDetailModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                facility={selectedFacility}
            />
        </Box>
    );
};

export default FasilitasPage; 