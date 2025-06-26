import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    SimpleGrid,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Checkbox,
    CheckboxGroup,
    Stack,
    Spinner,
    Center,
    Text,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { COLORS } from '@utils/designTokens';
import Input from '@shared/components/Input';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import { H2, H3 } from '@shared/components/Typography';

const BUILDING_TYPES = [
    { value: 'CLASSROOM', label: 'Classroom' },
    { value: 'PKM', label: 'PKM' },
    { value: 'LABORATORY', label: 'Laboratory' },
    { value: 'MULTIFUNCTION', label: 'Multifunction' },
    { value: 'SEMINAR', label: 'Seminar' }
];

const BuildingFormPage = ({
    onCreateBuilding,
    onUpdateBuilding,
    onLoadFacilities,
    onLoadManagers,
    onLoadBuilding
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const isEdit = !!id;

    const [formData, setFormData] = useState({
        buildingName: '',
        description: '',
        rentalPrice: '',
        capacity: '',
        location: '',
        buildingType: '',
        buildingPhoto: null,
        facilities: [],
        buildingManagers: []
    });

    const [facilities, setFacilities] = useState([]);
    const [availableManagers, setAvailableManagers] = useState([]);
    const [buildingData, setBuildingData] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [loadingBuilding, setLoadingBuilding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadFormData();
    }, []);

    useEffect(() => {
        if (isEdit && id) {
            loadBuildingData();
        }
    }, [isEdit, id]);

    const loadFormData = async () => {
        setLoadingData(true);
        try {
            const [facilitiesData, managersData] = await Promise.all([
                onLoadFacilities(),
                onLoadManagers()
            ]);

            console.log('Loaded facilities:', facilitiesData);
            console.log('Loaded managers:', managersData);

            setFacilities(facilitiesData || []);
            setAvailableManagers(managersData || []);
        } catch (error) {
            // Error handled in apiClient
        } finally {
            setLoadingData(false);
        }
    };

    const loadBuildingData = async () => {
        setLoadingBuilding(true);
        try {
            const building = await onLoadBuilding(id);
            if (building) {
                console.log('Loaded building data:', building);
                console.log('Building facilities:', building.facilities);
                console.log('Building managers:', building.buildingManagers);

                setBuildingData(building);
                setFormData({
                    buildingName: building.buildingName || '',
                    description: building.description || '',
                    rentalPrice: building.rentalPrice || '',
                    capacity: building.capacity || '',
                    location: building.location || '',
                    buildingType: building.buildingType || '',
                    buildingPhoto: null,
                    facilities: building.facilities?.map(f => f.id) || [],
                    buildingManagers: building.buildingManagers?.map(m => m.id) || []
                });

                console.log('Form data after loading:', {
                    facilities: building.facilities?.map(f => f.id) || [],
                    buildingManagers: building.buildingManagers?.map(m => m.id) || []
                });
            } else {
                toast.error('Gedung tidak ditemukan');
                navigate('/admin/manage-building');
            }
        } catch (error) {
            // Error handled in apiClient
            navigate('/admin/manage-building');
        } finally {
            setLoadingBuilding(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, buildingPhoto: file }));
    };

    const handleFacilitiesChange = (values) => {
        setFormData(prev => ({ ...prev, facilities: values }));
    };

    const handleManagersChange = (values) => {
        setFormData(prev => ({ ...prev, buildingManagers: values }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        console.log('Submitting form data:', formData);
        console.log('Selected facilities:', formData.facilities);
        console.log('Selected managers:', formData.buildingManagers);

        try {
            if (isEdit) {
                await onUpdateBuilding(id, formData);
            } else {
                await onCreateBuilding(formData);
            }
            navigate('/admin/manage-building');
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/manage-building');
    };

    if (loadingBuilding) {
        return (
            <Container maxW="6xl" py={8}>
                <Center h="400px">
                    <Spinner size="xl" color={COLORS.primary} />
                </Center>
            </Container>
        );
    }

    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/manage-building">
                            Manajemen Gedung
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>
                            {isEdit ? 'Edit Gedung' : 'Tambah Gedung'}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                <HStack justify="space-between" align="center">
                    <Box>
                        <H2>{isEdit ? 'Edit Gedung' : 'Tambah Gedung Baru'}</H2>
                        <Text color="gray.600">
                            {isEdit ? 'Perbarui informasi gedung' : 'Masukkan informasi gedung baru'}
                        </Text>
                    </Box>
                    <SecondaryButton
                        leftIcon={<ArrowLeft size={20} />}
                        onClick={handleCancel}
                    >
                        Kembali
                    </SecondaryButton>
                </HStack>

                <Box bg="white" p={8} borderRadius="24px" boxShadow="sm">
                    {loadingData ? (
                        <Center py={8}>
                            <Spinner size="lg" color={COLORS.primary} />
                        </Center>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={8} align="stretch">
                                <Box>
                                    <H3 mb={4}>Informasi Dasar</H3>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        <FormControl isRequired>
                                            <FormLabel>Nama Gedung</FormLabel>
                                            <Input
                                                name="buildingName"
                                                value={formData.buildingName}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan nama gedung"
                                            />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Tipe Gedung</FormLabel>
                                            <Select
                                                name="buildingType"
                                                value={formData.buildingType}
                                                onChange={handleInputChange}
                                                placeholder="Pilih tipe gedung"
                                                bg="rgba(255, 255, 255, 0.6)"
                                                backdropFilter="blur(10px)"
                                                border="1px solid rgba(215, 215, 215, 0.5)"
                                                borderRadius="9999px"
                                                h="48px"
                                            >
                                                {BUILDING_TYPES.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </SimpleGrid>

                                    <FormControl isRequired mt={6}>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <Textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan deskripsi gedung"
                                            rows={4}
                                            bg="rgba(255, 255, 255, 0.6)"
                                            backdropFilter="blur(10px)"
                                            border="1px solid rgba(215, 215, 215, 0.5)"
                                            borderRadius="24px"
                                            _focus={{
                                                borderColor: COLORS.primary,
                                                background: "rgba(255, 255, 255, 0.8)",
                                                boxShadow: '0 0 0 1px ' + COLORS.primary,
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                <Box>
                                    <H3 mb={4}>Detail Gedung</H3>
                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                        <FormControl isRequired>
                                            <FormLabel>Harga Sewa (IDR)</FormLabel>
                                            <NumberInput
                                                value={formData.rentalPrice}
                                                onChange={(value) => handleNumberChange('rentalPrice', value)}
                                                min={0}
                                            >
                                                <NumberInputField
                                                    bg="rgba(255, 255, 255, 0.6)"
                                                    backdropFilter="blur(10px)"
                                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                                    borderRadius="9999px"
                                                    h="48px"
                                                />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Kapasitas (Orang)</FormLabel>
                                            <NumberInput
                                                value={formData.capacity}
                                                onChange={(value) => handleNumberChange('capacity', value)}
                                                min={1}
                                            >
                                                <NumberInputField
                                                    bg="rgba(255, 255, 255, 0.6)"
                                                    backdropFilter="blur(10px)"
                                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                                    borderRadius="9999px"
                                                    h="48px"
                                                />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Lokasi</FormLabel>
                                            <Input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="Contoh: Lantai 2, Gedung A"
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>

                                <Box>
                                    <H3 mb={4}>Foto Gedung</H3>
                                    <FormControl>
                                        <Box
                                            as="button"
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            w="100%"
                                            h="200px"
                                            bg="rgba(33, 209, 121, 0.05)"
                                            border="2px dashed"
                                            borderColor={formData.buildingPhoto ? COLORS.primary : "rgba(215, 215, 215, 0.5)"}
                                            borderRadius="16px"
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                            justifyContent="center"
                                            cursor="pointer"
                                            _hover={{
                                                bg: "rgba(33, 209, 121, 0.08)",
                                                borderColor: COLORS.primary
                                            }}
                                            transition="all 0.2s"
                                        >
                                            <VStack spacing={3}>
                                                <Building size={48} color={COLORS.primary} />
                                                <Text fontSize="lg" color="gray.600" textAlign="center">
                                                    {formData.buildingPhoto
                                                        ? formData.buildingPhoto.name
                                                        : "Klik untuk upload foto gedung"
                                                    }
                                                </Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    Format: JPG, JPEG, PNG, GIF
                                                </Text>
                                            </VStack>
                                        </Box>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </FormControl>
                                </Box>

                                {facilities.length > 0 && (
                                    <Box>
                                        <H3 mb={4}>Fasilitas</H3>
                                        <FormControl>
                                            <CheckboxGroup
                                                value={formData.facilities}
                                                onChange={handleFacilitiesChange}
                                            >
                                                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                                                    {facilities.map(facility => (
                                                        <Checkbox key={facility.id} value={facility.id}>
                                                            {facility.facilityName}
                                                        </Checkbox>
                                                    ))}
                                                </SimpleGrid>
                                            </CheckboxGroup>
                                        </FormControl>
                                    </Box>
                                )}

                                {availableManagers.length > 0 && (
                                    <Box>
                                        <H3 mb={4}>Building Manager</H3>
                                        <FormControl>
                                            <CheckboxGroup
                                                value={formData.buildingManagers}
                                                onChange={handleManagersChange}
                                            >
                                                <Stack spacing={3}>
                                                    {availableManagers.map(manager => (
                                                        <Checkbox key={manager.id} value={manager.id}>
                                                            <Box>
                                                                <Text fontWeight="medium">{manager.managerName}</Text>
                                                                <Text fontSize="sm" color="gray.600">{manager.phoneNumber}</Text>
                                                            </Box>
                                                        </Checkbox>
                                                    ))}
                                                </Stack>
                                            </CheckboxGroup>
                                        </FormControl>
                                    </Box>
                                )}

                                <HStack spacing={4} justify="flex-end" pt={6}>
                                    <SecondaryButton
                                        onClick={handleCancel}
                                        size="lg"
                                    >
                                        Batal
                                    </SecondaryButton>
                                    <PrimaryButton
                                        type="submit"
                                        isLoading={isLoading}
                                        loadingText={isEdit ? "Memperbarui..." : "Menyimpan..."}
                                        size="lg"
                                    >
                                        {isEdit ? 'Perbarui Gedung' : 'Simpan Gedung'}
                                    </PrimaryButton>
                                </HStack>
                            </VStack>
                        </form>
                    )}
                </Box>
            </VStack>
        </Container>
    );
};

export default BuildingFormPage;
