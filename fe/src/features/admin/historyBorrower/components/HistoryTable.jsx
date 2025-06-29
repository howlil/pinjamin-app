import React, { useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Badge,
    IconButton,
    Text,
    HStack,
    VStack,
    Box,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Textarea,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { RefreshCw, Eye, DollarSign } from 'lucide-react';
import { useBookingRefund } from '../api/useAdminBookings';
import RefundDetailModal from '@shared/components/RefundDetailModal';
import BookingDetailModal from '@shared/components/BookingDetailModal';

const HistoryTable = ({ bookings, loading, onRefresh }) => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const {
        isOpen: isDetailModalOpen,
        onOpen: onDetailModalOpen,
        onClose: onDetailModalClose
    } = useDisclosure();
    const {
        isOpen: isRefundDetailModalOpen,
        onOpen: onRefundDetailModalOpen,
        onClose: onRefundDetailModalClose
    } = useDisclosure();
    const { processRefund, loading: refundLoading } = useBookingRefund();
    const toast = useToast();

    // Debug log untuk melihat data yang diterima
    console.log('HistoryTable received bookings:', bookings);
    console.log('HistoryTable loading state:', loading);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'APPROVED':
                return { bg: '#21D179', color: 'white' };
            case 'REJECTED':
                return { bg: '#EF4444', color: 'white' };
            case 'COMPLETED':
                return { bg: '#3B82F6', color: 'white' };
            default:
                return { bg: '#9CA3AF', color: 'white' };
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'Disetujui';
            case 'REJECTED':
                return 'Ditolak';
            case 'COMPLETED':
                return 'Selesai';
            default:
                return status;
        }
    };

    const hasRefund = (booking) => {
        // Check if booking has refund information
        // Based on the API response structure, refund info could be in different places:

        // 1. Direct refund field in booking
        if (booking.refund && booking.refund.refundStatus) {
            return true;
        }

        // 2. Refund status field directly in booking
        if (booking.refundStatus && booking.refundStatus !== 'NO_REFUND' && booking.refundStatus !== null) {
            return true;
        }

        // 3. Has refund boolean field
        if (booking.hasRefund === true) {
            return true;
        }

        // 4. Refund info in detail object
        if (booking.detail && booking.detail.refund && booking.detail.refund.refundStatus) {
            return true;
        }

        // 5. Refund ID exists (indicates refund has been processed)
        if (booking.refundId || (booking.refund && booking.refund.id)) {
            return true;
        }

        // 6. Check for any refund-related fields that indicate refund exists
        if (booking.refundAmount || booking.refundDate || booking.refundReason) {
            return true;
        }

        return false;
    };

    // Helper function to check if refund button should be shown
    const shouldShowRefundButton = (booking) => {
        return booking.status === 'REJECTED' && !hasRefund(booking);
    };

    const handleDetailClick = (booking) => {
        setSelectedBooking(booking);
        onDetailModalOpen();
    };

    const handleRefundDetailClick = (booking) => {
        setSelectedBooking(booking);
        onRefundDetailModalOpen();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dateString;
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return timeString;
    };

    if (loading) {
        return (
            <Box p={6} textAlign="center">
                <Text color="gray.500">Memuat data...</Text>
            </Box>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <Box p={6} textAlign="center">
                <Text color="gray.500">Tidak ada data riwayat peminjaman</Text>
            </Box>
        );
    }

    return (
        <>
            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        <Tr bg="rgba(33, 209, 121, 0.05)">
                            <Th color="#21D179" fontWeight="600" borderColor="rgba(215, 215, 215, 0.3)">Peminjam</Th>
                            <Th color="#21D179" fontWeight="600" borderColor="rgba(215, 215, 215, 0.3)">Gedung</Th>
                            <Th color="#21D179" fontWeight="600" borderColor="rgba(215, 215, 215, 0.3)">Kegiatan</Th>
                            <Th color="#21D179" fontWeight="600" borderColor="rgba(215, 215, 215, 0.3)">Tanggal</Th>
                            <Th color="#21D179" fontWeight="600" borderColor="rgba(215, 215, 215, 0.3)">Waktu</Th>
                            <Th color="#21D179" fontWeight="600" borderColor="rgba(215, 215, 215, 0.3)">Status</Th>
                            <Th color="#21D179" fontWeight="600" borderColor="rgba(215, 215, 215, 0.3)">Aksi</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bookings.map((booking) => (
                            <Tr key={booking.bookingId} _hover={{ bg: 'rgba(33, 209, 121, 0.02)' }}>
                                <Td borderColor="rgba(215, 215, 215, 0.3)">
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="medium" fontSize="sm" color="#2A2A2A">
                                            {booking.detail.borrower.fullName || 'N/A'}
                                        </Text>
                                    </VStack>
                                </Td>
                                <Td borderColor="rgba(215, 215, 215, 0.3)">
                                    <Text fontWeight="medium" fontSize="sm" color="#2A2A2A">
                                        {booking.detail.building.buildingName}
                                    </Text>
                                </Td>
                                <Td borderColor="rgba(215, 215, 215, 0.3)">
                                    <Text fontSize="sm" noOfLines={2} color="#2A2A2A">
                                        {booking.activityName}
                                    </Text>
                                </Td>
                                <Td borderColor="rgba(215, 215, 215, 0.3)">
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="sm" fontWeight="medium" color="#2A2A2A">
                                            {formatDate(booking.startDate)}
                                        </Text>
                                        {booking.endDate && booking.endDate !== booking.startDate && (
                                            <Text fontSize="xs" color="#2A2A2A" opacity={0.6}>
                                                s/d {formatDate(booking.endDate)}
                                            </Text>
                                        )}
                                    </VStack>
                                </Td>
                                <Td borderColor="rgba(215, 215, 215, 0.3)">
                                    <Text fontSize="sm" color="#2A2A2A">
                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                    </Text>
                                </Td>
                                <Td>
                                    <Badge
                                        bg={getStatusConfig(booking.status).bg}
                                        color={getStatusConfig(booking.status).color}
                                        borderRadius="20px"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="600"
                                        fontFamily="Inter, sans-serif"
                                    >
                                        {getStatusText(booking.status)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <HStack spacing={2}>
                                        <Tooltip label="Lihat Detail">
                                            <IconButton
                                                icon={<Eye size={16} />}
                                                size="sm"
                                                bg="rgba(33, 209, 121, 0.1)"
                                                color="#21D179"
                                                borderRadius="9999px"
                                                border="1px solid rgba(33, 209, 121, 0.3)"
                                                _hover={{
                                                    bg: "rgba(33, 209, 121, 0.2)",
                                                    transform: "translateY(-1px)",
                                                    boxShadow: "0 2px 8px rgba(33, 209, 121, 0.2)"
                                                }}
                                                _active={{
                                                    transform: "translateY(0)"
                                                }}
                                                transition="all 0.2s ease"
                                                onClick={() => handleDetailClick(booking)}
                                            />
                                        </Tooltip>

                                        <Tooltip label="Detail Refund">
                                            <IconButton
                                                icon={<DollarSign size={16} />}
                                                size="sm"
                                                bg="rgba(59, 130, 246, 0.1)"
                                                color="#3B82F6"
                                                borderRadius="9999px"
                                                border="1px solid rgba(59, 130, 246, 0.3)"
                                                _hover={{
                                                    bg: "rgba(59, 130, 246, 0.2)",
                                                    transform: "translateY(-1px)",
                                                    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)"
                                                }}
                                                _active={{
                                                    transform: "translateY(0)"
                                                }}
                                                transition="all 0.2s ease"
                                                onClick={() => handleRefundDetailClick(booking)}
                                            />
                                        </Tooltip>
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Detail Modal */}
            <BookingDetailModal
                isOpen={isDetailModalOpen}
                onClose={onDetailModalClose}
                booking={selectedBooking}
            />

            {/* Refund Detail Modal */}
            <RefundDetailModal
                isOpen={isRefundDetailModalOpen}
                onClose={onRefundDetailModalClose}
                bookingId={selectedBooking?.bookingId}
            />
        </>
    );
};

export default HistoryTable; 