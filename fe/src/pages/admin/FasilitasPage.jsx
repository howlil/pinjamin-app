import React, { useState } from 'react';
import { Box, useDisclosure, Flex } from '@chakra-ui/react';
import { Settings, Plus } from 'lucide-react';

import { PrimaryButton } from '../../components/ui';
import { useFacilities } from '../../hooks/facility';
import { DataStateHandler, PageHeader, PageWrapper } from '../../components/admin/common';
import {
    FacilitySearchBar,
    FacilityTable,
    FacilityFormModal,
    FacilityDeleteModal,
    FacilityDetailModal
} from '../../components/admin/facility';

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
        deleteFacility
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
        <PageWrapper>
            {/* Page Header */}
            <PageHeader
                title="Kelola Fasilitas"
                subtitle="Manajemen fasilitas gedung"
                icon={Settings}
                action={
                    <PrimaryButton
                        leftIcon={<Plus size={18} />}
                        onClick={handleAddNew}
                        size="lg"
                    >
                        Tambah Fasilitas
                    </PrimaryButton>
                }
            />

            {/* Search Section */}
            <Box mb={6}>
                <FacilitySearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearch={handleSearch}
                    totalItems={totalFacilities}
                    currentItems={facilities.length}
                />
            </Box>

            {/* Content Section */}
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
        </PageWrapper>
    );
};

export default FasilitasPage; 