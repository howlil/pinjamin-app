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
    useDisclosure,
    Text
} from '@chakra-ui/react';
import { MapPin, Users, Calendar, Clock, Search } from 'lucide-react';
import { H3, H4 } from '@shared/components/Typography';
import BookingFormModal from '../../buildingDetail/components/BookingFormModal';
import { COLORS } from '@utils/designTokens';

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
            PKM: 'Gedung PKM',
            MULTIFUNCTION: 'Multifungsi'
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
                    bg="rgba(255, 255, 255, 0.95)"
                    backdropFilter="blur(15px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                    maxH="90vh"
                    fontFamily="Inter, sans-serif"
                >
                    <ModalHeader pb={4} pt={6}>
                        <VStack align="stretch" spacing={4} w="full">
                            <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                    <Box
                                        p={2}
                                        borderRadius="12px"
                                        bg="rgba(33, 209, 121, 0.1)"
                                    >
                                        <Search size={24} color={COLORS.primary} />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <H3 color="#2A2A2A" fontSize="xl" fontWeight="700">
                                            Hasil Pencarian Ruang
                                        </H3>
                                        <Text fontSize="sm" color="gray.600" fontFamily="Inter, sans-serif">
                                            Ditemukan {buildingsCount} gedung yang tersedia
                                        </Text>
                                    </VStack>
                                </HStack>

                                <Badge
                                    bg={COLORS.primary}
                                    color="white"
                                    borderRadius="full"
                                    px={4}
                                    py={2}
                                    fontSize="sm"
                                    fontWeight="600"
                                >
                                    {buildingsCount} Gedung
                                </Badge>
                            </HStack>

                            {/* Search Info */}
                            <Box
                                bg="rgba(33, 209, 121, 0.08)"
                                borderRadius="16px"
                                p={4}
                                border="1px solid rgba(33, 209, 121, 0.2)"
                            >
                                <HStack justify="space-between" align="center">
                                    <HStack spacing={6}>
                                        <HStack spacing={2}>
                                            <Icon as={Calendar} size={16} color={COLORS.primary} />
                                            <Text color="#2A2A2A" fontSize="sm" fontWeight="600" fontFamily="Inter, sans-serif">
                                                {requestedDateTime.date}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={2}>
                                            <Icon as={Clock} size={16} color={COLORS.primary} />
                                            <Text color="#2A2A2A" fontSize="sm" fontWeight="600" fontFamily="Inter, sans-serif">
                                                {requestedDateTime.time}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                </HStack>
                            </Box>
                        </VStack>
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <Container maxW="full" p={0}>
                            {buildingsCount === 0 ? (
                                <Box
                                    bg="rgba(255, 255, 255, 0.9)"
                                    backdropFilter="blur(15px)"
                                    borderRadius="24px"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    p={8}
                                    textAlign="center"
                                >
                                    <VStack spacing={4} py={4}>
                                        <Box
                                            bg="rgba(33, 209, 121, 0.1)"
                                            borderRadius="full"
                                            p={4}
                                        >
                                            <Icon as={Search} size={32} color={COLORS.primary} />
                                        </Box>
                                        <VStack spacing={2}>
                                            <Text color="#2A2A2A" fontSize="lg" fontWeight="600" fontFamily="Inter, sans-serif">
                                                Tidak ada gedung tersedia
                                            </Text>
                                            <Text color="gray.600" fontSize="sm" maxW="400px" textAlign="center" fontFamily="Inter, sans-serif">
                                                Tidak ada gedung yang tersedia pada waktu ini. Silakan coba waktu lain atau ubah kriteria pencarian.
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Box>
                            ) : (
                                <VStack spacing={4} w="full" align="stretch">
                                    {availableBuildings.map((building, index) => (
                                        <MotionBox
                                            key={building.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            w="100%"
                                        >
                                            <Box
                                                bg="rgba(255, 255, 255, 0.9)"
                                                backdropFilter="blur(15px)"
                                                border="1px solid rgba(215, 215, 215, 0.5)"
                                                borderRadius="24px"
                                                overflow="hidden"
                                                cursor="pointer"
                                                onClick={() => handleBuildingClick(building)}
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    bg: "rgba(255, 255, 255, 0.95)",
                                                    boxShadow: '0 12px 40px rgba(33, 209, 121, 0.15)',
                                                    borderColor: "rgba(33, 209, 121, 0.3)"
                                                }}
                                                transition="all 0.3s ease"
                                                boxShadow="0 6px 24px rgba(0, 0, 0, 0.08)"
                                                position="relative"
                                                w="100%"
                                                h="160px"
                                            >
                                                <HStack spacing={0} align="stretch" h="100%">
                                                    {/* Image Section - Fixed Width */}
                                                    <Box
                                                        position="relative"
                                                        w="240px"
                                                        h="100%"
                                                        flexShrink={0}
                                                    >
                                                        <Image
                                                            src={building.buildingPhoto}
                                                            alt={building.buildingName}
                                                            w="100%"
                                                            h="100%"
                                                            objectFit="cover"
                                                            fallbackSrc="https://via.placeholder.com/240x160?text=No+Image"
                                                        />

                                                        {/* Type Badge */}
                                                        <Box
                                                            position="absolute"
                                                            top={3}
                                                            left={3}
                                                            bg={COLORS.primary}
                                                            borderRadius="10px"
                                                            px={2}
                                                            py={1}
                                                        >
                                                            <Text color="white" fontSize="xs" fontWeight="600" fontFamily="Inter, sans-serif">
                                                                {getBuildingTypeLabel(building.buildingType)}
                                                            </Text>
                                                        </Box>
                                                    </Box>

                                                    {/* Content Section - Flex Fill */}
                                                    <Box
                                                        flex={1}
                                                        p={4}
                                                        display="flex"
                                                        flexDirection="column"
                                                        justify="space-between"
                                                        minW={0}
                                                    >
                                                        {/* Title & Description - Fixed Height */}
                                                        <Box h="60px" overflow="hidden">
                                                            <H4
                                                                fontSize="md"
                                                                fontWeight="700"
                                                                color="#2A2A2A"
                                                                noOfLines={1}
                                                                fontFamily="Inter, sans-serif"
                                                                mb={1}
                                                            >
                                                                {building.buildingName}
                                                            </H4>
                                                            <Text
                                                                color="gray.600"
                                                                fontSize="sm"
                                                                noOfLines={2}
                                                                lineHeight="1.3"
                                                                fontFamily="Inter, sans-serif"
                                                                overflow="hidden"
                                                                textOverflow="ellipsis"
                                                            >
                                                                {building.description}
                                                            </Text>
                                                        </Box>

                                                        {/* Bottom Section - Info & Price */}
                                                        <HStack justify="space-between" align="end" w="100%" mt={2}>
                                                            {/* Left: Location & Capacity */}
                                                            <VStack align="start" spacing={1} flex={1} minW={0}>
                                                                {/* Location */}
                                                                <HStack spacing={2} w="100%">
                                                                    <Icon as={MapPin} size={12} color={COLORS.primary} flexShrink={0} />
                                                                    <Text
                                                                        fontSize="xs"
                                                                        color="#2A2A2A"
                                                                        noOfLines={1}
                                                                        fontFamily="Inter, sans-serif"
                                                                        overflow="hidden"
                                                                        textOverflow="ellipsis"
                                                                    >
                                                                        {building.location}
                                                                    </Text>
                                                                </HStack>

                                                                {/* Capacity */}
                                                                <HStack spacing={2}>
                                                                    <Icon as={Users} size={12} color={COLORS.primary} flexShrink={0} />
                                                                    <Text
                                                                        fontSize="xs"
                                                                        color="#2A2A2A"
                                                                        fontFamily="Inter, sans-serif"
                                                                    >
                                                                        {building.capacity} orang
                                                                    </Text>
                                                                </HStack>
                                                            </VStack>

                                                            {/* Right: Price */}
                                                            <VStack align="end" spacing={0} minW="120px" flexShrink={0}>
                                                                <Text
                                                                    fontSize="xs"
                                                                    fontWeight="600"
                                                                    color="gray.500"
                                                                    textTransform="uppercase"
                                                                    fontFamily="Inter, sans-serif"
                                                                >
                                                                    Harga Sewa
                                                                </Text>
                                                                <Text
                                                                    fontWeight="700"
                                                                    color={COLORS.primary}
                                                                    fontSize="md"
                                                                    fontFamily="Inter, sans-serif"
                                                                    lineHeight="1"
                                                                >
                                                                    {formatPrice(building.rentalPrice)}
                                                                </Text>
                                                            </VStack>
                                                        </HStack>
                                                    </Box>
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
