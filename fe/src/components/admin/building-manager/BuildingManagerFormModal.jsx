import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Select,
    HStack,
    Text,
    Icon,
    Spinner
} from '@chakra-ui/react';
import { Users, Phone, Building } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import { showToast } from '@/utils/helpers';
import { buildingApi } from '@/services/apiService';

const BuildingManagerFormModal = ({
    isOpen,
    onClose,
    manager = null, // null for create, manager object for edit
    onSubmit,
    isLoading = false
}) => {
    const [formData, setFormData] = useState({
        managerName: '',
        phoneNumber: '',
        buildingId: ''
    });

    const [availableBuildings, setAvailableBuildings] = useState([]);
    const [loadingBuildings, setLoadingBuildings] = useState(false);

    const isEditing = Boolean(manager);

    // Reset form when modal opens/closes or manager changes
    useEffect(() => {
        if (isOpen) {
            if (manager) {
                setFormData({
                    managerName: manager.managerName || '',
                    phoneNumber: manager.phoneNumber || '',
                    buildingId: manager.buildingId || ''
                });
            } else {
                setFormData({
                    managerName: '',
                    phoneNumber: '',
                    buildingId: ''
                });
            }
            loadAvailableBuildings();
        }
    }, [isOpen, manager]);

    // Load available buildings
    const loadAvailableBuildings = async () => {
        try {
            setLoadingBuildings(true);
            const response = await buildingApi.getBuildings({ limit: 100 });

            if (response.status === 'success') {
                setAvailableBuildings(response.data || []);
            }
        } catch (error) {
            console.error('Error loading buildings:', error);
            showToast.error('Gagal memuat data gedung');
        } finally {
            setLoadingBuildings(false);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.managerName.trim()) {
            showToast.error('Nama pengelola harus diisi');
            return;
        }

        if (formData.managerName.trim().length < 2) {
            showToast.error('Nama pengelola harus minimal 2 karakter');
            return;
        }

        if (!formData.phoneNumber.trim()) {
            showToast.error('Nomor telepon harus diisi');
            return;
        }

        if (formData.phoneNumber.trim().length < 10) {
            showToast.error('Nomor telepon harus minimal 10 karakter');
            return;
        }

        // Validate phone number format (basic)
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(formData.phoneNumber.trim())) {
            showToast.error('Format nomor telepon tidak valid');
            return;
        }

        console.log('=== BUILDING MANAGER FORM SUBMIT ===');
        console.log('Form data:', formData);
        console.log('Is editing:', isEditing);
        console.log('Manager ID:', manager?.id);

        // Prepare submission data
        const submitData = {
            managerName: formData.managerName.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            ...(formData.buildingId && { buildingId: formData.buildingId })
        };

        console.log('Submit data:', submitData);

        try {
            const success = await onSubmit(submitData, manager?.id);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    // Handle input change
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
            <ModalContent
                bg="white"
                borderRadius="2xl"
                border="1px solid"
                borderColor={COLORS.gray[200]}
                shadow="xl"
            >
                <ModalHeader
                    bg={COLORS.primary}
                    color="white"
                    borderTopRadius="2xl"
                    py={4}
                >
                    <HStack spacing={3}>
                        <Users size={24} />
                        <Text fontSize="lg" fontWeight="bold">
                            {isEditing ? 'Edit Pengelola Gedung' : 'Tambah Pengelola Gedung Baru'}
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color="white" top={4} />

                <ModalBody py={6}>
                    <VStack spacing={5} align="stretch">
                        <FormControl isRequired>
                            <FormLabel color={COLORS.gray[700]}>
                                <HStack spacing={2}>
                                    <Icon as={Users} size={16} />
                                    <Text>Nama Pengelola</Text>
                                </HStack>
                            </FormLabel>
                            <Input
                                placeholder="Masukkan nama lengkap pengelola..."
                                value={formData.managerName}
                                onChange={(e) => handleInputChange('managerName', e.target.value)}
                                borderRadius="full"
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`
                                }}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color={COLORS.gray[700]}>
                                <HStack spacing={2}>
                                    <Icon as={Phone} size={16} />
                                    <Text>Nomor Telepon</Text>
                                </HStack>
                            </FormLabel>
                            <Input
                                placeholder="Contoh: +62812345678"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                borderRadius="full"
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color={COLORS.gray[700]}>
                                <HStack spacing={2}>
                                    <Icon as={Building} size={16} />
                                    <Text>Gedung Ditugaskan (Opsional)</Text>
                                </HStack>
                            </FormLabel>
                            {loadingBuildings ? (
                                <HStack justify="center" py={4}>
                                    <Spinner size="sm" color={COLORS.primary} />
                                    <Text fontSize="sm" color={COLORS.gray[500]}>
                                        Memuat data gedung...
                                    </Text>
                                </HStack>
                            ) : (
                                <Select
                                    placeholder="Pilih gedung untuk ditugaskan..."
                                    value={formData.buildingId}
                                    onChange={(e) => handleInputChange('buildingId', e.target.value)}
                                    borderRadius="full"
                                    _focus={{
                                        borderColor: COLORS.primary,
                                        boxShadow: `0 0 0 1px ${COLORS.primary}`
                                    }}
                                >
                                    {availableBuildings.map((building) => (
                                        <option key={building.id} value={building.id}>
                                            {building.buildingName} - {building.location}
                                        </option>
                                    ))}
                                </Select>
                            )}
                            <Text fontSize="xs" color={COLORS.gray[500]} mt={1}>
                                Anda dapat menugaskan pengelola ke gedung nanti
                            </Text>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter bg={COLORS.gray[50]} borderBottomRadius="2xl">
                    <HStack spacing={3}>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            borderRadius="full"
                            px={6}
                        >
                            Batal
                        </Button>
                        <Button
                            bg={COLORS.primary}
                            color="white"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText={isEditing ? 'Memperbarui...' : 'Menyimpan...'}
                            borderRadius="full"
                            px={6}
                            _hover={{ bg: COLORS.primaryDark }}
                        >
                            {isEditing ? 'Perbarui Pengelola' : 'Simpan Pengelola'}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BuildingManagerFormModal; 