import React from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Spinner,
    Alert,
    AlertIcon,
    Badge,
    HStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';
import RoomCard from '@/components/ui/RoomCard';

const MotionBox = motion(Box);

const BuildingCardGrid = ({
    buildings = [],
    loading = false,
    error = null,
    onCardClick,
    onDetailsClick,
    formatCurrency,
    getBuildingTypeColor,
    getBuildingTypeText
}) => {
    // Loading state
    if (loading) {
        return (
            <Box py={16} position="relative" bg="rgba(255, 255, 255, 0.5)" backdropFilter="blur(10px)">
                <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }}>
                    <VStack spacing={8} align="center">
                        <Heading size="xl" color={COLORS.black} fontWeight="bold">
                            Daftar Gedung Tersedia
                        </Heading>

                        <VStack spacing={4}>
                            <Spinner size="xl" color={COLORS.primary} thickness="4px" />
                            <Text color={COLORS.black} fontSize="lg">
                                Memuat data gedung...
                            </Text>
                        </VStack>
                    </VStack>
                </Box>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box py={16} position="relative" bg="rgba(255, 255, 255, 0.5)" backdropFilter="blur(10px)">
                <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }}>
                    <VStack spacing={8} align="center">
                        <Heading size="xl" color={COLORS.black} fontWeight="bold">
                            Daftar Gedung Tersedia
                        </Heading>

                        <Alert status="error" borderRadius="lg" maxW="md">
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">Gagal memuat data gedung</Text>
                                <Text fontSize="sm" opacity={0.8}>
                                    {error}
                                </Text>
                            </VStack>
                        </Alert>
                    </VStack>
                </Box>
            </Box>
        );
    }

    // Empty state
    if (!buildings || buildings.length === 0) {
        return (
            <Box py={16} position="relative" bg="rgba(255, 255, 255, 0.5)" backdropFilter="blur(10px)">
                <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }}>
                    <VStack spacing={8} align="center">
                        <Heading size="xl" color={COLORS.black} fontWeight="bold">
                            Daftar Gedung Tersedia
                        </Heading>

                        <VStack spacing={4} textAlign="center">
                            <Text color={COLORS.black} fontSize="lg">
                                Tidak ada gedung yang ditemukan
                            </Text>
                            <Text color={COLORS.black} fontSize="md" opacity={0.7}>
                                Coba ubah kriteria pencarian Anda
                            </Text>
                        </VStack>
                    </VStack>
                </Box>
            </Box>
        );
    }

    return (
        <Box py={16} position="relative" bg="rgba(255, 255, 255, 0.5)" backdropFilter="blur(10px)">
            <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }}>
                <VStack spacing={8} align="stretch">
                    {/* Section Header */}
                    <VStack spacing={4} textAlign="center">
                        <MotionBox
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Heading size="xl" color={COLORS.black} fontWeight="bold">
                                Daftar Gedung Tersedia
                            </Heading>
                        </MotionBox>
                        <MotionBox
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Text color={COLORS.black} fontSize="lg" opacity={0.8}>
                                Temukan gedung dengan fasilitas terbaik untuk mendukung kesuksesan acara akademik maupun non-akademik Anda.
                            </Text>
                        </MotionBox>
                    </VStack>

                    {/* Results Count */}
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Text color={COLORS.black} fontSize="md" textAlign="center" opacity={0.7}>
                            Menampilkan {buildings.length} gedung
                        </Text>
                    </MotionBox>

                    {/* Building Cards Grid */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                        {buildings.map((building, index) => {
                            // Transform API data to match RoomCard expectations
                            const roomData = {
                                id: building.id,
                                name: building.buildingName,
                                price: formatCurrency ? formatCurrency(building.rentalPrice) : `Rp ${building.rentalPrice?.toLocaleString()}`,
                                image: building.buildingPhoto,
                                description: building.description,
                                buildingType: building.buildingType
                            };

                            return (
                                <MotionBox
                                    key={building.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box position="relative">
                                        <RoomCard
                                            room={roomData}
                                            onClick={() => onCardClick && onCardClick(building.id)}
                                            onDetailsClick={() => onDetailsClick && onDetailsClick(building.id)}
                                        />

                                        {/* Building Type Badge */}
                                        <Badge
                                            position="absolute"
                                            top={3}
                                            right={3}
                                            colorScheme={getBuildingTypeColor ? getBuildingTypeColor(building.buildingType) : 'blue'}
                                            borderRadius="full"
                                            px={3}
                                            py={1}
                                            fontSize="xs"
                                            fontWeight="medium"
                                            bg={`${getBuildingTypeColor ? getBuildingTypeColor(building.buildingType) : 'blue'}.500`}
                                            color="white"
                                            backdropFilter="blur(10px)"
                                        >
                                            {getBuildingTypeText ? getBuildingTypeText(building.buildingType) : building.buildingType}
                                        </Badge>
                                    </Box>
                                </MotionBox>
                            );
                        })}
                    </SimpleGrid>
                </VStack>
            </Box>
        </Box>
    );
};

export default BuildingCardGrid; 