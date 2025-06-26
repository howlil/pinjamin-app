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
import { Calendar, Clock, User, Building, AlertCircle } from 'lucide-react';
import { H3, H4, Text as CustomText, Caption } from '@shared/components/Typography';

const BookingDetailModal = ({ isOpen, onClose, booking, selectedDate }) => {
    const statusConfig = {
        APPROVED: {
            label: 'Disetujui',
            bgColor: '#21D179',
            textColor: 'white'
        },
        PROCESSING: {
            label: 'Sedang Diproses',
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

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay
                bg="rgba(215, 215, 215, 0.5)"
                backdropFilter="blur(10px)"
            />
            <ModalContent
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                fontFamily="Inter, sans-serif"
            >
                <ModalHeader pb={2} pt={6}>
                    <H3 color="#2A2A2A" fontSize="xl" fontWeight="700">
                        {booking ? 'Detail Peminjaman' : 'Belum Ada Peminjaman'}
                    </H3>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    {booking ? (
                        <VStack spacing={4} align="stretch">
                            {/* Header with Status */}
                            <HStack justify="space-between" align="center">
                                <CustomText fontSize="sm" color="#2A2A2A" opacity={0.7}>
                                    {formatDate(selectedDate)}
                                </CustomText>
                                <Badge
                                    bg={statusConfig[booking.status]?.bgColor || '#9CA3AF'}
                                    color={statusConfig[booking.status]?.textColor || 'white'}
                                    borderRadius="20px"
                                    px={3}
                                    py={1}
                                    fontSize="xs"
                                    fontWeight="600"
                                >
                                    {statusConfig[booking.status]?.label || booking.status}
                                </Badge>
                            </HStack>

                            {/* Activity Name */}
                            <Box
                                bg="rgba(33, 209, 121, 0.08)"
                                borderRadius="16px"
                                p={4}
                            >
                                <VStack align="start" spacing={2}>
                                    <Caption
                                        color="#2A2A2A"
                                        opacity={0.6}
                                        fontSize="xs"
                                        textTransform="uppercase"
                                        letterSpacing="0.5px"
                                        fontWeight="600"
                                    >
                                        Nama Kegiatan
                                    </Caption>
                                    <H4
                                        color="#2A2A2A"
                                        fontSize="md"
                                        fontWeight="700"
                                    >
                                        {booking.activityName || 'Rapat Peminjaman'}
                                    </H4>
                                </VStack>
                            </Box>

                            {/* Details */}
                            <VStack spacing={3} align="stretch">
                                <HStack spacing={3}>
                                    <Icon as={Clock} size={18} color="#21D179" />
                                    <VStack align="start" spacing={0} flex={1}>
                                        <CustomText fontSize="sm" fontWeight="600" color="#2A2A2A">
                                            Waktu
                                        </CustomText>
                                        <CustomText fontSize="sm" color="#2A2A2A" opacity={0.8}>
                                            {booking.startTime} - {booking.endTime}
                                        </CustomText>
                                    </VStack>
                                </HStack>

                                {booking.borrowerDetails && (
                                    <HStack spacing={3}>
                                        <Icon as={User} size={18} color="#21D179" />
                                        <VStack align="start" spacing={0} flex={1}>
                                            <CustomText fontSize="sm" fontWeight="600" color="#2A2A2A">
                                                Peminjam
                                            </CustomText>
                                            <CustomText fontSize="sm" color="#2A2A2A" opacity={0.8}>
                                                {booking.borrowerDetails.borrowerName}
                                            </CustomText>
                                        </VStack>
                                    </HStack>
                                )}
                            </VStack>
                        </VStack>
                    ) : (
                        <VStack spacing={4} py={4} align="center">
                            <Box
                                bg="rgba(33, 209, 121, 0.1)"
                                borderRadius="50%"
                                p={4}
                            >
                                <Icon as={AlertCircle} size={32} color="#21D179" />
                            </Box>
                            <VStack spacing={2} align="center">
                                <H4 color="#2A2A2A" fontSize="md" fontWeight="600" textAlign="center">
                                    Belum Ada Peminjaman
                                </H4>
                                <CustomText color="#2A2A2A" fontSize="sm" opacity={0.7} textAlign="center" maxW="250px">
                                    Tidak ada peminjaman pada tanggal {formatDate(selectedDate)}
                                </CustomText>
                            </VStack>
                        </VStack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default BookingDetailModal;
