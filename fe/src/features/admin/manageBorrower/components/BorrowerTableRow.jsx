import React from 'react';
import {
    Tr,
    Td,
    Text,
    Badge,
    VStack,
    HStack,
    Button,
    Tooltip,
    IconButton
} from '@chakra-ui/react';
import { Check, X, Eye, DollarSign } from 'lucide-react';

const BorrowerTableRow = ({ booking, onApprove, onReject, onRefund, onViewDetail }) => {
    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PROCESSING':
                return { bg: '#FF8C00', color: 'white' };
            case 'APPROVED':
                return { bg: '#21D179', color: 'white' };
            case 'REJECTED':
                return { bg: '#EF4444', color: 'white' };
            case 'COMPLETED':
                return { bg: '#9CA3AF', color: 'white' };
            default:
                return { bg: '#9CA3AF', color: 'white' };
        }
    };

    const getStatusText = (status) => {
        switch (status?.toUpperCase()) {
            case 'PROCESSING':
                return 'Diproses';
            case 'APPROVED':
                return 'Disetujui';
            case 'REJECTED':
                return 'Ditolak';
            case 'COMPLETED':
                return 'Selesai';
            default:
                return status || 'Unknown';
        }
    };

    const formatDateRange = (startDate, endDate) => {
        if (!endDate || startDate === endDate) {
            return startDate || '-';
        }
        return `${startDate} - ${endDate}`;
    };

    const formatTimeRange = (startTime, endTime) => {
        if (!startTime || !endTime) return '-';
        return `${startTime} - ${endTime}`;
    };

    const handleApprove = () => {
        onApprove(booking);
    };

    const handleReject = () => {
        onReject(booking);
    };

    const handleRefund = () => {
        onRefund(booking);
    };

    const statusConfig = getStatusColor(booking.status);
    const isProcessing = booking.status?.toUpperCase() === 'PROCESSING';
    const isRejected = booking.status?.toUpperCase() === 'REJECTED';

    return (
        <Tr _hover={{ bg: 'rgba(33, 209, 121, 0.02)' }} transition="all 0.2s ease">
            {/* Peminjam */}
            <Td py={4} borderColor="rgba(215, 215, 215, 0.2)">
                <Text
                    fontSize="sm"
                    color="#2A2A2A"
                    fontWeight="600"
                    noOfLines={1}
                >
                    {booking.detail?.borrower?.fullName || booking.borrowerName || 'N/A'}
                </Text>
            </Td>

            {/* Gedung */}
            <Td py={4} borderColor="rgba(215, 215, 215, 0.2)">
                <Text
                    fontSize="sm"
                    color="#2A2A2A"
                    fontWeight="600"
                    noOfLines={1}
                >
                    {booking.detail?.building?.buildingName || booking.buildingName || 'N/A'}
                </Text>
            </Td>

            {/* Kegiatan */}
            <Td py={4} borderColor="rgba(215, 215, 215, 0.2)">
                <Text
                    fontSize="sm"
                    color="#2A2A2A"
                    noOfLines={2}
                    maxW="200px"
                >
                    {booking.activityName || 'N/A'}
                </Text>
            </Td>

            {/* Tanggal & Waktu */}
            <Td py={4} borderColor="rgba(215, 215, 215, 0.2)">
                <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="#2A2A2A" fontWeight="500">
                        {formatDateRange(booking.startDate, booking.endDate)}
                    </Text>
                    <Text fontSize="xs" color="#666" opacity={0.8}>
                        {formatTimeRange(booking.startTime, booking.endTime)}
                    </Text>
                </VStack>
            </Td>

            {/* Status */}
            <Td py={4} borderColor="rgba(215, 215, 215, 0.2)" textAlign="center">
                <Badge
                    bg={statusConfig.bg}
                    color={statusConfig.color}
                    borderRadius="20px"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="600"
                >
                    {getStatusText(booking.status)}
                </Badge>
            </Td>

            {/* Aksi */}
            <Td py={4} borderColor="rgba(215, 215, 215, 0.2)" textAlign="center">
                <HStack spacing={2} justify="center">
                    {/* View Detail */}
                    <Tooltip label="Lihat Detail">
                        <IconButton
                            icon={<Eye size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => onViewDetail && onViewDetail(booking)}
                        />
                    </Tooltip>

                    {/* Processing Actions */}
                    {isProcessing && (
                        <>
                            <Tooltip label="Setujui">
                                <IconButton
                                    icon={<Check size={16} />}
                                    size="sm"
                                    colorScheme="green"
                                    variant="solid"
                                    onClick={handleApprove}
                                />
                            </Tooltip>
                            <Tooltip label="Tolak">
                                <IconButton
                                    icon={<X size={16} />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="solid"
                                    onClick={handleReject}
                                />
                            </Tooltip>
                        </>
                    )}

                    {/* Refund Action for Rejected */}
                    {isRejected && (
                        <Tooltip label="Proses Refund">
                            <Button
                                leftIcon={<DollarSign size={14} />}
                                size="sm"
                                colorScheme="orange"
                                variant="outline"
                                onClick={handleRefund}
                                fontSize="xs"
                            >
                                Refund
                            </Button>
                        </Tooltip>
                    )}
                </HStack>
            </Td>
        </Tr>
    );
};

export default BorrowerTableRow; 