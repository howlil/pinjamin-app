import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    SimpleGrid,
    Text,
    Image,
    Badge,
    Center,
    Spinner,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    Stack
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building, MapPin, Users, DollarSign, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { COLORS } from '@utils/designTokens';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import { H2, H3 } from '@shared/components/Typography';

const getBuildingTypeLabel = (type) => {
    const labels = {
        'CLASSROOM': 'Classroom',
        'PKM': 'PKM',
        'LABORATORY': 'Laboratory',
        'MULTIFUNCTION': 'Multifunction',
        'SEMINAR': 'Seminar'
    };
    return labels[type] || type;
};

const getBuildingTypeBadgeColor = (type) => {
    const colors = {
        'CLASSROOM': 'blue',
        'PKM': 'green',
        'LABORATORY': 'purple',
        'MULTIFUNCTION': 'orange',
        'SEMINAR': 'pink'
    };
    return colors[type] || 'gray';
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const BuildingDetailPage = ({ onLoadBuilding }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadBuildingData();
        }
    }, [id]);

    const loadBuildingData = async () => {
        setLoading(true);
        try {
            const buildingData = await onLoadBuilding(id);
            if (buildingData) {
                setBuilding(buildingData);
            } else {
                toast.error('Gedung tidak ditemukan');
                navigate('/admin/manage-building');
            }
        } catch (error) {
            // Error handled in apiClient
            navigate('/admin/manage-building');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin/manage-building');
    };

    const handleEdit = () => {
        navigate('/admin/manage-building/edit/' + id);
    };

    if (loading) {
        return (
            <Container maxW="6xl" py={8}>
                <Center h="400px">
                    <Spinner size="xl" color={COLORS.primary} />
                </Center>
            </Container>
        );
    }

    if (!building) {
        return (
            <Container maxW="6xl" py={8}>
                <Center h="400px">
                    <Text>Gedung tidak ditemukan</Text>
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
                            Detail Gedung
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                <HStack justify="space-between" align="center">
                    <Box>
                        <H2>{building.buildingName}</H2>
                        <Text color="gray.600">
                            Detail informasi gedung
                        </Text>
                    </Box>
                    <HStack spacing={3}>
                        <SecondaryButton
                            leftIcon={<ArrowLeft size={20} />}
                            onClick={handleBack}
                        >
                            Kembali
                        </SecondaryButton>
                        <PrimaryButton
                            leftIcon={<Edit2 size={20} />}
                            onClick={handleEdit}
                        >
                            Edit Gedung
                        </PrimaryButton>
                    </HStack>
                </HStack>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <Box bg="white" p={6} borderRadius="24px" boxShadow="sm">
                        <VStack spacing={4} align="stretch">
                            <H3>Foto Gedung</H3>
                            <Box
                                w="100%"
                                h="300px"
                                borderRadius="16px"
                                overflow="hidden"
                                bg="gray.100"
                            >
                                {building.buildingPhoto ? (
                                    <Image
                                        src={building.buildingPhoto}
                                        alt={building.buildingName}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <Center w="100%" h="100%" flexDirection="column">
                                        <Building size={64} color="gray.400" />
                                        <Text color="gray.500" mt={2}>
                                            Tidak ada foto
                                        </Text>
                                    </Center>
                                )}
                            </Box>
                        </VStack>
                    </Box>

                    <Box bg="white" p={6} borderRadius="24px" boxShadow="sm">
                        <VStack spacing={6} align="stretch">
                            <H3>Informasi Gedung</H3>

                            <VStack spacing={4} align="stretch">
                                <HStack>
                                    <Text fontWeight="semibold" minW="120px">Nama:</Text>
                                    <Text>{building.buildingName}</Text>
                                </HStack>

                                <HStack align="flex-start">
                                    <Text fontWeight="semibold" minW="120px">Tipe:</Text>
                                    <Badge
                                        colorScheme={getBuildingTypeBadgeColor(building.buildingType)}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                    >
                                        {getBuildingTypeLabel(building.buildingType)}
                                    </Badge>
                                </HStack>

                                <HStack align="flex-start">
                                    <Text fontWeight="semibold" minW="120px">Deskripsi:</Text>
                                    <Text>{building.description}</Text>
                                </HStack>

                                <HStack>
                                    <MapPin size={16} color={COLORS.primary} />
                                    <Text fontWeight="semibold" minW="120px">Lokasi:</Text>
                                    <Text>{building.location}</Text>
                                </HStack>

                                <HStack>
                                    <Users size={16} color={COLORS.primary} />
                                    <Text fontWeight="semibold" minW="120px">Kapasitas:</Text>
                                    <Text>{building.capacity} orang</Text>
                                </HStack>

                                <HStack>
                                    <DollarSign size={16} color={COLORS.primary} />
                                    <Text fontWeight="semibold" minW="120px">Harga Sewa:</Text>
                                    <Text fontWeight="bold" color={COLORS.primary}>
                                        {formatCurrency(building.rentalPrice)}
                                    </Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>
                </SimpleGrid>

                {building.facilities && building.facilities.length > 0 && (
                    <Box bg="white" p={6} borderRadius="24px" boxShadow="sm">
                        <VStack spacing={4} align="stretch">
                            <H3>Fasilitas</H3>
                            <Wrap>
                                {building.facilities.map(facility => (
                                    <WrapItem key={facility.id}>
                                        <Tag
                                            size="lg"
                                            colorScheme="green"
                                            borderRadius="full"
                                        >
                                            <TagLabel>{facility.facilityName}</TagLabel>
                                        </Tag>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        </VStack>
                    </Box>
                )}

                {building.buildingManagers && building.buildingManagers.length > 0 && (
                    <Box bg="white" p={6} borderRadius="24px" boxShadow="sm">
                        <VStack spacing={4} align="stretch">
                            <H3>Building Manager</H3>
                            <Stack spacing={3}>
                                {building.buildingManagers.map(manager => (
                                    <Box
                                        key={manager.id}
                                        p={4}
                                        border="1px"
                                        borderColor="gray.200"
                                        borderRadius="12px"
                                    >
                                        <Text fontWeight="semibold">{manager.managerName}</Text>
                                        <Text fontSize="sm" color="gray.600">{manager.phoneNumber}</Text>
                                    </Box>
                                ))}
                            </Stack>
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Container>
    );
};

export default BuildingDetailPage;
