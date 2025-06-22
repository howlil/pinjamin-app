import React, { useState } from 'react';
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
import { COLORS, GLASS, SHADOWS } from '../../utils/designTokens';
import BookingFormModal from '../booking/BookingFormModal';

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
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const handleBuildingClick = (building) => {
        setSelectedBuilding(building);
        setIsBookingModalOpen(true);
    };

    const handleBookingModalClose = () => {
        setIsBookingModalOpen(false);
        setSelectedBuilding(null);
    };

    if (!isOpen) return null;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
                <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.500" />
                <ModalContent
                    bg="white"
                    borderRadius="16px"
                    mx={4}
                    my={4}
                    maxH="85vh"
                    boxShadow="xl"
                >
                    <ModalHeader color={COLORS.black} pb={3} pt={5} px={6}>
                        <VStack align="start" spacing={1}>
                            <Text fontSize="lg" fontWeight="bold">
                                Gedung Tersedia
                            </Text>
                            {searchCriteria && (
                                <HStack spacing={3} fontSize="xs" color={COLORS.gray[500]}>
                                    <HStack spacing={1}>
                                        <Icon as={Calendar} w={3} h={3} />
                                        <Text>{formatDisplayDate(searchCriteria.date)}</Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                        <Icon as={Clock} w={3} h={3} />
                                        <Text>{searchCriteria.time}</Text>
                                    </HStack>
                                </HStack>
                            )}
                        </VStack>
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={5} px={6}>
                        {/* Loading State */}
                        {loading && (
                            <VStack spacing={4} py={8}>
                                <Spinner size="lg" color={COLORS.primary} />
                                <Text color={COLORS.black} fontSize="sm">Mengecek ketersediaan gedung...</Text>
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
                                <Icon as={Calendar} w={10} h={10} color={COLORS.gray[400]} />
                                <Text fontSize="md" fontWeight="medium" color={COLORS.black}>
                                    Tidak ada gedung tersedia
                                </Text>
                                <Text color={COLORS.gray[600]} fontSize="sm">
                                    Coba ubah tanggal atau waktu pencarian
                                </Text>
                            </VStack>
                        )}

                        {/* Buildings List */}
                        {!loading && !error && buildings.length > 0 && (
                            <VStack spacing={4} align="stretch">
                                {/* Summary */}
                                <HStack justify="space-between" align="center" py={2}>
                                    <Text fontSize="sm" color={COLORS.gray[600]}>
                                        {buildings.length} gedung ditemukan
                                    </Text>
                                    <Badge
                                        bg={`${COLORS.primary}15`}
                                        color={COLORS.primary}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="medium"
                                    >
                                        Siap Dipesan
                                    </Badge>
                                </HStack>

                                {/* Buildings List - Compact Cards */}
                                <VStack spacing={2} align="stretch">
                                    {buildings.map((building, index) => (
                                        <MotionBox
                                            key={building.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.15, delay: index * 0.03 }}
                                        >
                                            <Box
                                                p={3}
                                                bg="gray.50"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                borderRadius="10px"
                                                _hover={{
                                                    bg: "gray.100",
                                                    borderColor: COLORS.primary,
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: "md"
                                                }}
                                                cursor="pointer"
                                                transition="all 0.15s ease"
                                                onClick={() => handleBuildingClick(building)}
                                            >
                                                <HStack spacing={3} align="center">
                                                    {/* Building Image */}
                                                    <Box flexShrink={0}>
                                                        <Image
                                                            src={building.buildingPhoto}
                                                            alt={building.buildingName}
                                                            w="60px"
                                                            h="45px"
                                                            objectFit="cover"
                                                            borderRadius="6px"
                                                            fallback={
                                                                <Box
                                                                    w="60px"
                                                                    h="45px"
                                                                    bg="gray.300"
                                                                    borderRadius="6px"
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                >
                                                                    <Icon as={MapPin} w={4} h={4} color="gray.500" />
                                                                </Box>
                                                            }
                                                        />
                                                    </Box>

                                                    {/* Building Info */}
                                                    <VStack align="start" spacing={0.5} flex={1}>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="semibold"
                                                            color={COLORS.black}
                                                            noOfLines={1}
                                                        >
                                                            {building.buildingName}
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color={COLORS.gray[600]}
                                                            noOfLines={1}
                                                        >
                                                            {building.description}
                                                        </Text>
                                                    </VStack>

                                                    {/* Price */}
                                                    <VStack align="end" spacing={0} flexShrink={0}>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="bold"
                                                            color={COLORS.primary}
                                                        >
                                                            {formatCurrency(building.rentalPrice)}
                                                        </Text>
                                                        <Text fontSize="2xs" color={COLORS.gray[500]}>
                                                            per hari
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                        </MotionBox>
                                    ))}
                                </VStack>

                                {/* Footer Info */}
                                <Text fontSize="xs" color={COLORS.gray[500]} textAlign="center" pt={2}>
                                    Klik gedung untuk melakukan peminjaman
                                </Text>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Booking Form Modal */}
            {selectedBuilding && (
                <BookingFormModal
                    isOpen={isBookingModalOpen}
                    onClose={handleBookingModalClose}
                    roomName={selectedBuilding.buildingName}
                    buildingData={selectedBuilding}
                    roomData={selectedBuilding}
                />
            )}
        </>
    );
};

export default AvailabilityModal; 