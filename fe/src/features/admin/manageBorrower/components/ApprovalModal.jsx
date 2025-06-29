import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Textarea,
    Button,
    Alert,
    AlertIcon,
    Box,
    Divider
} from '@chakra-ui/react';
import { Check, X, DollarSign } from 'lucide-react';

const ApprovalModal = ({
    isOpen,
    onClose,
    booking,
    type, // 'approve', 'reject', or 'refund'
    loading = false,
    onConfirm
}) => {
    const [reason, setReason] = useState('');

    const handleClose = () => {
        setReason('');
        onClose();
    };

    const handleConfirm = () => {
        if (type === 'approve') {
            onConfirm(booking.bookingId, { bookingStatus: 'APPROVED' });
        } else if (type === 'reject') {
            onConfirm(booking.bookingId, {
                bookingStatus: 'REJECTED',
                rejectionReason: reason
            });
        } else if (type === 'refund') {
            onConfirm(booking.bookingId, { refundReason: reason });
        }
        handleClose();
    };

    const getModalConfig = () => {
        switch (type) {
            case 'approve':
                return {
                    title: 'Setujui Peminjaman',
                    icon: <Check size={24} color="#21D179" />,
                    color: 'green',
                    message: 'Apakah Anda yakin ingin menyetujui peminjaman ini?',
                    confirmText: 'Setujui',
                    showReason: false
                };
            case 'reject':
                return {
                    title: 'Tolak Peminjaman',
                    icon: <X size={24} color="#EF4444" />,
                    color: 'red',
                    message: 'Peminjaman akan ditolak. Pastikan Anda memberikan alasan yang jelas.',
                    confirmText: 'Tolak',
                    showReason: true,
                    reasonLabel: 'Alasan Penolakan',
                    reasonPlaceholder: 'Masukkan alasan penolakan peminjaman...'
                };
            case 'refund':
                return {
                    title: 'Proses Refund',
                    icon: <DollarSign size={24} color="#FF8C00" />,
                    color: 'orange',
                    message: 'Refund akan diproses untuk peminjaman yang ditolak ini.',
                    confirmText: 'Proses Refund',
                    showReason: true,
                    reasonLabel: 'Alasan Refund',
                    reasonPlaceholder: 'Masukkan alasan refund...'
                };
            default:
                return {};
        }
    };

    const config = getModalConfig();

    if (!booking) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(10px)" />
            <ModalContent
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                mx={4}
            >
                <ModalHeader pb={2}>
                    <HStack spacing={3}>
                        {config.icon}
                        <Text fontSize="xl" fontWeight="700" color="#2A2A2A">
                            {config.title}
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={4}>
                    <VStack spacing={4} align="stretch">
                        {/* Booking Details */}
                        <Box
                            bg="rgba(33, 209, 121, 0.05)"
                            borderRadius="16px"
                            p={4}
                            border="1px solid rgba(33, 209, 121, 0.1)"
                        >
                            <Text fontSize="sm" fontWeight="600" color="#2A2A2A" mb={3}>
                                Detail Peminjaman:
                            </Text>
                            <VStack align="start" spacing={2}>
                                <HStack>
                                    <Text fontSize="sm" color="#666" minW="100px">Peminjam:</Text>
                                    <Text fontSize="sm" fontWeight="500" color="#2A2A2A">
                                        {booking.detail?.borrower?.fullName || booking.borrowerName || 'N/A'}
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Text fontSize="sm" color="#666" minW="100px">Gedung:</Text>
                                    <Text fontSize="sm" fontWeight="500" color="#2A2A2A">
                                        {booking.detail?.building?.buildingName || booking.buildingName || 'N/A'}
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Text fontSize="sm" color="#666" minW="100px">Kegiatan:</Text>
                                    <Text fontSize="sm" fontWeight="500" color="#2A2A2A">
                                        {booking.activityName}
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Text fontSize="sm" color="#666" minW="100px">Tanggal:</Text>
                                    <Text fontSize="sm" fontWeight="500" color="#2A2A2A">
                                        {booking.startDate}
                                        {booking.endDate && booking.endDate !== booking.startDate &&
                                            ` - ${booking.endDate}`
                                        }
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Text fontSize="sm" color="#666" minW="100px">Waktu:</Text>
                                    <Text fontSize="sm" fontWeight="500" color="#2A2A2A">
                                        {booking.startTime} - {booking.endTime}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>

                        <Divider />

                        {/* Message */}
                        <Alert status="info" borderRadius="12px">
                            <AlertIcon />
                            <Text fontSize="sm">{config.message}</Text>
                        </Alert>

                        {/* Reason Input */}
                        {config.showReason && (
                            <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" fontWeight="600" color="#2A2A2A">
                                    {config.reasonLabel} <Text as="span" color="red.500">*</Text>
                                </Text>
                                <Textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder={config.reasonPlaceholder}
                                    rows={4}
                                    resize="vertical"
                                    bg="rgba(255, 255, 255, 0.8)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="12px"
                                    _focus={{
                                        borderColor: '#21D179',
                                        boxShadow: '0 0 0 1px #21D179'
                                    }}
                                />
                                {config.showReason && !reason.trim() && (
                                    <Text fontSize="xs" color="red.500">
                                        {config.reasonLabel} wajib diisi
                                    </Text>
                                )}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter
                    justifyContent="space-between"
                    gap={3}
                >
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        w="100%"
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        isLoading={loading}
                        loadingText="Memproses..."
                        w="100%"
                        disabled={config.showReason && !reason.trim()}
                    >
                        {config.confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ApprovalModal; 