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
    Divider,
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

    console.log(booking);

    const currentStatus = statusConfig[booking.status] || statusConfig.PENDING;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay
                bg="rgba(215, 215, 215, 0.5)"
                backdropFilter="blur(10px)"
            />
            <ModalContent
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                fontFamily="Inter, sans-serif"
            >
                <ModalHeader pb={2} pt={6}>
                    <VStack align="start" spacing={2} w="full">
                        <HStack justify="space-between" w="full">
                            <H3 color="#2A2A2A" fontSize="xl" fontWeight="700">
                                Detail Peminjaman
                            </H3>
                            <Badge
                                bg={currentStatus.bgColor}
                                color={currentStatus.textColor}
                                borderRadius="20px"
                                px={3}
                                py={1}
                                fontSize="xs"
                                fontWeight="600"
                            >
                                {currentStatus.label}
                            </Badge>
                        </HStack>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        {/* Activity Name */}
                        <Box
                            bg="rgba(33, 209, 121, 0.05)"
                            borderRadius="16px"
                            p={4}
                            border="1px solid rgba(33, 209, 121, 0.1)"
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
                                    fontSize="lg"
                                    fontWeight="700"
                                >
                                    {booking.activityName || 'Rapat Peminjaman'}
                                </H4>
                            </VStack>
                        </Box>

                        {/* Building Details */}
                        <VStack spacing={3} align="stretch">
                            <HStack spacing={3}>
                                <Icon as={Building} size={20} color="#21D179" />
                                <VStack align="start" spacing={0} flex={1}>
                                    <CustomText fontSize="sm" fontWeight="600" color="#2A2A2A">
                                        Gedung
                                    </CustomText>
                                    <CustomText fontSize="sm" color="#2A2A2A" opacity={0.8}>
                                        {booking.buildingName}
                                    </CustomText>
                                </VStack>
                            </HStack>

                            <HStack spacing={3}>
                                <Icon as={Calendar} size={20} color="#21D179" />
                                <VStack align="start" spacing={0} flex={1}>
                                    <CustomText fontSize="sm" fontWeight="600" color="#2A2A2A">
                                        Tanggal
                                    </CustomText>
                                    <CustomText fontSize="sm" color="#2A2A2A" opacity={0.8}>
                                        {booking.date}
                                    </CustomText>
                                </VStack>
                            </HStack>

                            <HStack spacing={3}>
                                <Icon as={Clock} size={20} color="#21D179" />
                                <VStack align="start" spacing={0} flex={1}>
                                    <CustomText fontSize="sm" fontWeight="600" color="#2A2A2A">
                                        Waktu
                                    </CustomText>
                                    <CustomText fontSize="sm" color="#2A2A2A" opacity={0.8}>
                                        {booking.startTime} - {booking.endTime}
                                    </CustomText>
                                </VStack>
                            </HStack>

                            {booking.borrowerName && (
                                <HStack spacing={3}>
                                    <Icon as={User} size={20} color="#21D179" />
                                    <VStack align="start" spacing={0} flex={1}>
                                        <CustomText fontSize="sm" fontWeight="600" color="#2A2A2A">
                                            Peminjam
                                        </CustomText>
                                        <CustomText fontSize="sm" color="#2A2A2A" opacity={0.8}>
                                            {booking.borrowerName}
                                        </CustomText>       
                                    </VStack>
                                </HStack>
                            )}
                        </VStack>

                     
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default BookingPreviewModal;
