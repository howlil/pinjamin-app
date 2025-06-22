import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    NumberInput,
    NumberInputField,
    Button,
    Text,
    Box,
    Image,
    IconButton,
    Tag,
    TagLabel,
    TagCloseButton,
    Wrap,
    WrapItem,
    useToast,
    Divider,
    SimpleGrid,
    Checkbox,
    Spinner,
} from '@chakra-ui/react';
import { Building, Upload, X, Plus, User, Phone } from 'lucide-react';
import { PrimaryButton } from '../../ui';
import { COLORS } from '../../../utils/designTokens';
import { facilityApi } from '../../../services/facility/facilityService';
import { buildingManagerApi } from '../../../services/buildingManager/buildingManagerService';

const BUILDING_TYPES = [
    { value: 'CLASSROOM', label: 'Ruang Kelas' },
    { value: 'PKM', label: 'PKM' },
    { value: 'LABORATORY', label: 'Laboratorium' },
    { value: 'MULTIFUNCTION', label: 'Multifungsi' },
    { value: 'SEMINAR', label: 'Seminar' }
];

const BuildingFormModal = ({
    isOpen,
    onClose,
    building = null,
    onSubmit,
    isLoading = false
}) => {
    const toast = useToast();
    const isEdit = Boolean(building);

    // Form state
    const [formData, setFormData] = useState({
        buildingName: '',
        description: '',
        rentalPrice: '',
        capacity: '',
        location: '',
        buildingType: '',
        image: null,
        facilityIds: [],
        buildingManagerIds: []
    });

    // UI state
    const [imagePreview, setImagePreview] = useState(null);
    const [availableFacilities, setAvailableFacilities] = useState([]);
    const [availableManagers, setAvailableManagers] = useState([]);
    const [loadingFacilities, setLoadingFacilities] = useState(false);
    const [loadingManagers, setLoadingManagers] = useState(false);

    // Load available facilities and managers
    useEffect(() => {
        if (isOpen) {
            loadAvailableData();
        }
    }, [isOpen]);

    // Initialize form with building data when editing
    useEffect(() => {
        if (isEdit && building) {
            setFormData({
                buildingName: building.buildingName || '',
                description: building.description || '',
                rentalPrice: building.rentalPrice || '',
                capacity: building.capacity || '',
                location: building.location || '',
                buildingType: building.buildingType || '',
                image: null,
                facilityIds: building.facilities?.map(f => f.id) || [],
                buildingManagerIds: building.buildingManagers?.map(m => m.id) || []
            });
            setImagePreview(building.imageUrl || null);
        } else {
            // Reset form for new building
            setFormData({
                buildingName: '',
                description: '',
                rentalPrice: '',
                capacity: '',
                location: '',
                buildingType: '',
                image: null,
                facilityIds: [],
                buildingManagerIds: []
            });
            setImagePreview(null);
        }
    }, [isEdit, building, isOpen]);

    // Load available facilities and managers
    const loadAvailableData = async () => {
        try {
            setLoadingFacilities(true);
            setLoadingManagers(true);

            const [facilitiesResponse, managersResponse] = await Promise.all([
                facilityApi.getFacilities({ limit: 100 }),
                buildingManagerApi.getAvailableBuildingManagers()
            ]);

            if (facilitiesResponse.status === 'success') {
                setAvailableFacilities(facilitiesResponse.data || []);
            }

            if (managersResponse.status === 'success') {
                setAvailableManagers(managersResponse.data || []);
            }
        } catch (error) {
            console.error('Error loading available data:', error);
        } finally {
            setLoadingFacilities(false);
            setLoadingManagers(false);
        }
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: 'Error',
                    description: 'File harus berupa gambar',
                    status: 'error',
                    duration: 3000,
                });
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: 'Error',
                    description: 'Ukuran file maksimal 5MB',
                    status: 'error',
                    duration: 3000,
                });
                return;
            }

            setFormData(prev => ({ ...prev, image: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(isEdit ? building?.imageUrl : null);
    };

    // Handle facility selection
    const handleFacilityChange = (facilityId) => {
        setFormData(prev => ({
            ...prev,
            facilityIds: prev.facilityIds.includes(facilityId)
                ? prev.facilityIds.filter(id => id !== facilityId)
                : [...prev.facilityIds, facilityId]
        }));
    };

    // Handle building manager selection
    const handleManagerChange = (managerId) => {
        setFormData(prev => ({
            ...prev,
            buildingManagerIds: prev.buildingManagerIds.includes(managerId)
                ? prev.buildingManagerIds.filter(id => id !== managerId)
                : [...prev.buildingManagerIds, managerId]
        }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validation
        if (!formData.buildingName.trim()) {
            toast({
                title: 'Error',
                description: 'Nama gedung harus diisi',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (!formData.description.trim()) {
            toast({
                title: 'Error',
                description: 'Deskripsi gedung harus diisi',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (!formData.rentalPrice || formData.rentalPrice <= 0) {
            toast({
                title: 'Error',
                description: 'Harga sewa harus diisi dengan nilai yang valid',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (!formData.capacity || formData.capacity <= 0) {
            toast({
                title: 'Error',
                description: 'Kapasitas harus diisi dengan nilai yang valid',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (!formData.location.trim()) {
            toast({
                title: 'Error',
                description: 'Lokasi gedung harus diisi',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (!formData.buildingType) {
            toast({
                title: 'Error',
                description: 'Tipe gedung harus dipilih',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        // Prepare data for submission
        const submitData = {
            buildingName: formData.buildingName.trim(),
            description: formData.description.trim(),
            rentalPrice: parseInt(formData.rentalPrice),
            capacity: parseInt(formData.capacity),
            location: formData.location.trim(),
            buildingType: formData.buildingType,
            facilityIds: Array.isArray(formData.facilityIds) ? formData.facilityIds : [],
            buildingManagerIds: Array.isArray(formData.buildingManagerIds) ? formData.buildingManagerIds : []
        };

        // Add image if provided
        if (formData.image) {
            submitData.image = formData.image;
        }

        // Debug logging
        console.log('=== FORM SUBMIT DEBUG ===');
        console.log('Form Data State:', formData);
        console.log('Submit Data:', submitData);
        console.log('facilityIds:', submitData.facilityIds, 'type:', typeof submitData.facilityIds, 'isArray:', Array.isArray(submitData.facilityIds));
        console.log('buildingManagerIds:', submitData.buildingManagerIds, 'type:', typeof submitData.buildingManagerIds, 'isArray:', Array.isArray(submitData.buildingManagerIds));
        console.log('=== END FORM DEBUG ===');

        try {
            if (isEdit) {
                await onSubmit(building.id, submitData);
            } else {
                await onSubmit(submitData);
            }
            onClose();
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
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
                        <Building size={24} />
                        <Text fontSize="lg" fontWeight="bold">
                            {isEdit ? 'Edit Gedung' : 'Tambah Gedung Baru'}
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color="white" top={4} />

                <ModalBody py={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Basic Information */}
                        <Box>
                            <Text fontSize="md" fontWeight="semibold" color={COLORS.gray[700]} mb={4}>
                                Informasi Dasar
                            </Text>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel color={COLORS.gray[700]}>Nama Gedung</FormLabel>
                                    <Input
                                        value={formData.buildingName}
                                        onChange={(e) => handleInputChange('buildingName', e.target.value)}
                                        placeholder="Masukkan nama gedung"
                                        borderRadius="full"
                                        _focus={{ borderColor: COLORS.primary, boxShadow: `0 0 0 1px ${COLORS.primary}` }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel color={COLORS.gray[700]}>Tipe Gedung</FormLabel>
                                    <Select
                                        value={formData.buildingType}
                                        onChange={(e) => handleInputChange('buildingType', e.target.value)}
                                        placeholder="Pilih tipe gedung"
                                        borderRadius="full"
                                        _focus={{ borderColor: COLORS.primary, boxShadow: `0 0 0 1px ${COLORS.primary}` }}
                                    >
                                        {BUILDING_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel color={COLORS.gray[700]}>Harga Sewa (Rp)</FormLabel>
                                    <NumberInput
                                        value={formData.rentalPrice}
                                        onChange={(value) => handleInputChange('rentalPrice', value)}
                                        min={0}
                                    >
                                        <NumberInputField
                                            placeholder="0"
                                            borderRadius="full"
                                            _focus={{ borderColor: COLORS.primary, boxShadow: `0 0 0 1px ${COLORS.primary}` }}
                                        />
                                    </NumberInput>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel color={COLORS.gray[700]}>Kapasitas</FormLabel>
                                    <NumberInput
                                        value={formData.capacity}
                                        onChange={(value) => handleInputChange('capacity', value)}
                                        min={1}
                                    >
                                        <NumberInputField
                                            placeholder="0"
                                            borderRadius="full"
                                            _focus={{ borderColor: COLORS.primary, boxShadow: `0 0 0 1px ${COLORS.primary}` }}
                                        />
                                    </NumberInput>
                                </FormControl>
                            </SimpleGrid>

                            <FormControl mt={4} isRequired>
                                <FormLabel color={COLORS.gray[700]}>Lokasi</FormLabel>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Masukkan lokasi gedung"
                                    borderRadius="full"
                                    _focus={{ borderColor: COLORS.primary, boxShadow: `0 0 0 1px ${COLORS.primary}` }}
                                />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel color={COLORS.gray[700]}>Deskripsi</FormLabel>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Masukkan deskripsi gedung"
                                    rows={3}
                                    borderRadius="2xl"
                                    _focus={{ borderColor: COLORS.primary, boxShadow: `0 0 0 1px ${COLORS.primary}` }}
                                />
                            </FormControl>
                        </Box>

                        <Divider />

                        {/* Image Upload */}
                        <Box>
                            <Text fontSize="md" fontWeight="semibold" color={COLORS.gray[700]} mb={4}>
                                Foto Gedung
                            </Text>
                            <VStack spacing={4}>
                                {imagePreview && (
                                    <Box position="relative" w="200px" h="150px">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            w="100%"
                                            h="100%"
                                            objectFit="cover"
                                            borderRadius="xl"
                                            border="2px solid"
                                            borderColor={COLORS.gray[200]}
                                        />
                                        <IconButton
                                            icon={<X size={16} />}
                                            size="sm"
                                            colorScheme="red"
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            onClick={removeImage}
                                            borderRadius="full"
                                        />
                                    </Box>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    display="none"
                                    id="image-upload"
                                />
                                <Button
                                    as="label"
                                    htmlFor="image-upload"
                                    leftIcon={<Upload size={16} />}
                                    variant="outline"
                                    borderRadius="full"
                                    cursor="pointer"
                                    _hover={{ bg: COLORS.gray[50] }}
                                >
                                    {imagePreview ? 'Ganti Foto' : 'Upload Foto'}
                                </Button>
                            </VStack>
                        </Box>

                        <Divider />

                        {/* Facilities */}
                        <Box>
                            <Text fontSize="md" fontWeight="semibold" color={COLORS.gray[700]} mb={4}>
                                Fasilitas
                            </Text>
                            {loadingFacilities ? (
                                <HStack justify="center" py={4}>
                                    <Spinner size="sm" color={COLORS.primary} />
                                    <Text fontSize="sm" color={COLORS.gray[500]}>Memuat fasilitas...</Text>
                                </HStack>
                            ) : (
                                <VStack spacing={3} align="stretch">
                                    {availableFacilities.length > 0 ? (
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                            {availableFacilities.map((facility) => (
                                                <Checkbox
                                                    key={facility.id}
                                                    isChecked={formData.facilityIds.includes(facility.id)}
                                                    onChange={() => handleFacilityChange(facility.id)}
                                                    colorScheme="green"
                                                >
                                                    <Text fontSize="sm">{facility.facilityName}</Text>
                                                </Checkbox>
                                            ))}
                                        </SimpleGrid>
                                    ) : (
                                        <Text fontSize="sm" color={COLORS.gray[500]} textAlign="center" py={4}>
                                            Tidak ada fasilitas tersedia
                                        </Text>
                                    )}
                                </VStack>
                            )}
                        </Box>

                        <Divider />

                        {/* Building Managers */}
                        <Box>
                            <Text fontSize="md" fontWeight="semibold" color={COLORS.gray[700]} mb={4}>
                                Pengelola Gedung
                            </Text>
                            {loadingManagers ? (
                                <HStack justify="center" py={4}>
                                    <Spinner size="sm" color={COLORS.primary} />
                                    <Text fontSize="sm" color={COLORS.gray[500]}>Memuat pengelola...</Text>
                                </HStack>
                            ) : (
                                <VStack spacing={3} align="stretch">
                                    {availableManagers.length > 0 ? (
                                        <VStack spacing={3} align="stretch">
                                            {availableManagers.map((manager) => (
                                                <Checkbox
                                                    key={manager.id}
                                                    isChecked={formData.buildingManagerIds.includes(manager.id)}
                                                    onChange={() => handleManagerChange(manager.id)}
                                                    colorScheme="green"
                                                >
                                                    <HStack spacing={4}>
                                                        <HStack spacing={2}>
                                                            <User size={16} color={COLORS.gray[600]} />
                                                            <Text fontSize="sm" fontWeight="medium">
                                                                {manager.managerName}
                                                            </Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <Phone size={16} color={COLORS.gray[600]} />
                                                            <Text fontSize="sm" color={COLORS.gray[600]}>
                                                                {manager.phoneNumber}
                                                            </Text>
                                                        </HStack>
                                                    </HStack>
                                                </Checkbox>
                                            ))}
                                        </VStack>
                                    ) : (
                                        <Text fontSize="sm" color={COLORS.gray[500]} textAlign="center" py={4}>
                                            Tidak ada pengelola tersedia
                                        </Text>
                                    )}
                                </VStack>
                            )}
                        </Box>
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
                        <PrimaryButton
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText={isEdit ? 'Memperbarui...' : 'Menyimpan...'}
                            px={6}
                        >
                            {isEdit ? 'Perbarui Gedung' : 'Simpan Gedung'}
                        </PrimaryButton>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BuildingFormModal; 