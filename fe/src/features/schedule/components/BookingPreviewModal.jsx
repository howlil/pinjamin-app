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
    Icon,
    Box
} from '@chakra-ui/react';
import { MapPin, Clock, User, Calendar, Building } from 'lucide-react';
import { H3, H4, Text as CustomText, Caption } from '@shared/components/Typography';

const BookingPreviewModal = ({ isOpen, onClose, booking }) => {
    if (!booking) return null;

    const statusConfig = {
        APPROVED: {
            label: 'Disetujui',
            bgColor: '#21D179',
            textColor: 'white'
        },
        PENDING: {
            label: 'Diproses',
            bgColor: '#FF8C00',
            textColor: 'white'
        },
        PROCESSING: {
            label: 'Diproses',
            bgColor: '#FF8C00',
            textColor: 'white'
        },
        COMPLETED: {
            label: 'Selesai',
            bgColor: '#9CA3AF',
            textColor: 'white'
        },
        CANCELLED: {
            label: 'Dibatalkan',
            bgColor: '#EF4444',
            textColor: 'white'
        }
    };

    const currentStatus = statusConfig[booking.status] || statusConfig.PENDING;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
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
                fontFamily="Inter, sans-serif"
            >
                <ModalHeader pb={2} pt={6}>
                    <VStack align="start" spacing={3} w="full">
                        <HStack justify="space-between" w="full">
                            <H3 color="#2A2A2A" fontSize="xl" fontWeight="700">
                                Detail Peminjaman
                            </H3>
                            <Badge
                                bg={currentStatus.bgColor}
                                color={currentStatus.textColor}
                                borderRadius="full"
                                px={4}
                                py={2}
                                fontSize="sm"
                                fontWeight="600"
                            >
                                {currentStatus.label}
                            </Badge>
                        </HStack>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Activity Name */}
                        <Box
                            bg="rgba(33, 209, 121, 0.08)"
                            borderRadius="16px"
                            p={5}
                            border="1px solid rgba(33, 209, 121, 0.2)"
                        >
                            <VStack align="start" spacing={2}>
                                <Text
                                    color="#2A2A2A"
                                    opacity={0.7}
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="1px"
                                    fontWeight="600"
                                    fontFamily="Inter, sans-serif"
                                >
                                    Nama Kegiatan
                                </Text>
                                <H4
                                    color="#2A2A2A"
                                    fontSize="lg"
                                    fontWeight="700"
                                    fontFamily="Inter, sans-serif"
                                >
                                    {booking.activityName || 'Rapat Peminjaman'}
                                </H4>
                            </VStack>
                        </Box>

                        {/* Details Grid */}
                        <VStack spacing={4} align="stretch">
                            {/* Building */}
                            <Box
                                bg="rgba(255, 255, 255, 0.8)"
                                borderRadius="12px"
                                p={4}
                                border="1px solid rgba(215, 215, 215, 0.3)"
                            >
                                <HStack spacing={3} align="center">
                                    <Box
                                        p={2}
                                        borderRadius="8px"
                                        bg="rgba(33, 209, 121, 0.1)"
                                    >
                                        <Icon as={Building} size={20} color="#21D179" />
                                    </Box>
                                    <VStack align="start" spacing={0} flex={1}>
                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                            Gedung
                                        </Text>
                                        <Text fontSize="sm" color="#2A2A2A" opacity={0.8} fontFamily="Inter, sans-serif">
                                            {booking.buildingName}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>

                            {/* Date */}
                            <Box
                                bg="rgba(255, 255, 255, 0.8)"
                                borderRadius="12px"
                                p={4}
                                border="1px solid rgba(215, 215, 215, 0.3)"
                            >
                                <HStack spacing={3} align="center">
                                    <Box
                                        p={2}
                                        borderRadius="8px"
                                        bg="rgba(33, 209, 121, 0.1)"
                                    >
                                        <Icon as={Calendar} size={20} color="#21D179" />
                                    </Box>
                                    <VStack align="start" spacing={0} flex={1}>
                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                            Tanggal
                                        </Text>
                                        <Text fontSize="sm" color="#2A2A2A" opacity={0.8} fontFamily="Inter, sans-serif">
                                            {booking.date || booking.startDate}
                                            {booking.endDate && booking.endDate !== (booking.date || booking.startDate) &&
                                                ` - ${booking.endDate}`
                                            }
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>

                            {/* Time */}
                            <Box
                                bg="rgba(255, 255, 255, 0.8)"
                                borderRadius="12px"
                                p={4}
                                border="1px solid rgba(215, 215, 215, 0.3)"
                            >
                                <HStack spacing={3} align="center">
                                    <Box
                                        p={2}
                                        borderRadius="8px"
                                        bg="rgba(33, 209, 121, 0.1)"
                                    >
                                        <Icon as={Clock} size={20} color="#21D179" />
                                    </Box>
                                    <VStack align="start" spacing={0} flex={1}>
                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                            Waktu
                                        </Text>
                                        <Text fontSize="sm" color="#2A2A2A" opacity={0.8} fontFamily="Inter, sans-serif">
                                            {booking.startTime} - {booking.endTime}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>

                            {/* Borrower */}
                            {booking.borrowerName && (
                                <Box
                                    bg="rgba(255, 255, 255, 0.8)"
                                    borderRadius="12px"
                                    p={4}
                                    border="1px solid rgba(215, 215, 215, 0.3)"
                                >
                                    <HStack spacing={3} align="center">
                                        <Box
                                            p={2}
                                            borderRadius="8px"
                                            bg="rgba(33, 209, 121, 0.1)"
                                        >
                                            <Icon as={User} size={20} color="#21D179" />
                                        </Box>
                                        <VStack align="start" spacing={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                                Peminjam
                                            </Text>
                                            <Text fontSize="sm" color="#2A2A2A" opacity={0.8} fontFamily="Inter, sans-serif">
                                                {booking.borrowerName}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            )}
                        </VStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default BookingPreviewModal;
