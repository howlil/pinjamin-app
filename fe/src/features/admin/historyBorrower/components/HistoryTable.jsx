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
import { RefreshCw, Eye } from 'lucide-react';
import { useBookingRefund } from '../api/useAdminBookings';
import BookingDetailModal from '@shared/components/BookingDetailModal';

const HistoryTable = ({ bookings, loading, onRefresh }) => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [refundReason, setRefundReason] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDetailModalOpen,
        onOpen: onDetailModalOpen,
        onClose: onDetailModalClose
    } = useDisclosure();
    const { processRefund, loading: refundLoading } = useBookingRefund();
    const toast = useToast();

    // Debug log untuk melihat data yang diterima
    console.log('HistoryTable received bookings:', bookings);
    console.log('HistoryTable loading state:', loading);

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'green';
            case 'REJECTED':
                return 'red';
            case 'COMPLETED':
                return 'blue';
            default:
                return 'gray';
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

    const handleRefundClick = (booking) => {
        setSelectedBooking(booking);
        setRefundReason('');
        onOpen();
    };

    const handleDetailClick = (booking) => {
        setSelectedBooking(booking);
        onDetailModalOpen();
    };

    const handleRefund = async () => {
        if (!refundReason.trim()) {
            toast({
                title: 'Error',
                description: 'Alasan refund harus diisi',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        try {
            await processRefund(selectedBooking.bookingId, {
                refundReason: refundReason.trim()
            });
            onClose();
            onRefresh();
        } catch (error) {
            // Error handling is done in the hook
        }
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
                                        colorScheme={getStatusColor(booking.status)}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
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
                                                variant="ghost"
                                                colorScheme="blue"
                                                onClick={() => handleDetailClick(booking)}
                                            />
                                        </Tooltip>

                                        {booking.status === 'REJECTED' && (
                                            <Tooltip label="Proses Refund">
                                                <Button
                                                    leftIcon={<RefreshCw size={16} />}
                                                    size="sm"
                                                    colorScheme="orange"
                                                    variant="outline"
                                                    onClick={() => handleRefundClick(booking)}
                                                >
                                                    Refund
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Refund Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Proses Refund</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text fontWeight="medium" mb={2}>
                                    Detail Peminjaman:
                                </Text>
                                <VStack align="start" spacing={1} p={3} bg="gray.50" borderRadius="md">
                                    <Text fontSize="sm">
                                        <strong>Peminjam:</strong> {selectedBooking?.borrowerName}
                                    </Text>
                                    <Text fontSize="sm">
                                        <strong>Gedung:</strong> {selectedBooking?.buildingName}
                                    </Text>
                                    <Text fontSize="sm">
                                        <strong>Kegiatan:</strong> {selectedBooking?.activityName}
                                    </Text>
                                    <Text fontSize="sm">
                                        <strong>Tanggal:</strong> {formatDate(selectedBooking?.startDate)}
                                        {selectedBooking?.endDate && selectedBooking?.endDate !== selectedBooking?.startDate &&
                                            ` - ${formatDate(selectedBooking?.endDate)}`
                                        }
                                    </Text>
                                </VStack>
                            </Box>

                            <Box>
                                <Text fontWeight="medium" mb={2}>
                                    Alasan Refund: <Text as="span" color="red.500">*</Text>
                                </Text>
                                <Textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    placeholder="Masukkan alasan refund..."
                                    rows={4}
                                    resize="vertical"
                                />
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            onClick={onClose}
                            isDisabled={refundLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            colorScheme="orange"
                            onClick={handleRefund}
                            isLoading={refundLoading}
                            loadingText="Memproses..."
                        >
                            Proses Refund
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Detail Modal */}
            <BookingDetailModal
                isOpen={isDetailModalOpen}
                onClose={onDetailModalClose}
                booking={selectedBooking}
            />
        </>
    );
};

export default HistoryTable; 