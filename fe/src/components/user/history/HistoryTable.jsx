import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Badge,
    VStack,
    HStack,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Eye, Calendar, Clock, MapPin, User, RefreshCw } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import { AdminPagination } from '@/components/admin/common';

const BookingHistoryTable = ({
    bookings = [],
    loading = false,
    error = null,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange,
    onRefresh,
    getStatusBadge,
    getStatusText
}) => {
    // Format date from DD-MM-YYYY to readable format
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const [day, month, year] = dateString.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (err) {
            return dateString;
        }
    };

    // Format time from HH:MM to readable format
    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return `${timeString} WIB`;
    };

    // Loading state
    if (loading) {
        return (
            <Box
                bg="white"
                rounded="20px"
                shadow={SHADOWS.soft}
                p={8}
                textAlign="center"
            >
                <VStack spacing={4}>
                    <Spinner size="xl" color={COLORS.primary} />
                    <Text color={COLORS.black}>Memuat riwayat peminjaman...</Text>
                </VStack>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box
                bg="white"
                rounded="20px"
                shadow={SHADOWS.soft}
                p={6}
            >
                <Alert status="error" rounded="lg">
                    <AlertIcon />
                    <VStack align="start" spacing={2}>
                        <Text fontWeight="semibold">Gagal memuat data</Text>
                        <Text fontSize="sm">{error}</Text>
                        <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={onRefresh}
                        >
                            Coba Lagi
                        </Button>
                    </VStack>
                </Alert>
            </Box>
        );
    }

    // Empty state
    if (!bookings || bookings.length === 0) {
        return (
            <Box
                bg="white"
                rounded="20px"
                shadow={SHADOWS.soft}
                p={8}
                textAlign="center"
            >
                <VStack spacing={4}>
                    <Box
                        w={16}
                        h={16}
                        bg={`${COLORS.primary}20`}
                        rounded="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Calendar size={32} color={COLORS.primary} />
                    </Box>
                    <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="semibold" color={COLORS.black}>
                            Belum ada riwayat peminjaman
                        </Text>
                        <Text color={COLORS.gray[500]} fontSize="sm">
                            Riwayat peminjaman Anda akan muncul di sini
                        </Text>
                    </VStack>
                </VStack>
            </Box>
        );
    }

    return (
        <Box
            bg="white"
            rounded="20px"
            shadow={SHADOWS.soft}
            overflow="hidden"
        >
            {/* Header */}
            <Box p={6} borderBottom="1px" borderColor={`${COLORS.primary}20`}>
                <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" color={COLORS.black}>
                            Riwayat Peminjaman
                        </Text>
                        <Text fontSize="sm" color={COLORS.gray[500]}>
                            Total {totalItems} peminjaman
                        </Text>
                    </VStack>
                    <Tooltip label="Refresh data">
                        <IconButton
                            icon={<RefreshCw size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="green"
                            onClick={onRefresh}
                        />
                    </Tooltip>
                </HStack>
            </Box>

            {/* Table */}
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead bg={`${COLORS.primary}10`}>
                        <Tr>
                            <Th color={COLORS.black} fontWeight="bold" fontSize="xs">
                                No
                            </Th>
                            <Th color={COLORS.black} fontWeight="bold" fontSize="xs">
                                Gedung
                            </Th>
                            <Th color={COLORS.black} fontWeight="bold" fontSize="xs">
                                Kegiatan
                            </Th>
                            <Th color={COLORS.black} fontWeight="bold" fontSize="xs">
                                Tanggal
                            </Th>
                            <Th color={COLORS.black} fontWeight="bold" fontSize="xs">
                                Waktu
                            </Th>
                            <Th color={COLORS.black} fontWeight="bold" fontSize="xs">
                                Status
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bookings.map((booking, index) => (
                            <motion.tr
                                key={booking.bookingId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Text fontSize="sm" color={COLORS.black}>
                                        {(currentPage - 1) * 10 + index + 1}
                                    </Text>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                            {booking.buildingName || 'N/A'}
                                        </Text>
                                        <HStack spacing={1}>
                                            <MapPin size={12} color={COLORS.gray[400]} />
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                ID: {booking.bookingId?.slice(-8) || 'N/A'}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="sm" color={COLORS.black}>
                                            {booking.activityName || 'N/A'}
                                        </Text>
                                    </VStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <VStack align="start" spacing={1}>
                                        <HStack spacing={1}>
                                            <Calendar size={12} color={COLORS.gray[400]} />
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                Mulai: {formatDate(booking.startDate)}
                                            </Text>
                                        </HStack>
                                        {booking.endDate && booking.endDate !== booking.startDate && (
                                            <HStack spacing={1}>
                                                <Calendar size={12} color={COLORS.gray[400]} />
                                                <Text fontSize="xs" color={COLORS.gray[500]}>
                                                    Selesai: {formatDate(booking.endDate)}
                                                </Text>
                                            </HStack>
                                        )}
                                    </VStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <VStack align="start" spacing={1}>
                                        <HStack spacing={1}>
                                            <Clock size={12} color={COLORS.gray[400]} />
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Badge
                                        colorScheme={getStatusBadge(booking.status)}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        {getStatusText(booking.status)}
                                    </Badge>
                                </Td>
                            </motion.tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box p={6} borderTop="1px" borderColor={`${COLORS.primary}20`}>
                    <AdminPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onPageChange={onPageChange}
                    />
                </Box>
            )}
        </Box>
    );
};

export default BookingHistoryTable; 