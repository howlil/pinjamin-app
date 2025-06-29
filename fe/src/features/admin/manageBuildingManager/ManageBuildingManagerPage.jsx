import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    useDisclosure
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { PrimaryButton } from '@shared/components/Button';
import { H2, Text as CustomText } from '@shared/components/Typography';
import { ConfirmModal } from '@shared/components/Modal';
import LoadingSkeleton from '@shared/components/LoadingSkeleton';
import {
    useBuildingManagerManagement,
    useAssignBuildingManager,
    useCreateBuildingManager,
    useUpdateBuildingManager,
    useDeleteBuildingManager
} from './api/useBuildingManagerManagement';
import BuildingManagerTable from './components/BuildingManagerTable';
import BuildingManagerFormModal from './components/BuildingManagerFormModal';
import AssignBuildingModal from './components/AssignBuildingModal';

const ManageBuildingManagerPage = () => {
    const [filters, setFilters] = useState({});
    const { managers, loading, pagination, fetchManagers, refetch } = useBuildingManagerManagement(filters);
    const { assignBuildingManager, loading: assignLoading } = useAssignBuildingManager();
    const { createBuildingManager, loading: createLoading } = useCreateBuildingManager();
    const { updateBuildingManager, loading: updateLoading } = useUpdateBuildingManager();
    const { deleteBuildingManager, loading: deletingLoading } = useDeleteBuildingManager();

    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedManagerForAssign, setSelectedManagerForAssign] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });

    const {
        isOpen: isFormOpen,
        onOpen: onFormOpen,
        onClose: onFormClose
    } = useDisclosure();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure();

    const {
        isOpen: isAssignOpen,
        onOpen: onAssignOpen,
        onClose: onAssignClose
    } = useDisclosure();

    const isEdit = !!selectedManager;

    useEffect(() => {
        refetch();
    }, []);

    const handleAddManager = () => {
        setSelectedManager(null);
        setFormData({
            fullName: '',
            email: '',
            phoneNumber: ''
        });
        onFormOpen();
    };

    const handleEditManager = (manager) => {
        setSelectedManager(manager);
        setFormData({
            fullName: manager.fullName || '',
            email: manager.email || '',
            phoneNumber: manager.phoneNumber || ''
        });
        onFormOpen();
    };

    const handleDeleteClick = (manager) => {
        setSelectedManager(manager);
        onDeleteOpen();
    };

    const handleAssignClick = (manager) => {
        setSelectedManagerForAssign(manager);
        onAssignOpen();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEdit) {
                await updateBuildingManager(selectedManager.id, formData);
            } else {
                await createBuildingManager(formData);
            }
            onFormClose();
            refetch();
        } catch (error) {
            // Error handled in apiClient
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            await deleteBuildingManager(selectedManager.id);
            onDeleteClose();
            refetch();
        } catch (error) {
            // Error handled in apiClient
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleAssign = async (managerId, buildingId) => {
        try {
            await assignBuildingManager({
                managerId: managerId,
                buildingId: buildingId
            });
            onAssignClose();
            refetch(); // Refresh the table
        } catch (error) {
            // Error handled in apiClient
        }
    };

    if (loading && managers.length === 0) {
        return (
            <Container maxW="full" py={8}>
                <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                        <Box>
                            <H2>Manajemen Building Manager</H2>
                            <CustomText color="gray.600">
                                Kelola data building manager
                            </CustomText>
                        </Box>
                    </HStack>
                    <LoadingSkeleton />
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="full" py={8}>
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <HStack justify="space-between" align="center">
                    <Box>
                        <H2>Manajemen Building Manager</H2>
                        <CustomText color="gray.600">
                            Kelola data building manager dan penugasan gedung
                        </CustomText>
                    </Box>
                    <PrimaryButton
                        leftIcon={<Plus size={20} />}
                        onClick={handleAddManager}
                    >
                        Tambah Manager
                    </PrimaryButton>
                </HStack>

                {/* Table */}
                <Box bg="white" borderRadius="24px" overflow="hidden" boxShadow="sm">
                    <BuildingManagerTable
                        managers={managers}
                        loading={loading}
                        pagination={pagination}
                        onEditManager={handleEditManager}
                        onDeleteManager={handleDeleteClick}
                        onAssignBuilding={handleAssignClick}
                        onPageChange={handlePageChange}
                    />
                </Box>
            </VStack>

            {/* Form Modal */}
            <BuildingManagerFormModal
                isOpen={isFormOpen}
                onClose={onFormClose}
                isEdit={isEdit}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isLoading={isEdit ? updateLoading : createLoading}
            />

            {/* Assign Building Modal */}
            <AssignBuildingModal
                isOpen={isAssignOpen}
                onClose={onAssignClose}
                manager={selectedManagerForAssign}
                onAssign={handleAssign}
                isLoading={assignLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                title="Hapus Building Manager"
                message={`Apakah Anda yakin ingin menghapus building manager "${selectedManager?.fullName}"? Semua penugasan gedung akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteLoading}
                confirmText="Hapus"
                cancelText="Batal"
            />
        </Container>
    );
};

export default ManageBuildingManagerPage; 