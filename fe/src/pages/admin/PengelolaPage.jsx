import React, { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Users, Plus } from 'lucide-react';

import { PrimaryButton } from '@/components/ui';
import { useBuildingManagers } from '@/hooks/useBuildingManagers';
import { DataStateHandler, PageHeader, PageWrapper } from '@/components/admin/common';
import {
    BuildingManagerHeader,
    BuildingManagerTable,
    BuildingManagerFormModal,
    BuildingManagerDeleteModal,
    BuildingManagerDetailModal
} from '@/components/admin/building-manager';

const PengelolaPage = () => {
    // Custom hook for all business logic
    const {
        buildingManagers,
        loading,
        error,
        currentPage,
        totalPages,
        totalManagers,
        actionLoading,
        buildingFilter,
        handleFilterChange,
        handlePageChange,
        createBuildingManager,
        updateBuildingManager,
        deleteBuildingManager,
        assignBuildingManager
    } = useBuildingManagers();

    // Local state for UI interactions
    const [selectedManager, setSelectedManager] = useState(null);

    // Modal states
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isAssignOpen, onOpen: onAssignOpen, onClose: onAssignClose } = useDisclosure();

    // Handle actions
    const handleAddNew = () => {
        setSelectedManager(null);
        onFormOpen();
    };

    const handleView = (manager) => {
        setSelectedManager(manager);
        onViewOpen();
    };

    const handleEdit = (manager) => {
        setSelectedManager(manager);
        onFormOpen();
    };

    const handleDelete = (manager) => {
        setSelectedManager(manager);
        onDeleteOpen();
    };

    const handleAssign = (manager) => {
        setSelectedManager(manager);
        onAssignOpen();
    };

    const handleFormSubmit = async (formData, managerId) => {
        if (managerId) {
            return await updateBuildingManager(managerId, formData);
        } else {
            return await createBuildingManager(formData);
        }
    };

    const handleDeleteConfirm = async (managerId) => {
        return await deleteBuildingManager(managerId);
    };

    const handleAssignSubmit = async (assignmentData) => {
        return await assignBuildingManager(assignmentData);
    };

    return (
        <PageWrapper>
            {/* Page Header */}
            <PageHeader
                title="Kelola Pengelola Gedung"
                subtitle="Manajemen pengelola dan penugasan gedung"
                icon={Users}
                action={
                    <PrimaryButton
                        leftIcon={<Plus size={18} />}
                        onClick={handleAddNew}
                        size="lg"
                    >
                        Tambah Pengelola
                    </PrimaryButton>
                }
            />

            {/* Content Section */}
            <DataStateHandler
                loading={loading}
                error={error}
                data={buildingManagers}
                emptyMessage="Belum ada data pengelola gedung"
                emptySearchMessage="Tidak ada pengelola gedung yang sesuai dengan filter"
                loadingMessage="Memuat data pengelola gedung..."
                isSearching={Boolean(buildingFilter)}
                onAddNew={handleAddNew}
                addNewLabel="Tambah Pengelola Pertama"
                EmptyIcon={Users}
            >
                <BuildingManagerTable
                    buildingManagers={buildingManagers}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAssign={handleAssign}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </DataStateHandler>

            {/* Modals */}
            <BuildingManagerFormModal
                isOpen={isFormOpen}
                onClose={onFormClose}
                manager={selectedManager}
                onSubmit={handleFormSubmit}
                isLoading={actionLoading}
            />

            <BuildingManagerDeleteModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                manager={selectedManager}
                onConfirm={handleDeleteConfirm}
                isLoading={actionLoading}
            />

            <BuildingManagerDetailModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                manager={selectedManager}
            />

            {/* TODO: Add Assignment Modal for managing building assignments */}
        </PageWrapper>
    );
};

export default PengelolaPage; 