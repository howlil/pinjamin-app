import React, { useState } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
    VStack,
    HStack,
    IconButton,
    Tooltip,
    useDisclosure
} from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import BookingDetailModal from '@shared/components/BookingDetailModal';

const HistoryTable = ({ bookings }) => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const {
        isOpen: isDetailModalOpen,
        onOpen: onDetailModalOpen,
        onClose: onDetailModalClose
    } = useDisclosure();

    const handleDetailClick = (booking) => {
        setSelectedBooking(booking);
        onDetailModalOpen();
    };

    const getStatusConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
                return {
                    label: 'Disetujui',
                    bgColor: '#21D179',
                    textColor: 'white'
                };
            case 'PROCESSING':
                return {
                    label: 'Diproses',
                    bgColor: '#FF8C00',
                    textColor: 'white'
                };
            case 'REJECTED':
                return {
                    label: 'Ditolak',
                    bgColor: '#EF4444',
                    textColor: 'white'
                };
            case 'COMPLETED':
                return {
                    label: 'Selesai',
                    bgColor: '#9CA3AF',
                    textColor: 'white'
                };
            default:
                return {
                    label: status || 'Unknown',
                    bgColor: '#9CA3AF',
                    textColor: 'white'
                };
        }
    };

    const formatBookingId = (id) => {
        return id ? `${id.slice(0, 8)}...` : '-';
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

    if (!bookings || bookings.length === 0) {
        return (
            <Box
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                p={8}
                textAlign="center"
            >
                <Text color="#2A2A2A" opacity={0.7}>
                    Tidak ada data riwayat peminjaman
                </Text>
            </Box>
        );
    }

    return (
        <Box
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(15px)"
            borderRadius="24px"
            border="1px solid rgba(215, 215, 215, 0.5)"
            overflow="hidden"
        >
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr bg="rgba(33, 209, 121, 0.05)">
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                            >
                                No
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                            >
                                Nama Kegiatan
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                            >
                                Gedung
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                            >
                                Tanggal
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                            >
                                Waktu
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                textAlign="center"
                            >
                                Status
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                textAlign="center"
                            >
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bookings.map((booking, index) => {
                            const statusConfig = getStatusConfig(booking.status);

                            return (
                                <Tr
                                    key={booking.bookingId || index}
                                    _hover={{
                                        bg: "rgba(33, 209, 121, 0.02)"
                                    }}
                                    transition="all 0.2s ease"
                                >
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="#2A2A2A"
                                            fontFamily="monospace"
                                            fontWeight="600"
                                        >
                                            {index + 1}
                                        </Text>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="#2A2A2A"
                                            fontWeight="600"
                                            noOfLines={2}
                                        >
                                            {booking.activityName || '-'}
                                        </Text>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="#2A2A2A"
                                            fontWeight="600"
                                            noOfLines={1}
                                        >
                                            {booking.buildingName || '-'}
                                        </Text>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                    >
                                        <Text fontSize="sm" color="#2A2A2A">
                                            {formatDateRange(booking.startDate, booking.endDate)}
                                        </Text>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                    >
                                        <Text fontSize="sm" color="#2A2A2A">
                                            {formatTimeRange(booking.startTime, booking.endTime)}
                                        </Text>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                        textAlign="center"
                                    >
                                        <Badge
                                            bg={statusConfig.bgColor}
                                            color={statusConfig.textColor}
                                            borderRadius="20px"
                                            px={3}
                                            py={1}
                                            fontSize="xs"
                                            fontWeight="600"
                                        >
                                            {statusConfig.label}
                                        </Badge>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                        textAlign="center"
                                    >
                                        <Tooltip label="Lihat Detail">
                                            <IconButton
                                                icon={<Eye size={16} />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                                onClick={() => handleDetailClick(booking)}
                                            />
                                        </Tooltip>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>

            {/* Detail Modal */}
            <BookingDetailModal
                isOpen={isDetailModalOpen}
                onClose={onDetailModalClose}
                booking={selectedBooking}
            />
        </Box>
    );
};

export default HistoryTable; 