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
    HStack,
    Container
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, GLASS, SHADOWS } from '../../utils/designTokens';
import RoomCard from '../ui/RoomCard';
import BuildingSearchFilter from './BuildingSearchFilter';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const BuildingCardGrid = ({
    buildings = [],
    loading = false,
    error = null,
    onCardClick,
    onDetailsClick,
    onSearch,
    formatCurrency,
    getBuildingTypeColor,
    getBuildingTypeText,
    getBuildingTypes
}) => {
    // Loading state
    if (loading) {
        return (
            <Box
                py={8}
                position="relative"
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(12px)"
                overflow="hidden"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={40}
                    maxOpacity={0.04}
                    duration={5}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                />

                <Container maxW="6xl" position="relative" zIndex={1}>
                    <VStack spacing={5} align="stretch">
                        {/* Compact Section Header */}
                        <VStack spacing={1} textAlign="center">
                            <Heading size="md" color={COLORS.black} fontWeight="bold" fontFamily="Inter, sans-serif">
                                Daftar Gedung Tersedia
                            </Heading>
                            <Text color={COLORS.black} fontSize="sm" opacity={0.6} maxW="xl">
                                Temukan gedung dengan fasilitas terbaik untuk acara Anda
                            </Text>
                        </VStack>

                        {/* Compact Search Filter */}
                        <BuildingSearchFilter
                            onSearch={onSearch}
                            buildingTypes={getBuildingTypes ? getBuildingTypes() : []}
                            loading={loading}
                        />

                        <VStack spacing={2}>
                            <Spinner size="md" color={COLORS.primary} thickness="3px" />
                            <Text color={COLORS.black} fontSize="sm">
                                Memuat data gedung...
                            </Text>
                        </VStack>
                    </VStack>
                </Container>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box
                py={8}
                position="relative"
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(12px)"
                overflow="hidden"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={40}
                    maxOpacity={0.04}
                    duration={5}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                />

                <Container maxW="6xl" position="relative" zIndex={1}>
                    <VStack spacing={5} align="stretch">
                        {/* Compact Section Header */}
                        <VStack spacing={1} textAlign="center">
                            <Heading size="md" color={COLORS.black} fontWeight="bold" fontFamily="Inter, sans-serif">
                                Daftar Gedung Tersedia
                            </Heading>
                            <Text color={COLORS.black} fontSize="sm" opacity={0.6} maxW="xl">
                                Temukan gedung dengan fasilitas terbaik untuk acara Anda
                            </Text>
                        </VStack>

                        {/* Compact Search Filter */}
                        <BuildingSearchFilter
                            onSearch={onSearch}
                            buildingTypes={getBuildingTypes ? getBuildingTypes() : []}
                            loading={loading}
                        />

                        <Alert
                            status="error"
                            borderRadius="lg"
                            maxW="md"
                            mx="auto"
                            bg="rgba(254, 226, 226, 0.9)"
                            backdropFilter="blur(10px)"
                            size="sm"
                        >
                            <AlertIcon />
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" fontSize="sm">Gagal memuat data gedung</Text>
                                <Text fontSize="xs" opacity={0.8}>
                                    {error}
                                </Text>
                            </VStack>
                        </Alert>
                    </VStack>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            py={8}
            position="relative"
            bg="rgba(255, 255, 255, 0.02)"
            backdropFilter="blur(12px)"
            overflow="hidden"
        >
            {/* Animated Grid Pattern Background */}
            <AnimatedGridPattern
                numSquares={50}
                maxOpacity={0.06}
                duration={6}
                repeatDelay={2}
                className="absolute inset-0 h-full w-full fill-[#749c73]/12 stroke-[#749c73]/6"
            />

            <Container maxW="6xl" position="relative" zIndex={1}>
                <VStack spacing={5} align="stretch">
                    {/* Compact Section Header */}
                    <VStack spacing={1} textAlign="center">
                        <MotionBox
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Heading size="md" color={COLORS.black} fontWeight="bold" fontFamily="Inter, sans-serif">
                                Daftar Gedung Tersedia
                            </Heading>
                        </MotionBox>
                        <MotionBox
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Text color={COLORS.black} fontSize="sm" opacity={0.6} maxW="xl">
                                Temukan gedung dengan fasilitas terbaik untuk acara Anda
                            </Text>
                        </MotionBox>
                    </VStack>

                    {/* Compact Search Filter */}
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <BuildingSearchFilter
                            onSearch={onSearch}
                            buildingTypes={getBuildingTypes ? getBuildingTypes() : []}
                            loading={loading}
                        />
                    </MotionBox>

                    {/* Results or Empty State */}
                    {(!buildings || buildings.length === 0) ? (
                        <VStack spacing={2} textAlign="center" py={4}>
                            <Text color={COLORS.black} fontSize="sm" fontWeight="medium">
                                Tidak ada gedung yang ditemukan
                            </Text>
                            <Text color={COLORS.black} fontSize="xs" opacity={0.5}>
                                Coba ubah kriteria pencarian Anda
                            </Text>
                        </VStack>
                    ) : (
                        <>
                            {/* Seamless Building Cards Grid */}
                            <Box
                                display="flex"
                                justifyContent="center"
                                w="full"
                            >
                                <SimpleGrid
                                    columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                                    spacing={3}
                                    w="full"
                                    maxW="1400px"
                                >
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
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.03,
                                                    ease: "easeOut"
                                                }}
                                                display="flex"
                                                justifyContent="center"
                                            >
                                                <Box position="relative" w="full" maxW="280px">
                                                    <RoomCard
                                                        room={roomData}
                                                        onClick={() => onCardClick && onCardClick(building.id)}
                                                        onDetailsClick={() => onDetailsClick && onDetailsClick(building.id)}
                                                    />

                                                    {/* Compact Building Type Badge */}
                                                    <Badge
                                                        position="absolute"
                                                        top={2}
                                                        right={2}
                                                        colorScheme={getBuildingTypeColor ? getBuildingTypeColor(building.buildingType) : 'blue'}
                                                        borderRadius="full"
                                                        px={2}
                                                        py={0.5}
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                        bg={`${getBuildingTypeColor ? getBuildingTypeColor(building.buildingType) : 'blue'}.500`}
                                                        color="white"
                                                        backdropFilter="blur(8px)"
                                                        boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                                                    >
                                                        {getBuildingTypeText ? getBuildingTypeText(building.buildingType) : building.buildingType}
                                                    </Badge>
                                                </Box>
                                            </MotionBox>
                                        );
                                    })}
                                </SimpleGrid>
                            </Box>
                        </>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default BuildingCardGrid; 