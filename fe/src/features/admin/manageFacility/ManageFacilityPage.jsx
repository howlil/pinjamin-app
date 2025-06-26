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
import { facilityManagementAPI } from './api/facilityManagementAPI';
import FacilityTable from './components/FacilityTable';
import FacilityFormModal from './components/FacilityFormModal';

const ManageFacilityPage = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [formData, setFormData] = useState({
        facilityName: '',
        iconUrl: ''
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

    const isEdit = !!selectedFacility;

    useEffect(() => {
        fetchFacilities();
    }, [currentPage]);

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            const response = await facilityManagementAPI.getFacilities({
                page: currentPage,
                limit: 10
            });

            if (response.status === 'success') {
                setFacilities(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (error) {
            // Error handled in apiClient
        } finally {
            setLoading(false);
        }
    };

    const handleAddFacility = () => {
        setSelectedFacility(null);
        setFormData({
            facilityName: '',
            iconUrl: ''
        });
        onFormOpen();
    };

    const handleEditFacility = (facility) => {
        setSelectedFacility(facility);
        setFormData({
            facilityName: facility.facilityName || '',
            iconUrl: facility.iconUrl || ''
        });
        onFormOpen();
    };

    const handleDeleteClick = (facility) => {
        setSelectedFacility(facility);
        onDeleteOpen();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (isEdit) {
                const response = await facilityManagementAPI.updateFacility(
                    selectedFacility.id,
                    formData
                );
                if (response.status === 'success') {
                    toast.success('Fasilitas berhasil diperbarui');
                }
            } else {
                const response = await facilityManagementAPI.createFacility(formData);
                if (response.status === 'success') {
                    toast.success('Fasilitas berhasil ditambahkan');
                }
            }
            onFormClose();
            fetchFacilities();
        } catch (error) {
            // Error handled in apiClient
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            const response = await facilityManagementAPI.deleteFacility(selectedFacility.id);
            if (response.status === 'success') {
                toast.success('Fasilitas berhasil dihapus');
                onDeleteClose();
                fetchFacilities();
            }
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
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <Container maxW="full" py={8}>
                <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                        <Box>
                            <H2>Manajemen Fasilitas</H2>
                            <CustomText color="gray.600">
                                Kelola data fasilitas gedung
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
                        <H2>Manajemen Fasilitas</H2>
                        <CustomText color="gray.600">
                            Kelola data fasilitas gedung
                        </CustomText>
                    </Box>
                    <PrimaryButton
                        leftIcon={<Plus size={20} />}
                        onClick={handleAddFacility}
                    >
                        Tambah Fasilitas
                    </PrimaryButton>
                </HStack>

                {/* Table */}
                <Box bg="white" borderRadius="24px" overflow="hidden" boxShadow="sm">
                    <FacilityTable
                        facilities={facilities}
                        pagination={pagination}
                        currentPage={currentPage}
                        onAddFacility={handleAddFacility}
                        onEditFacility={handleEditFacility}
                        onDeleteFacility={handleDeleteClick}
                        onPageChange={handlePageChange}
                    />
                </Box>
            </VStack>

            {/* Form Modal */}
            <FacilityFormModal
                isOpen={isFormOpen}
                onClose={onFormClose}
                isEdit={isEdit}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isLoading={submitLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                title="Hapus Fasilitas"
                message={`Apakah Anda yakin ingin menghapus fasilitas "${selectedFacility?.facilityName}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteLoading}
                confirmText="Hapus"
                cancelText="Batal"
            />
        </Container>
    );
};

export default ManageFacilityPage; 