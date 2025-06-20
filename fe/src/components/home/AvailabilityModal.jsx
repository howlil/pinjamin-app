import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Image,
    Button,
    Badge,
    Box,
    SimpleGrid,
    Divider,
    Icon,
    Spinner,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    MapPin,
    DollarSign,
    Eye,
    CheckCircle
} from 'lucide-react';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';

const MotionBox = motion(Box);

const AvailabilityModal = ({
    isOpen,
    onClose,
    buildings = [],
    loading = false,
    error = null,
    searchCriteria,
    formatCurrency,
    formatDisplayDate,
    onViewDetails,
    onSelectBuilding
}) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
            <ModalContent
                bg={GLASS.background}
                backdropFilter={GLASS.backdropFilter}
                border={GLASS.border}
                borderRadius="20px"
                mx={4}
                my={4}
                maxH="90vh"
            >
                <ModalHeader color={COLORS.black} pb={2}>
                    <HStack spacing={3}>
                        <Icon as={CheckCircle} color={COLORS.primary} size="24" />
                        <VStack align="start" spacing={1}>
                            <Text fontSize="xl" fontWeight="bold">
                                Gedung Tersedia
                            </Text>
                            {searchCriteria && (
                                <HStack spacing={4} fontSize="sm" color={COLORS.gray[600]}>
                                    <HStack spacing={1}>
                                        <Icon as={Calendar} size="14" />
                                        <Text>{formatDisplayDate(searchCriteria.date)}</Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                        <Icon as={Clock} size="14" />
                                        <Text>{searchCriteria.time}</Text>
                                    </HStack>
                                </HStack>
                            )}
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    {/* Loading State */}
                    {loading && (
                        <VStack spacing={4} py={8}>
                            <Spinner size="xl" color={COLORS.primary} />
                            <Text color={COLORS.black}>Mengecek ketersediaan gedung...</Text>
                        </VStack>
                    )}

                    {/* Error State */}
                    {error && (
                        <Alert status="error" borderRadius="lg" mb={4}>
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">Gagal mengecek ketersediaan</Text>
                                <Text fontSize="sm">{error}</Text>
                            </VStack>
                        </Alert>
                    )}

                    {/* Empty State */}
                    {!loading && !error && buildings.length === 0 && (
                        <VStack spacing={4} py={8} textAlign="center">
                            <Icon as={Calendar} size="48" color={COLORS.gray[400]} />
                            <Text fontSize="lg" fontWeight="medium" color={COLORS.black}>
                                Tidak ada gedung tersedia
                            </Text>
                            <Text color={COLORS.gray[600]}>
                                Coba ubah tanggal atau waktu pencarian
                            </Text>
                        </VStack>
                    )}

                    {/* Buildings List */}
                    {!loading && !error && buildings.length > 0 && (
                        <VStack spacing={6} align="stretch">
                            {/* Summary */}
                            <Box
                                p={4}
                                bg="rgba(116, 156, 115, 0.1)"
                                borderRadius="lg"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                            >
                                <HStack justify="space-between" align="center">
                                    <Text fontSize="lg" fontWeight="semibold" color={COLORS.black}>
                                        {buildings.length} Gedung Tersedia
                                    </Text>
                                    <Badge
                                        colorScheme="green"
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="sm"
                                    >
                                        Siap Dipesan
                                    </Badge>
                                </HStack>
                            </Box>

                            <Divider />

                            {/* Buildings Grid */}
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                {buildings.map((building, index) => (
                                    <MotionBox
                                        key={building.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Box
                                            p={4}
                                            bg="rgba(255, 255, 255, 0.7)"
                                            backdropFilter="blur(10px)"
                                            border="1px solid rgba(255, 255, 255, 0.3)"
                                            borderRadius="16px"
                                            _hover={{
                                                transform: 'translateY(-2px)',
                                                boxShadow: SHADOWS.lg,
                                                bg: "rgba(255, 255, 255, 0.9)"
                                            }}
                                            cursor="pointer"
                                        >
                                            <VStack spacing={4} align="stretch">
                                                {/* Building Image */}
                                                <Box position="relative">
                                                    <Image
                                                        src={building.buildingPhoto}
                                                        alt={building.buildingName}
                                                        h="150px"
                                                        w="100%"
                                                        objectFit="cover"
                                                        borderRadius="12px"
                                                        fallback={
                                                            <Box
                                                                h="150px"
                                                                bg="gray.200"
                                                                borderRadius="12px"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                <Icon as={MapPin} size="24" color="gray.400" />
                                                            </Box>
                                                        }
                                                    />
                                                    <Badge
                                                        position="absolute"
                                                        top={2}
                                                        right={2}
                                                        colorScheme="green"
                                                        borderRadius="full"
                                                        px={2}
                                                        py={1}
                                                        fontSize="xs"
                                                    >
                                                        Tersedia
                                                    </Badge>
                                                </Box>

                                                {/* Building Info */}
                                                <VStack spacing={2} align="stretch">
                                                    <Text
                                                        fontSize="lg"
                                                        fontWeight="bold"
                                                        color={COLORS.black}
                                                        noOfLines={1}
                                                    >
                                                        {building.buildingName}
                                                    </Text>

                                                    <Text
                                                        fontSize="sm"
                                                        color={COLORS.gray[600]}
                                                        noOfLines={2}
                                                        lineHeight="tall"
                                                    >
                                                        {building.description}
                                                    </Text>

                                                    <HStack justify="space-between" align="center">
                                                        <HStack spacing={1}>
                                                            <Icon as={DollarSign} size="16" color={COLORS.primary} />
                                                            <Text
                                                                fontSize="lg"
                                                                fontWeight="bold"
                                                                color={COLORS.primary}
                                                            >
                                                                {formatCurrency(building.rentalPrice)}
                                                            </Text>
                                                        </HStack>

                                                        <Text fontSize="xs" color={COLORS.gray[500]}>
                                                            per hari
                                                        </Text>
                                                    </HStack>
                                                </VStack>

                                                {/* Action Buttons */}
                                                <HStack spacing={2}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        flex={1}
                                                        leftIcon={<Eye size={14} />}
                                                        onClick={() => onViewDetails && onViewDetails(building.id)}
                                                        borderColor={COLORS.primary}
                                                        color={COLORS.primary}
                                                        _hover={{
                                                            bg: `${COLORS.primary}10`
                                                        }}
                                                    >
                                                        Detail
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        flex={1}
                                                        bg={COLORS.primary}
                                                        color="white"
                                                        _hover={{
                                                            bg: COLORS.primary,
                                                            opacity: 0.9
                                                        }}
                                                        onClick={() => onSelectBuilding && onSelectBuilding(building)}
                                                    >
                                                        Pilih
                                                    </Button>
                                                </HStack>
                                            </VStack>
                                        </Box>
                                    </MotionBox>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AvailabilityModal; 