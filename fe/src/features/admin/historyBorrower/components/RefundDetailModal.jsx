import React, { useEffect } from 'react';
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
    Box,
    Badge,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Divider
} from '@chakra-ui/react';
import { FileText, Calendar, CreditCard, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatCurrency } from '@utils/helpers';
import { formatDate } from '@utils/helpers';
import { PrimaryButton } from '@shared/components/Button';
import { useRefundDetails } from '../api/useAdminBookings';

const RefundDetailModal = ({ isOpen, onClose, bookingId }) => {
    const { getRefundDetails, refundDetails, loading, error, clearRefundDetails } = useRefundDetails();

    useEffect(() => {
        if (isOpen && bookingId) {
            getRefundDetails(bookingId);
        }

        return () => {
            if (!isOpen) {
                clearRefundDetails();
            }
        };
    }, [isOpen, bookingId]);

    const getRefundStatusBadge = (status) => {
        const statusConfig = {
            PENDING: {
                color: 'yellow',
                text: 'Menunggu',
                icon: Clock,
                bgColor: 'rgba(251, 191, 36, 0.1)',
                borderColor: 'rgba(251, 191, 36, 0.3)',
                textColor: '#F59E0B'
            },
            APPROVED: {
                color: 'green',
                text: 'Disetujui',
                icon: CheckCircle,
                bgColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                textColor: '#10B981'
            },
            COMPLETED: {
                color: 'green',
                text: 'Selesai',
                icon: CheckCircle,
                bgColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                textColor: '#10B981'
            },
            FAILED: {
                color: 'red',
                text: 'Gagal',
                icon: XCircle,
                bgColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                textColor: '#EF4444'
            },
            NO_REFUND: {
                color: 'gray',
                text: 'Tidak Ada Refund',
                icon: AlertCircle,
                bgColor: 'rgba(107, 114, 128, 0.1)',
                borderColor: 'rgba(107, 114, 128, 0.3)',
                textColor: '#6B7280'
            }
        };

        const config = statusConfig[status] || statusConfig.NO_REFUND;
        const IconComponent = config.icon;

        return (
            <Badge
                bg={config.bgColor}
                border={`1px solid ${config.borderColor}`}
                color={config.textColor}
                borderRadius="9999px"
                px={3}
                py={2}
                display="flex"
                alignItems="center"
                gap={2}
                fontSize="sm"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
            >
                <IconComponent size={16} />
                {config.text}
            </Badge>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(5px)" />
            <ModalContent
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                fontFamily="Inter, sans-serif"
                maxW="600px"
            >
                <ModalHeader
                    fontSize="xl"
                    fontWeight="700"
                    color="#2A2A2A"
                    pb={6}
                    pt={8}
                    px={8}
                    fontFamily="Inter, sans-serif"
                >
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            borderRadius="12px"
                            bg="rgba(33, 209, 121, 0.1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <CreditCard size={20} color="#21D179" />
                        </Box>
                        <Text>Detail Refund</Text>
                    </HStack>
                </ModalHeader>

                <ModalCloseButton
                    borderRadius="full"
                    _hover={{ bg: "rgba(0, 0, 0, 0.1)" }}
                    _focus={{ boxShadow: "none" }}
                    size="lg"
                    mt={6}
                    mr={6}
                />

                <ModalBody px={8} pb={6}>
                    {loading ? (
                        <VStack spacing={4} py={8}>
                            <Spinner size="lg" color="#21D179" thickness="3px" />
                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                Memuat detail refund...
                            </Text>
                        </VStack>
                    ) : error ? (
                        <Alert
                            status="error"
                            borderRadius="16px"
                            bg="rgba(239, 68, 68, 0.05)"
                            border="1px solid rgba(239, 68, 68, 0.2)"
                            color="#DC2626"
                        >
                            <AlertIcon color="#DC2626" />
                            <Box fontFamily="Inter, sans-serif">
                                <AlertTitle fontSize="sm" fontWeight="600">
                                    Gagal memuat data
                                </AlertTitle>
                                <AlertDescription fontSize="xs" mt={1}>
                                    {error}
                                </AlertDescription>
                            </Box>
                        </Alert>
                    ) : refundDetails ? (
                        <VStack spacing={6} align="stretch">
                            {/* Booking Information */}
                            <Box
                                bg="rgba(248, 250, 252, 0.6)"
                                backdropFilter="blur(10px)"
                                borderRadius="16px"
                                border="1px solid rgba(215, 215, 215, 0.3)"
                                p={6}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="#666"
                                    mb={4}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Informasi Booking
                                </Text>
                                <VStack spacing={3} align="stretch">
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                            ID Booking:
                                        </Text>
                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                            #{refundDetails.bookingId}
                                        </Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                            Gedung:
                                        </Text>
                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                            {refundDetails.buildingName}
                                        </Text>
                                    </HStack>
                                    {refundDetails.borrowerName && (
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Peminjam:
                                            </Text>
                                            <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                                {refundDetails.borrowerName}
                                            </Text>
                                        </HStack>
                                    )}
                                </VStack>
                            </Box>

                            {/* Payment Information */}
                            <Box
                                bg="rgba(248, 250, 252, 0.6)"
                                backdropFilter="blur(10px)"
                                borderRadius="16px"
                                border="1px solid rgba(215, 215, 215, 0.3)"
                                p={6}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="#666"
                                    mb={4}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Informasi Pembayaran
                                </Text>
                                <VStack spacing={3} align="stretch">
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                            Total Pembayaran:
                                        </Text>
                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                            {formatCurrency(refundDetails.totalAmount)}
                                        </Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                            Status Pembayaran:
                                        </Text>
                                        <Badge
                                            colorScheme={refundDetails.paymentStatus === 'PAID' ? 'green' : 'yellow'}
                                            borderRadius="9999px"
                                            px={3}
                                            py={1}
                                            fontSize="xs"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            {refundDetails.paymentStatus}
                                        </Badge>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Refund Information */}
                            {refundDetails.refund ? (
                                <Box
                                    bg="rgba(33, 209, 121, 0.05)"
                                    backdropFilter="blur(10px)"
                                    borderRadius="16px"
                                    border="1px solid rgba(33, 209, 121, 0.2)"
                                    p={6}
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color="#21D179"
                                        mb={4}
                                        fontFamily="Inter, sans-serif"
                                    >
                                        Detail Refund
                                    </Text>
                                    <VStack spacing={3} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Jumlah Refund:
                                            </Text>
                                            <Text fontSize="lg" fontWeight="700" color="#21D179" fontFamily="Inter, sans-serif">
                                                {formatCurrency(refundDetails.refund.refundAmount)}
                                            </Text>
                                        </HStack>
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Status:
                                            </Text>
                                            {getRefundStatusBadge(refundDetails.refund.refundStatus)}
                                        </HStack>
                                        {refundDetails.refund.refundReason && (
                                            <>
                                                <Divider borderColor="rgba(215, 215, 215, 0.3)" />
                                                <Box>
                                                    <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif" mb={2}>
                                                        Alasan Refund:
                                                    </Text>
                                                    <Text fontSize="sm" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                                        {refundDetails.refund.refundReason}
                                                    </Text>
                                                </Box>
                                            </>
                                        )}
                                        {refundDetails.refund.refundDate && (
                                            <HStack justify="space-between">
                                                <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                    Tanggal Refund:
                                                </Text>
                                                <Text fontSize="sm" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                                    {formatDate(refundDetails.refund.refundDate)}
                                                </Text>
                                            </HStack>
                                        )}
                                        {refundDetails.refund.xenditRefundId && (
                                            <HStack justify="space-between">
                                                <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                    ID Transaksi:
                                                </Text>
                                                <Text fontSize="xs" color="#2A2A2A" fontFamily="monospace">
                                                    {refundDetails.refund.xenditRefundId}
                                                </Text>
                                            </HStack>
                                        )}
                                    </VStack>
                                </Box>
                            ) : (
                                <Alert
                                    status="info"
                                    borderRadius="16px"
                                    bg="rgba(59, 130, 246, 0.05)"
                                    border="1px solid rgba(59, 130, 246, 0.2)"
                                    color="#3B82F6"
                                >
                                    <AlertIcon color="#3B82F6" />
                                    <Box fontFamily="Inter, sans-serif">
                                        <AlertDescription fontSize="sm">
                                            {refundDetails.message || 'Tidak ada refund untuk booking ini'}
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            )}
                        </VStack>
                    ) : null}
                </ModalBody>

                <ModalFooter px={8} pb={8}>
                    <PrimaryButton
                        onClick={onClose}
                        bg="#21D179"
                        color="white"
                        borderRadius="9999px"
                        fontFamily="Inter, sans-serif"
                        fontWeight="600"
                        h="48px"
                        px={8}
                        fontSize="sm"
                        _hover={{
                            bg: "#1BAE66",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(33, 209, 121, 0.3)"
                        }}
                        _active={{
                            transform: "translateY(0)"
                        }}
                        transition="all 0.2s ease"
                    >
                        Tutup
                    </PrimaryButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RefundDetailModal; 