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
    Divider,
    Skeleton,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from '@chakra-ui/react';
import { Eye, DollarSign, Calendar, User, Building2, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAdminRefundDetails } from '../../features/admin/historyBorrower/api/useAdminBookings';
import { useRefundDetails } from '../../features/buildingDetail/api/useBooking';
import { useAuthStore } from '../store/authStore';
import { PrimaryButton } from './Button';

const RefundDetailModal = ({ isOpen, onClose, bookingId }) => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ADMIN';

    // Use appropriate hook based on user role
    const adminHook = useAdminRefundDetails();
    const userHook = useRefundDetails();

    const {
        getRefundDetails,
        clearRefundDetails,
        refundDetails,
        loading,
        error
    } = isAdmin ? adminHook : userHook;

    // Safety check to ensure hooks are available
    if (!getRefundDetails || !clearRefundDetails) {
        return null;
    }

    useEffect(() => {
        if (isOpen && bookingId) {
            getRefundDetails(bookingId);
        }

        return () => {
            if (!isOpen) {
                clearRefundDetails();
            }
        };
        // Only depend on isOpen and bookingId to prevent infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, bookingId]);

    const handleClose = () => {
        clearRefundDetails();
        onClose();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';

        try {
            let date;

            // Check if it's in DD-MM-YYYY format from backend
            if (typeof dateString === 'string' && dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
                const [day, month, year] = dateString.split('-');
                date = new Date(year, month - 1, day); // month is 0-indexed
            } else {
                // Try to parse as standard date format
                date = new Date(dateString);
            }

            // Check if the date is valid
            if (isNaN(date.getTime())) {
                console.warn('Invalid date format:', dateString);
                return dateString; // Return original string if parsing fails
            }

            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta'
            });
        } catch (error) {
            console.error('Date formatting error:', error, dateString);
            return dateString; // Return original string if error occurs
        }
    };

    const getRefundStatusBadge = (status) => {
        const statusConfig = {
            'NO_REFUND': {
                color: 'gray',
                icon: XCircle,
                text: 'Tidak Ada Refund'
            },
            'PENDING': {
                color: 'yellow',
                icon: Clock,
                text: 'Menunggu Proses'
            },
            'PROCESSING': {
                color: 'blue',
                icon: Clock,
                text: 'Sedang Diproses'
            },
            'COMPLETED': {
                color: 'green',
                icon: CheckCircle,
                text: 'Selesai'
            },
            'SUCCEEDED': {
                color: 'green',
                icon: CheckCircle,
                text: 'Berhasil'
            },
            'FAILED': {
                color: 'red',
                icon: XCircle,
                text: 'Gagal'
            },
            'REJECTED': {
                color: 'red',
                icon: XCircle,
                text: 'Ditolak'
            }
        };

        const config = statusConfig[status] || statusConfig['NO_REFUND'];
        const IconComponent = config.icon;

        return (
            <Badge
                colorScheme={config.color}
                px={3}
                py={1}
                borderRadius="9999px"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                fontSize="xs"
                display="flex"
                alignItems="center"
                gap={1}
            >
                <IconComponent size={12} />
                {config.text}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { color: 'yellow', text: 'Menunggu Pembayaran' },
            'PAID': { color: 'green', text: 'Sudah Dibayar' },
            'FAILED': { color: 'red', text: 'Pembayaran Gagal' },
            'EXPIRED': { color: 'gray', text: 'Kedaluwarsa' }
        };

        const config = statusConfig[status] || { color: 'gray', text: status };

        return (
            <Badge
                colorScheme={config.color}
                px={3}
                py={1}
                borderRadius="9999px"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                fontSize="xs"
            >
                {config.text}
            </Badge>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay
                bg="rgba(0, 0, 0, 0.4)"
                backdropFilter="blur(4px)"
            />
            <ModalContent
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                fontFamily="Inter, sans-serif"
                mx={4}
            >
                <ModalHeader
                    pb={4}
                    borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                >
                    <HStack spacing={3} align="center">
                        <Box
                            p={2}
                            borderRadius="12px"
                            bg="rgba(33, 209, 121, 0.1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <DollarSign size={20} color="#21D179" />
                        </Box>
                        <Text
                            fontSize="lg"
                            fontWeight="700"
                            color="#2A2A2A"
                            fontFamily="Inter, sans-serif"
                        >
                            Detail Refund
                        </Text>
                    </HStack>
                </ModalHeader>

                <ModalCloseButton
                    color="#666"
                    _hover={{ bg: "rgba(255, 0, 0, 0.1)", color: "#EF4444" }}
                    borderRadius="8px"
                />

                <ModalBody py={6}>
                    <VStack spacing={6} align="stretch">
                        {!bookingId ? (
                            <Alert
                                status="warning"
                                borderRadius="16px"
                                bg="rgba(245, 158, 11, 0.05)"
                                border="1px solid rgba(245, 158, 11, 0.2)"
                                color="#D97706"
                            >
                                <AlertIcon as={AlertCircle} color="#D97706" />
                                <Box fontFamily="Inter, sans-serif">
                                    <AlertTitle fontSize="sm" fontWeight="600">
                                        Data tidak tersedia
                                    </AlertTitle>
                                    <AlertDescription fontSize="xs" mt={1}>
                                        ID booking tidak ditemukan. Silakan tutup modal dan coba lagi.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        ) : loading ? (
                            <VStack spacing={4}>
                                <Skeleton height="60px" borderRadius="16px" />
                                <Skeleton height="40px" borderRadius="16px" />
                                <Skeleton height="80px" borderRadius="16px" />
                            </VStack>
                        ) : error ? (
                            <Alert
                                status="error"
                                borderRadius="16px"
                                bg="rgba(239, 68, 68, 0.05)"
                                border="1px solid rgba(239, 68, 68, 0.2)"
                                color="#DC2626"
                            >
                                <AlertIcon as={AlertCircle} color="#DC2626" />
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
                            <>
                                {/* Basic Info */}
                                <Box
                                    bg="rgba(248, 250, 252, 0.6)"
                                    borderRadius="16px"
                                    p={5}
                                    border="1px solid rgba(215, 215, 215, 0.3)"
                                >
                                    <VStack spacing={4} align="stretch">
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="#2A2A2A"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            Informasi Booking
                                        </Text>

                                        <VStack spacing={3} align="stretch">
                                            <HStack justify="space-between">
                                                <HStack spacing={2}>
                                                    <Building2 size={16} color="#666" />
                                                    <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                        Gedung
                                                    </Text>
                                                </HStack>
                                                <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                                    {refundDetails.buildingName}
                                                </Text>
                                            </HStack>

                                            {refundDetails.borrowerName && (
                                                <HStack justify="space-between">
                                                    <HStack spacing={2}>
                                                        <User size={16} color="#666" />
                                                        <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                            Peminjam
                                                        </Text>
                                                    </HStack>
                                                    <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                                        {refundDetails.borrowerName}
                                                    </Text>
                                                </HStack>
                                            )}

                                            <HStack justify="space-between">
                                                <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                    Total Pembayaran
                                                </Text>
                                                <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif">
                                                    {formatCurrency(refundDetails.totalAmount)}
                                                </Text>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                    Status Pembayaran
                                                </Text>
                                                {getPaymentStatusBadge(refundDetails.paymentStatus)}
                                            </HStack>
                                        </VStack>
                                    </VStack>
                                </Box>

                                <Divider />

                                {/* Refund Details */}
                                {refundDetails.refund ? (
                                    <Box
                                        bg="rgba(248, 250, 252, 0.6)"
                                        borderRadius="16px"
                                        p={5}
                                        border="1px solid rgba(215, 215, 215, 0.3)"
                                    >
                                        <VStack spacing={4} align="stretch">
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                Detail Refund
                                            </Text>

                                            <VStack spacing={3} align="stretch">
                                                <HStack justify="space-between">
                                                    <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                        Status Refund
                                                    </Text>
                                                    {getRefundStatusBadge(refundDetails.refund.refundStatus)}
                                                </HStack>

                                                <HStack justify="space-between">
                                                    <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                        Jumlah Refund
                                                    </Text>
                                                    <Text fontSize="sm" fontWeight="600" color="#21D179" fontFamily="Inter, sans-serif">
                                                        {formatCurrency(refundDetails.refund.refundAmount)}
                                                    </Text>
                                                </HStack>

                                                {refundDetails.refund.refundDate && (
                                                    <HStack justify="space-between" align="flex-start">
                                                        <HStack spacing={2}>
                                                            <Calendar size={16} color="#666" />
                                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                                Tanggal Refund
                                                            </Text>
                                                        </HStack>
                                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="Inter, sans-serif" textAlign="right">
                                                            {formatDate(refundDetails.refund.refundDate)}
                                                        </Text>
                                                    </HStack>
                                                )}

                                                {refundDetails.refund.refundReason && (
                                                    <VStack align="stretch" spacing={2}>
                                                        <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                            Alasan Refund
                                                        </Text>
                                                        <Box
                                                            bg="rgba(255, 255, 255, 0.8)"
                                                            borderRadius="12px"
                                                            p={3}
                                                            border="1px solid rgba(215, 215, 215, 0.5)"
                                                        >
                                                            <Text fontSize="sm" color="#2A2A2A" fontFamily="Inter, sans-serif" lineHeight="1.5">
                                                                {refundDetails.refund.refundReason}
                                                            </Text>
                                                        </Box>
                                                    </VStack>
                                                )}

                                                {refundDetails.refund.xenditRefundId && (
                                                    <HStack justify="space-between">
                                                        <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                            ID Refund Xendit
                                                        </Text>
                                                        <Text fontSize="sm" fontWeight="600" color="#2A2A2A" fontFamily="monospace">
                                                            {refundDetails.refund.xenditRefundId}
                                                        </Text>
                                                    </HStack>
                                                )}
                                            </VStack>
                                        </VStack>
                                    </Box>
                                ) : (
                                    <Alert
                                        status="info"
                                        borderRadius="16px"
                                        bg="rgba(59, 130, 246, 0.05)"
                                        border="1px solid rgba(59, 130, 246, 0.2)"
                                        color="#2563EB"
                                    >
                                        <AlertIcon as={AlertCircle} color="#2563EB" />
                                        <Box fontFamily="Inter, sans-serif">
                                            <AlertTitle fontSize="sm" fontWeight="600">
                                                Tidak ada refund
                                            </AlertTitle>
                                            <AlertDescription fontSize="xs" mt={1}>
                                                {refundDetails.message || 'Tidak ada refund untuk booking ini'}
                                            </AlertDescription>
                                        </Box>
                                    </Alert>
                                )}
                            </>
                        ) : null}
                    </VStack>
                </ModalBody>

                <ModalFooter
                    pt={4}
                    borderTop="1px solid rgba(215, 215, 215, 0.3)"
                >
                    <PrimaryButton
                        onClick={handleClose}
                        bg="#21D179"
                        color="white"
                        borderRadius="9999px"
                        fontFamily="Inter, sans-serif"
                        fontWeight="600"
                        fontSize="sm"
                        h="40px"
                        px={6}
                        _hover={{
                            bg: "#1BAE66",
                            transform: "translateY(-1px)",
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