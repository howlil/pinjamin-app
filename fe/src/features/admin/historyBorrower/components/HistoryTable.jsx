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
    const [refundReason, setRefundReason] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
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

    const handleRefundClick = (booking) => {
        setSelectedBooking(booking);
        setRefundReason('');
        onOpen();
    };

    const handleDetailClick = (booking) => {
        setSelectedBooking(booking);
        onDetailModalOpen();
    };

    const handleRefundDetailClick = (booking) => {
        setSelectedBooking(booking);
        onRefundDetailModalOpen();
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

                                        {booking.status === 'REJECTED' && (
                                            <Tooltip label="Proses Refund">
                                                <Button
                                                    leftIcon={<RefreshCw size={16} />}
                                                    size="sm"
                                                    bg="#F59E0B"
                                                    color="white"
                                                    borderRadius="9999px"
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight="600"
                                                    fontSize="xs"
                                                    _hover={{
                                                        bg: "#D97706",
                                                        transform: "translateY(-1px)",
                                                        boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)"
                                                    }}
                                                    _active={{
                                                        transform: "translateY(0)"
                                                    }}
                                                    transition="all 0.2s ease"
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
                    mx={4}
                >
                    <ModalHeader pb={2} pt={6}>
                        <Text
                            fontSize="xl"
                            fontWeight="700"
                            color="#2A2A2A"
                            fontFamily="Inter, sans-serif"
                        >
                            Proses Refund
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={4}>
                        <VStack spacing={5} align="stretch">
                            {/* Detail Peminjaman */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="#2A2A2A"
                                    mb={3}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Detail Peminjaman:
                                </Text>
                                <Box
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    borderRadius="24px"
                                    border="1px solid rgba(215, 215, 215, 0.3)"
                                    p={4}
                                >
                                    <VStack align="start" spacing={3}>
                                        <HStack spacing={3} w="full">
                                            <Text
                                                fontSize="sm"
                                                color="#2A2A2A"
                                                opacity={0.7}
                                                fontWeight="500"
                                                minW="80px"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                Peminjam:
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {selectedBooking?.detail?.borrower?.fullName || 'N/A'}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={3} w="full">
                                            <Text
                                                fontSize="sm"
                                                color="#2A2A2A"
                                                opacity={0.7}
                                                fontWeight="500"
                                                minW="80px"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                Gedung:
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {selectedBooking?.detail?.building?.buildingName || 'N/A'}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={3} w="full">
                                            <Text
                                                fontSize="sm"
                                                color="#2A2A2A"
                                                opacity={0.7}
                                                fontWeight="500"
                                                minW="80px"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                Kegiatan:
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {selectedBooking?.activityName}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={3} w="full">
                                            <Text
                                                fontSize="sm"
                                                color="#2A2A2A"
                                                opacity={0.7}
                                                fontWeight="500"
                                                minW="80px"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                Tanggal:
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {formatDate(selectedBooking?.startDate)}
                                                {selectedBooking?.endDate && selectedBooking?.endDate !== selectedBooking?.startDate &&
                                                    ` - ${formatDate(selectedBooking?.endDate)}`
                                                }
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Box>
                            </Box>

                            {/* Alasan Refund */}
                            <Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="#2A2A2A"
                                    mb={3}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Alasan Refund: <Text as="span" color="#EF4444">*</Text>
                                </Text>
                                <Textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    placeholder="Masukkan alasan refund..."
                                    rows={4}
                                    resize="vertical"
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="24px"
                                    fontFamily="Inter, sans-serif"
                                    fontSize="sm"
                                    p={4}
                                    _placeholder={{
                                        color: "#999",
                                        opacity: 0.8
                                    }}
                                    _focus={{
                                        borderColor: "#21D179",
                                        boxShadow: "0 0 0 1px #21D179",
                                        bg: "rgba(255, 255, 255, 0.95)"
                                    }}
                                    _hover={{
                                        borderColor: "rgba(33, 209, 121, 0.6)"
                                    }}
                                />
                                {!refundReason.trim() && (
                                    <Text
                                        fontSize="xs"
                                        color="#EF4444"
                                        mt={2}
                                        fontFamily="Inter, sans-serif"
                                    >
                                        Alasan refund wajib diisi
                                    </Text>
                                )}
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter
                        justifyContent="space-between"
                        gap={3}
                        pt={2}
                        pb={6}
                    >
                        <Button
                            onClick={onClose}
                            isDisabled={refundLoading}
                            bg="rgba(215, 215, 215, 0.5)"
                            backdropFilter="blur(10px)"
                            color="#2A2A2A"
                            borderRadius="9999px"
                            fontFamily="Inter, sans-serif"
                            fontWeight="600"
                            w="48%"
                            h="48px"
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            _hover={{
                                bg: "rgba(215, 215, 215, 0.8)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all 0.2s ease"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleRefund}
                            isLoading={refundLoading}
                            loadingText="Memproses..."
                            bg="#F59E0B"
                            color="white"
                            borderRadius="9999px"
                            fontFamily="Inter, sans-serif"
                            fontWeight="600"
                            w="48%"
                            h="48px"
                            isDisabled={!refundReason.trim()}
                            _hover={{
                                bg: "#D97706",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            _disabled={{
                                bg: "#D1D5DB",
                                color: "#9CA3AF",
                                cursor: "not-allowed",
                                transform: "none",
                                boxShadow: "none"
                            }}
                            transition="all 0.2s ease"
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