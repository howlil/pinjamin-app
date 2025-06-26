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
    Image,
    Box,
    Badge,
    Icon,
    Container,
    useDisclosure
} from '@chakra-ui/react';
import { MapPin, Users, Calendar, Clock, Search } from 'lucide-react';
import { H3, H4, Text, Caption } from '@shared/components/Typography';
import Card from '@shared/components/Card';
import BookingFormModal from '../../buildingDetail/components/BookingFormModal';

let motion;
try {
    motion = require('framer-motion').motion;
} catch (error) {
    motion = {
        div: ({ children, initial, animate, transition, ...props }) => (
            <div {...props}>{children}</div>
        )
    };
}

const MotionBox = motion.div;

const AvailabilityResultModal = ({ isOpen, onClose, resultData }) => {
    const {
        isOpen: isBookingModalOpen,
        onOpen: onBookingModalOpen,
        onClose: onBookingModalClose
    } = useDisclosure();

    const [selectedBuilding, setSelectedBuilding] = React.useState(null);
    const [selectedDateForBooking, setSelectedDateForBooking] = React.useState(null);

    if (!resultData || !resultData.data) {
        return null;
    }

    const { availableBuildings, requestedDateTime } = resultData.data;
    const buildingsCount = availableBuildings?.length || 0;

    // Convert DD-MM-YYYY to Date object for booking modal
    const convertDateForBooking = (dateString) => {
        if (!dateString) return null;

        const [day, month, year] = dateString.split('-');
        return new Date(year, month - 1, day);
    };

    const handleBuildingClick = (building) => {
        setSelectedBuilding(building);
        setSelectedDateForBooking(convertDateForBooking(requestedDateTime.date));
        onBookingModalOpen();
    };

    const handleBookingModalClose = () => {
        onBookingModalClose();
        setSelectedBuilding(null);
        setSelectedDateForBooking(null);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getBuildingTypeLabel = (type) => {
        const labels = {
            SEMINAR: 'Ruang Seminar',
            LABORATORY: 'Laboratorium',
            CLASSROOM: 'Ruang Kelas',
            PKM: 'Gedung PKM'
        };
        return labels[type] || type;
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
                <ModalOverlay
                    bg="rgba(215, 215, 215, 0.5)"
                    backdropFilter="blur(10px)"
                />
                <ModalContent
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(10px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    maxH="90vh"
                    fontFamily="Inter, sans-serif"
                >
                    <ModalHeader pb={4} pt={6}>
                        <VStack align="start" spacing={3} w="full">
                            <H3 color="#2A2A2A" fontSize="xl" fontWeight="700">
                                Hasil Pencarian Ruang Rapat
                            </H3>

                            <HStack
                                w="full"
                                justify="space-between"
                                align="center"
                                bg="rgba(33, 209, 121, 0.08)"
                                p={3}
                                borderRadius="16px"
                            >
                                <HStack spacing={6}>
                                    <HStack spacing={2}>
                                        <Icon as={Calendar} size={16} color="#21D179" />
                                        <Text color="#2A2A2A" fontSize="sm" fontWeight="500">
                                            {requestedDateTime.date}
                                        </Text>
                                    </HStack>
                                    <HStack spacing={2}>
                                        <Icon as={Clock} size={16} color="#21D179" />
                                        <Text color="#2A2A2A" fontSize="sm" fontWeight="500">
                                            {requestedDateTime.time}
                                        </Text>
                                    </HStack>
                                </HStack>

                                <Badge
                                    bg="#21D179"
                                    color="white"
                                    borderRadius="20px"
                                    px={3}
                                    py={1}
                                    fontSize="xs"
                                    fontWeight="600"
                                >
                                    {buildingsCount} Gedung
                                </Badge>
                            </HStack>
                        </VStack>
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <Container maxW="full" p={0}>
                            {buildingsCount === 0 ? (
                                <VStack spacing={4} py={8} align="center">
                                    <Box
                                        bg="rgba(33, 209, 121, 0.1)"
                                        borderRadius="50%"
                                        p={4}
                                    >
                                        <Icon as={Search} size={24} color="#21D179" />
                                    </Box>
                                    <VStack spacing={1} align="center">
                                        <Text color="#2A2A2A" fontSize="md" fontWeight="600">
                                            Tidak ada gedung tersedia
                                        </Text>
                                        <Text color="#2A2A2A" fontSize="sm" opacity={0.7} maxW="300px" textAlign="center">
                                            Tidak ada gedung yang tersedia pada waktu ini. Silakan coba waktu lain.
                                        </Text>
                                    </VStack>
                                </VStack>
                            ) : (
                                <VStack spacing={6} w="full">
                                    {availableBuildings.map((building, index) => (
                                        <MotionBox
                                            key={building.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            w="100%"
                                        >
                                            <Box
                                                bg="rgba(255, 255, 255, 0.9)"
                                                backdropFilter="blur(15px)"
                                                border="1px solid rgba(33, 209, 121, 0.2)"
                                                borderRadius="24px"
                                                overflow="hidden"
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    bg: "rgba(255, 255, 255, 0.95)",
                                                    boxShadow: '0 12px 40px rgba(33, 209, 121, 0.15)',
                                                    borderColor: "rgba(33, 209, 121, 0.3)"
                                                }}
                                                transition="all 0.3s ease"
                                                boxShadow="0 6px 24px rgba(33, 209, 121, 0.08)"
                                                w="100%"
                                                cursor="pointer"
                                                p={0}
                                                height="160px"
                                                onClick={() => handleBuildingClick(building)}
                                            >
                                                <HStack spacing={0} align="stretch" h="100%">
                                                    {/* Image Section */}
                                                    <Box position="relative" flexShrink={0}>
                                                        <Image
                                                            src={building.buildingPhoto}
                                                            alt={building.buildingName}
                                                            w="200px"
                                                            h="160px"
                                                            objectFit="cover"
                                                            fallbackSrc="https://via.placeholder.com/200x160?text=No+Image"
                                                        />
                                                        <Box
                                                            position="absolute"
                                                            top={3}
                                                            left={3}
                                                            bg="#21D179"
                                                            borderRadius="16px"
                                                            px={2}
                                                            py={1}
                                                        >
                                                            <Text color="white" fontSize="xs" fontWeight="600">
                                                                {getBuildingTypeLabel(building.buildingType)}
                                                            </Text>
                                                        </Box>
                                                    </Box>

                                                    {/* Content Section */}
                                                    <VStack
                                                        align="stretch"
                                                        p={4}
                                                        spacing={3}
                                                        flex={1}
                                                        justify="space-between"
                                                        h="100%"
                                                    >
                                                        {/* Header - Fixed Height */}
                                                        <Box minH="60px" w="full">
                                                            <VStack align="start" spacing={1} w="full">
                                                                <H4
                                                                    fontSize="md"
                                                                    fontWeight="700"
                                                                    color="#2A2A2A"
                                                                    noOfLines={1}
                                                                    lineHeight="1.2"
                                                                >
                                                                    {building.buildingName}
                                                                </H4>
                                                                <Text
                                                                    color="#2A2A2A"
                                                                    fontSize="xs"
                                                                    opacity={0.7}
                                                                    noOfLines={2}
                                                                    lineHeight="1.3"
                                                                >
                                                                    {building.description}
                                                                </Text>
                                                            </VStack>
                                                        </Box>

                                                        {/* Info and Price - Fixed Height */}
                                                        <Box w="full">
                                                            <HStack justify="space-between" align="end" w="full">
                                                                {/* Left: Location & Capacity */}
                                                                <VStack align="start" spacing={1} flex={1}>
                                                                    <HStack spacing={2}>
                                                                        <Icon as={MapPin} size={12} color="#21D179" />
                                                                        <Text
                                                                            color="#2A2A2A"
                                                                            fontSize="xs"
                                                                            noOfLines={1}
                                                                        >
                                                                            {building.location}
                                                                        </Text>
                                                                    </HStack>
                                                                    <HStack spacing={2}>
                                                                        <Icon as={Users} size={12} color="#21D179" />
                                                                        <Text
                                                                            color="#2A2A2A"
                                                                            fontSize="xs"
                                                                        >
                                                                            {building.capacity} orang
                                                                        </Text>
                                                                    </HStack>
                                                                </VStack>

                                                                {/* Right: Price */}
                                                                <VStack align="end" spacing={0} minW="120px">
                                                                    <Text
                                                                        color="#2A2A2A"
                                                                        fontSize="xs"
                                                                        opacity={0.6}
                                                                        fontWeight="500"
                                                                    >
                                                                        HARGA SEWA
                                                                    </Text>
                                                                    <Text
                                                                        fontWeight="700"
                                                                        color="#21D179"
                                                                        fontSize="md"
                                                                        lineHeight="1"
                                                                    >
                                                                        {formatPrice(building.rentalPrice)}
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </Box>
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                        </MotionBox>
                                    ))}
                                </VStack>
                            )}
                        </Container>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Booking Form Modal */}
            {selectedBuilding && (
                <BookingFormModal
                    isOpen={isBookingModalOpen}
                    onClose={handleBookingModalClose}
                    buildingId={selectedBuilding.id}
                    buildingName={selectedBuilding.buildingName}
                    selectedDate={selectedDateForBooking}
                    requestedTime={requestedDateTime.time}
                />
            )}
        </>
    );
};

export default AvailabilityResultModal;
