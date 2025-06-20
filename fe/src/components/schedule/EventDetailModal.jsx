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
    Divider
} from '@chakra-ui/react';
import { GLASS } from '@/utils/designTokens';
import { Calendar, Clock, User, MapPin, Activity, Building } from 'lucide-react';

const EventDetailModal = ({ isOpen, onClose, selectedEvent, getStatusColor, getStatusText }) => {
    if (!selectedEvent) return null;

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
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent
                bg={GLASS.background}
                backdropFilter={GLASS.backdropFilter}
                border={GLASS.border}
                borderRadius="20px"
                boxShadow="0 8px 32px rgba(116, 156, 115, 0.2)"
                maxW="500px"
            >
                <ModalHeader color="#444444" fontSize="xl" fontWeight="bold">
                    Detail Peminjaman
                </ModalHeader>
                <ModalCloseButton
                    color="#444444"
                    _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        {/* Building Photo */}
                        {selectedEvent.buildingPhoto && (
                            <Box borderRadius="lg" overflow="hidden">
                                <Image
                                    src={selectedEvent.buildingPhoto}
                                    alt={selectedEvent.room}
                                    w="full"
                                    h="200px"
                                    objectFit="cover"
                                />
                            </Box>
                        )}

                        {/* Activity Name */}
                        <Box>
                            <HStack spacing={2} mb={2}>
                                <Activity size={18} color="#749C73" />
                                <Text fontWeight="bold" color="#444444" fontSize="lg">
                                    {selectedEvent.title}
                                </Text>
                            </HStack>
                        </Box>

                        <Divider borderColor="rgba(116, 156, 115, 0.2)" />

                        {/* Building Info */}
                        <HStack align="start">
                            <Building size={16} color="#749C73" />
                            <VStack align="start" spacing={1} flex={1}>
                                <Text fontWeight="medium" color="#444444">
                                    {selectedEvent.room}
                                </Text>
                                <Badge
                                    colorScheme="blue"
                                    variant="subtle"
                                    fontSize="xs"
                                    borderRadius="full"
                                >
                                    {selectedEvent.buildingType}
                                </Badge>
                            </VStack>
                        </HStack>

                        {/* Location */}
                        <HStack align="start">
                            <MapPin size={16} color="#749C73" />
                            <Text color="#444444" fontSize="sm">
                                {selectedEvent.location}
                            </Text>
                        </HStack>

                        {/* Date */}
                        <HStack align="start">
                            <Calendar size={16} color="#749C73" />
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" color="#444444">
                                    Tanggal
                                </Text>
                                <Text color="#444444" fontSize="sm">
                                    {getDateRange()}
                                </Text>
                            </VStack>
                        </HStack>

                        {/* Time */}
                        <HStack align="start">
                            <Clock size={16} color="#749C73" />
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" color="#444444">
                                    Waktu
                                </Text>
                                <Text color="#444444" fontSize="sm">
                                    {selectedEvent.time} WIB
                                </Text>
                            </VStack>
                        </HStack>

                        {/* Borrower */}
                        <HStack align="start">
                            <User size={16} color="#749C73" />
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" color="#444444">
                                    Peminjam
                                </Text>
                                <Text color="#444444" fontSize="sm">
                                    {selectedEvent.borrowerName}
                                </Text>
                            </VStack>
                        </HStack>

                        <Divider borderColor="rgba(116, 156, 115, 0.2)" />

                        {/* Status */}
                        <HStack justify="space-between" align="center">
                            <Text fontWeight="medium" color="#444444">
                                Status
                            </Text>
                            <Badge
                                bg={getStatusColor(selectedEvent.status)}
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="sm"
                            >
                                {getStatusText(selectedEvent.status)}
                            </Badge>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EventDetailModal; 