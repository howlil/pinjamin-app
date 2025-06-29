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
    Stack,
    Divider,
    Avatar,
    useColorModeValue,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Grid,
    GridItem
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Building,
    MapPin,
    Users,
    DollarSign,
    Edit2,
    Calendar,
    Clock,
    Phone,
    UserCheck,
    Wifi,
    Wind,
    Car,
    Utensils,
    Monitor,
    Mic,
    Camera,
    Shield,
    Zap,
    Volume2,
    Printer,
    Coffee,
    WifiOff,
    Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';
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

// Icon mapping for facilities
const getFacilityIcon = (facilityName) => {
    const name = facilityName.toLowerCase();

    if (name.includes('wifi') || name.includes('internet')) return Wifi;
    if (name.includes('ac') || name.includes('air condition') || name.includes('pendingin')) return Wind;
    if (name.includes('parkir') || name.includes('parking')) return Car;
    if (name.includes('catering') || name.includes('makanan') || name.includes('makan')) return Utensils;
    if (name.includes('projector') || name.includes('proyektor') || name.includes('lcd')) return Monitor;
    if (name.includes('mic') || name.includes('mikrofon') || name.includes('sound')) return Mic;
    if (name.includes('camera') || name.includes('kamera')) return Camera;
    if (name.includes('security') || name.includes('keamanan')) return Shield;
    if (name.includes('listrik') || name.includes('power') || name.includes('electricity')) return Zap;
    if (name.includes('speaker') || name.includes('audio')) return Volume2;
    if (name.includes('printer') || name.includes('print')) return Printer;
    if (name.includes('coffee') || name.includes('kopi') || name.includes('minuman')) return Coffee;

    // Default icon
    return Settings;
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
            <Container maxW="7xl" px={6} py={8}>
                <Center h="400px">
                    <VStack spacing={4}>
                        <Spinner size="xl" color={COLORS.primary} thickness="4px" />
                        <Text color="gray.600" fontFamily="Inter, sans-serif">
                            Memuat detail gedung...
                        </Text>
                    </VStack>
                </Center>
            </Container>
        );
    }

    if (!building) {
        return (
            <Container maxW="7xl" px={6} py={8}>
                <Center h="400px">
                    <VStack spacing={4}>
                        <Building size={64} color="gray.400" />
                        <Text color="gray.500" fontFamily="Inter, sans-serif">
                            Gedung tidak ditemukan
                        </Text>
                        <SecondaryButton
                            leftIcon={<ArrowLeft size={16} />}
                            onClick={() => navigate('/admin/manage-building')}
                        >
                            Kembali ke Daftar Gedung
                        </SecondaryButton>
                    </VStack>
                </Center>
            </Container>
        );
    }

    return (
        <Container maxW="7xl" px={6} py={8}>
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

                {/* Hero Section with Photo and Basic Info */}
                <Box
                    bg="white"
                    borderRadius={`${CORNER_RADIUS.components.cards}px`}
                    overflow="hidden"
                    boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                >
                    <Grid templateColumns={{ base: "1fr", lg: "400px 1fr" }} gap={0}>
                        <GridItem>
                            <Box
                                h={{ base: "250px", lg: "350px" }}
                                bg="gray.100"
                                position="relative"
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
                                        <Text color="gray.500" mt={2} fontSize="sm">
                                            Tidak ada foto
                                        </Text>
                                    </Center>
                                )}

                                {/* Type Badge Overlay */}
                                <Badge
                                    position="absolute"
                                    top={4}
                                    left={4}
                                    colorScheme={getBuildingTypeBadgeColor(building.buildingType)}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    fontSize="xs"
                                    fontWeight="600"
                                >
                                    {getBuildingTypeLabel(building.buildingType)}
                                </Badge>
                            </Box>
                        </GridItem>

                        <GridItem>
                            <Box p={8}>
                                <VStack spacing={6} align="stretch">
                                    <Box>
                                        <H2 mb={2}>{building.buildingName}</H2>
                                        <Text color="gray.600" fontSize="md" lineHeight="1.6">
                                            {building.description}
                                        </Text>
                                    </Box>

                                    <Divider />

                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        <Stat>
                                            <StatLabel display="flex" alignItems="center" gap={2}>
                                                <MapPin size={16} color={COLORS.primary} />
                                                Lokasi
                                            </StatLabel>
                                            <StatNumber fontSize="lg" color={COLORS.text}>
                                                {building.location}
                                            </StatNumber>
                                        </Stat>

                                        <Stat>
                                            <StatLabel display="flex" alignItems="center" gap={2}>
                                                <Users size={16} color={COLORS.primary} />
                                                Kapasitas
                                            </StatLabel>
                                            <StatNumber fontSize="lg" color={COLORS.text}>
                                                {building.capacity} Orang
                                            </StatNumber>
                                        </Stat>

                                        <Stat>
                                            <StatLabel display="flex" alignItems="center" gap={2}>
                                                <DollarSign size={16} color={COLORS.primary} />
                                                Harga Sewa
                                            </StatLabel>
                                            <StatNumber fontSize="xl" color={COLORS.primary}>
                                                {formatCurrency(building.rentalPrice)}
                                            </StatNumber>
                                            <StatHelpText>Per hari</StatHelpText>
                                        </Stat>

                                        <Stat>
                                            <StatLabel display="flex" alignItems="center" gap={2}>
                                                <Calendar size={16} color={COLORS.primary} />
                                                Dibuat
                                            </StatLabel>
                                            <StatNumber fontSize="lg" color={COLORS.text}>
                                                {new Date(building.createdAt).toLocaleDateString('id-ID')}
                                            </StatNumber>
                                            <StatHelpText>
                                                Terakhir update: {new Date(building.updatedAt).toLocaleDateString('id-ID')}
                                            </StatHelpText>
                                        </Stat>
                                    </SimpleGrid>
                                </VStack>
                            </Box>
                        </GridItem>
                    </Grid>
                </Box>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {/* Facilities Section */}
                    {building.facilities && building.facilities.length > 0 && (
                        <Box
                            bg="white"
                            p={6}
                            borderRadius={`${CORNER_RADIUS.components.cards}px`}
                            boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                        >
                            <VStack spacing={4} align="stretch">
                                <HStack spacing={2}>
                                    <Box
                                        w={2}
                                        h={6}
                                        bg={COLORS.primary}
                                        borderRadius="full"
                                    />
                                    <H3>Fasilitas Tersedia</H3>
                                </HStack>

                                <Wrap spacing={3}>
                                    {building.facilities.map(facility => {
                                        const IconComponent = getFacilityIcon(facility.facilityName);
                                        return (
                                            <WrapItem key={facility.id}>
                                                <Box
                                                    bg="rgba(33, 209, 121, 0.08)"
                                                    border="1px solid rgba(33, 209, 121, 0.2)"
                                                    borderRadius="16px"
                                                    px={4}
                                                    py={3}
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={3}
                                                    transition="all 0.2s ease"
                                                    _hover={{
                                                        bg: "rgba(33, 209, 121, 0.12)",
                                                        borderColor: "rgba(33, 209, 121, 0.3)",
                                                        transform: "translateY(-2px)",
                                                        boxShadow: "0 4px 12px rgba(33, 209, 121, 0.15)"
                                                    }}
                                                >
                                                    <Box
                                                        p={2}
                                                        bg={COLORS.primary}
                                                        borderRadius="8px"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <IconComponent size={16} color="white" />
                                                    </Box>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                        color={COLORS.text}
                                                        fontFamily="Inter, sans-serif"
                                                    >
                                                        {facility.facilityName}
                                                    </Text>
                                                </Box>
                                            </WrapItem>
                                        );
                                    })}
                                </Wrap>

                                <Box p={3} bg="rgba(33, 209, 121, 0.05)" borderRadius="12px">
                                    <Text fontSize="sm" color="gray.600" textAlign="center">
                                        Total {building.facilities.length} fasilitas tersedia
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    )}

                    {/* Building Managers Section */}
                    {building.buildingManagers && building.buildingManagers.length > 0 && (
                        <Box
                            bg="white"
                            p={6}
                            borderRadius={`${CORNER_RADIUS.components.cards}px`}
                            boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                        >
                            <VStack spacing={4} align="stretch">
                                <HStack spacing={2}>
                                    <Box
                                        w={2}
                                        h={6}
                                        bg={COLORS.primary}
                                        borderRadius="full"
                                    />
                                    <H3>Building Manager</H3>
                                </HStack>

                                <Stack spacing={4}>
                                    {building.buildingManagers.map(manager => (
                                        <Box
                                            key={manager.id}
                                            p={4}
                                            bg="rgba(248, 250, 252, 0.8)"
                                            border="1px solid rgba(215, 215, 215, 0.3)"
                                            borderRadius="16px"
                                            transition="all 0.2s ease"
                                            _hover={{
                                                bg: "rgba(33, 209, 121, 0.05)",
                                                borderColor: "rgba(33, 209, 121, 0.2)",
                                                transform: "translateY(-2px)"
                                            }}
                                        >
                                            <HStack spacing={3}>
                                                <Avatar
                                                    size="md"
                                                    name={manager.managerName}
                                                    bg={COLORS.primary}
                                                    color="white"
                                                    icon={<UserCheck size={20} />}
                                                />
                                                <VStack spacing={1} align="start" flex={1}>
                                                    <Text
                                                        fontWeight="600"
                                                        color={COLORS.text}
                                                        fontFamily="Inter, sans-serif"
                                                    >
                                                        {manager.managerName}
                                                    </Text>
                                                    <HStack spacing={2}>
                                                        <Phone size={14} color="gray.500" />
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray.600"
                                                            fontFamily="Inter, sans-serif"
                                                        >
                                                            {manager.phoneNumber}
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                                <Badge
                                                    colorScheme="green"
                                                    borderRadius="full"
                                                    px={2}
                                                    py={1}
                                                    fontSize="xs"
                                                >
                                                    Aktif
                                                </Badge>
                                            </HStack>
                                        </Box>
                                    ))}
                                </Stack>

                                <Box p={3} bg="rgba(33, 209, 121, 0.05)" borderRadius="12px">
                                    <Text fontSize="sm" color="gray.600" textAlign="center">
                                        {building.buildingManagers.length} manager bertanggung jawab
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    )}
                </SimpleGrid>

                {/* Empty State for Missing Data */}
                {(!building.facilities || building.facilities.length === 0) &&
                    (!building.buildingManagers || building.buildingManagers.length === 0) && (
                        <Box
                            bg="white"
                            p={8}
                            borderRadius={`${CORNER_RADIUS.components.cards}px`}
                            boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                            textAlign="center"
                        >
                            <VStack spacing={4}>
                                <Box
                                    p={4}
                                    bg="rgba(33, 209, 121, 0.08)"
                                    borderRadius="full"
                                >
                                    <Building size={48} color={COLORS.primary} />
                                </Box>
                                <Box>
                                    <Text
                                        fontWeight="600"
                                        color="gray.600"
                                        mb={2}
                                        fontFamily="Inter, sans-serif"
                                        fontSize="lg"
                                    >
                                        Informasi Tambahan Belum Tersedia
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        fontFamily="Inter, sans-serif"
                                        maxW="400px"
                                        mx="auto"
                                    >
                                        Fasilitas dan building manager belum ditambahkan untuk gedung ini.
                                        Silakan edit gedung untuk menambahkan informasi tersebut.
                                    </Text>
                                </Box>
                                <PrimaryButton
                                    leftIcon={<Edit2 size={16} />}
                                    onClick={() => navigate(`/admin/manage-building/edit/${id}`)}
                                    size="sm"
                                >
                                    Edit Gedung
                                </PrimaryButton>
                            </VStack>
                        </Box>
                    )}
            </VStack>
        </Container>
    );
};

export default BuildingDetailPage;
