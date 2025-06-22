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
    Badge,
    Image,
    Box,
    Divider,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GLASS } from '@/utils/designTokens';
import { Calendar, Clock, User, MapPin, Activity, Building } from 'lucide-react';

const MotionBox = motion(Box);

const EventDetailModal = ({ isOpen, onClose, selectedEvent, getStatusColor, getStatusText }) => {
    if (!selectedEvent) return null;

    const modalSize = useBreakpointValue({ base: 'sm', sm: 'md', md: 'lg' });
    const imageHeight = useBreakpointValue({ base: '150px', sm: '180px', md: '200px' });

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('-');
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
    };

    const getDateRange = () => {
        const startDate = formatDisplayDate(selectedEvent.startDate);
        const endDate = selectedEvent.endDate ? formatDisplayDate(selectedEvent.endDate) : null;

        if (endDate && endDate !== startDate) {
            return `${startDate} - ${endDate}`;
        }
        return startDate;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
            <ModalOverlay
                backdropFilter="blur(12px)"
                bg="rgba(0,0,0,0.4)"
            />
            <MotionBox
                as={ModalContent}
                bg={GLASS.background}
                backdropFilter={GLASS.backdropFilter}
                border={GLASS.border}
                borderRadius={{ base: "16px", md: "20px" }}
                boxShadow="0 20px 60px rgba(116, 156, 115, 0.15)"
                maxW={{ base: "90vw", sm: "450px", md: "500px" }}
                mx={{ base: 4, sm: "auto" }}
                overflow="hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(116,156,115,0.03) 0%, rgba(116,156,115,0.01) 100%)',
                    borderRadius: "inherit",
                    zIndex: -1
                }}
            >
                <ModalHeader
                    color="#444444"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="bold"
                    py={{ base: 4, md: 5 }}
                    px={{ base: 4, md: 6 }}
                    pb={2}
                >
                    Detail Peminjaman
                </ModalHeader>
                <ModalCloseButton
                    color="#444444"
                    top={{ base: 3, md: 4 }}
                    right={{ base: 3, md: 4 }}
                    bg="rgba(255, 255, 255, 0.1)"
                    borderRadius="8px"
                    _hover={{
                        bg: "rgba(116, 156, 115, 0.15)",
                        color: "#749C73"
                    }}
                />
                <ModalBody pb={{ base: 5, md: 6 }} px={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                        {/* Building Photo */}
                        {selectedEvent.buildingPhoto && (
                            <MotionBox
                                borderRadius="12px"
                                overflow="hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <Image
                                    src={selectedEvent.buildingPhoto}
                                    alt={selectedEvent.room}
                                    w="full"
                                    h={imageHeight}
                                    objectFit="cover"
                                    filter="brightness(0.9)"
                                />
                            </MotionBox>
                        )}

                        {/* Activity Name */}
                        <MotionBox
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <HStack spacing={3} mb={1}>
                                <Box
                                    p={2}
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="8px"
                                    color="#749C73"
                                >
                                    <Activity size={16} />
                                </Box>
                                <Text
                                    fontWeight="bold"
                                    color="#444444"
                                    fontSize={{ base: "md", md: "lg" }}
                                    lineHeight="1.2"
                                >
                                    {selectedEvent.title}
                                </Text>
                            </HStack>
                        </MotionBox>

                        <Divider borderColor="rgba(116, 156, 115, 0.2)" />

                        {/* Information Grid */}
                        <VStack spacing={3} align="stretch">
                            {/* Building Info */}
                            <HStack align="start" spacing={3}>
                                <Box
                                    p={2}
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="8px"
                                    color="#749C73"
                                    flexShrink={0}
                                >
                                    <Building size={14} />
                                </Box>
                                <VStack align="start" spacing={1} flex={1}>
                                    <Text fontWeight="semibold" color="#444444" fontSize="sm">
                                        {selectedEvent.room}
                                    </Text>
                                    <Badge
                                        colorScheme="blue"
                                        variant="subtle"
                                        fontSize="xs"
                                        borderRadius="full"
                                        px={2}
                                        py={0.5}
                                    >
                                        {selectedEvent.buildingType}
                                    </Badge>
                                </VStack>
                            </HStack>

                            {/* Location */}
                            <HStack align="start" spacing={3}>
                                <Box
                                    p={2}
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="8px"
                                    color="#749C73"
                                    flexShrink={0}
                                >
                                    <MapPin size={14} />
                                </Box>
                                <Text color="#444444" fontSize="sm" lineHeight="1.4">
                                    {selectedEvent.location}
                                </Text>
                            </HStack>

                            {/* Date */}
                            <HStack align="start" spacing={3}>
                                <Box
                                    p={2}
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="8px"
                                    color="#749C73"
                                    flexShrink={0}
                                >
                                    <Calendar size={14} />
                                </Box>
                                <VStack align="start" spacing={0.5}>
                                    <Text fontWeight="medium" color="#444444" fontSize="sm">
                                        Tanggal
                                    </Text>
                                    <Text color="#666666" fontSize="sm">
                                        {getDateRange()}
                                    </Text>
                                </VStack>
                            </HStack>

                            {/* Time */}
                            <HStack align="start" spacing={3}>
                                <Box
                                    p={2}
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="8px"
                                    color="#749C73"
                                    flexShrink={0}
                                >
                                    <Clock size={14} />
                                </Box>
                                <VStack align="start" spacing={0.5}>
                                    <Text fontWeight="medium" color="#444444" fontSize="sm">
                                        Waktu
                                    </Text>
                                    <Text color="#666666" fontSize="sm">
                                        {selectedEvent.time} WIB
                                    </Text>
                                </VStack>
                            </HStack>

                            {/* Borrower */}
                            <HStack align="start" spacing={3}>
                                <Box
                                    p={2}
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="8px"
                                    color="#749C73"
                                    flexShrink={0}
                                >
                                    <User size={14} />
                                </Box>
                                <VStack align="start" spacing={0.5}>
                                    <Text fontWeight="medium" color="#444444" fontSize="sm">
                                        Peminjam
                                    </Text>
                                    <Text color="#666666" fontSize="sm">
                                        {selectedEvent.borrowerName}
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>

                        <Divider borderColor="rgba(116, 156, 115, 0.2)" />

                        {/* Status */}
                        <HStack justify="space-between" align="center" py={2}>
                            <Text fontWeight="semibold" color="#444444" fontSize="sm">
                                Status Peminjaman
                            </Text>
                            <Badge
                                bg={getStatusColor(selectedEvent.status)}
                                color="white"
                                px={3}
                                py={1.5}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="semibold"
                                boxShadow="0 2px 4px rgba(0,0,0,0.1)"
                            >
                                {getStatusText(selectedEvent.status)}
                            </Badge>
                        </HStack>
                    </VStack>
                </ModalBody>
            </MotionBox>
        </Modal>
    );
};

export default EventDetailModal; 