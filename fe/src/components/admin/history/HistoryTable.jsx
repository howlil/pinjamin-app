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
    Avatar,
    VStack,
    HStack,
    Icon,
    Button,
    Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Building,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    RefreshCw
} from 'lucide-react';
import { COLORS } from '@/utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const HistoryTable = ({
    historyItems = [],
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onRefund
}) => {
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (timeString) => {
        return timeString ? timeString.slice(0, 5) : '-';
    };

    // Get status badge props
    const getStatusProps = (status) => {
        const statusMap = {
            'PROCESSING': {
                color: 'orange',
                icon: RefreshCw,
                label: 'Diproses'
            },
            'APPROVED': {
                color: 'green',
                icon: CheckCircle,
                label: 'Disetujui'
            },
            'COMPLETED': {
                color: 'blue',
                icon: CheckCircle,
                label: 'Selesai'
            },
            'CANCELLED': {
                color: 'gray',
                icon: XCircle,
                label: 'Dibatalkan'
            },
            'REJECTED': {
                color: 'red',
                icon: XCircle,
                label: 'Ditolak'
            }
        };
        return statusMap[status] || {
            color: 'gray',
            icon: AlertCircle,
            label: status
        };
    };

    // Check if booking is eligible for refund
    const isRefundEligible = (status) => {
        return status === 'REJECTED' || status === 'CANCELLED';
    };

    // Calculate duration
    const calculateDuration = (startDate, endDate, startTime, endTime) => {
        if (!startDate || !endDate || !startTime || !endTime) return '-';

        const start = new Date(`${startDate} ${startTime}`);
        const end = new Date(`${endDate} ${endTime}`);
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return `${diffHours}j ${diffMinutes}m`;
        }
        return `${diffMinutes}m`;
    };

    return (
        <Box>
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Peminjam
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Ruangan & Kegiatan
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Waktu Peminjaman
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Durasi
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Status
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {historyItems.map((item, index) => {
                            const statusProps = getStatusProps(item.status);
                            const duration = calculateDuration(
                                item.startDate,
                                item.endDate,
                                item.startTime,
                                item.endTime
                            );

                            return (
                                <motion.tr
                                    key={item.bookingId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <HStack spacing={3}>
                                            <Avatar
                                                size="sm"
                                                name={item.borrowerName}
                                                bg={COLORS.primary}
                                                color="white"
                                                fontSize="xs"
                                            />
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                                    {item.borrowerName || 'N/A'}
                                                </Text>
                                                <Text fontSize="xs" color={COLORS.gray[500]}>
                                                    ID: {item.bookingId?.slice(0, 8)}...
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <HStack spacing={1}>
                                                <Building size={14} color={COLORS.primary} />
                                                <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                                    {item.buildingName}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="xs" color={COLORS.gray[600]} noOfLines={2}>
                                                {item.activityName}
                                            </Text>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <HStack spacing={1}>
                                                <Calendar size={14} color={COLORS.gray[500]} />
                                                <Text fontSize="sm" color={COLORS.black}>
                                                    {item.startDate || 'N/A'}
                                                    {item.endDate && item.endDate !== item.startDate &&
                                                        ` - ${item.endDate}`
                                                    }
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Clock size={14} color={COLORS.gray[500]} />
                                                <Text fontSize="xs" color={COLORS.gray[600]}>
                                                    {item.startTime || 'N/A'} - {item.endTime || 'N/A'}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                            {duration}
                                        </Text>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <HStack spacing={2}>
                                            <Icon
                                                as={statusProps.icon}
                                                size={16}
                                                color={statusProps.color === 'green' ? 'green.500' :
                                                    statusProps.color === 'red' ? 'red.500' :
                                                        statusProps.color === 'blue' ? 'blue.500' :
                                                            statusProps.color === 'orange' ? 'orange.500' :
                                                                'gray.500'}
                                            />
                                            <Badge
                                                colorScheme={statusProps.color}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                                fontSize="xs"
                                                fontWeight="medium"
                                            >
                                                {statusProps.label}
                                            </Badge>
                                        </HStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        {isRefundEligible(item.status) && onRefund ? (
                                            <Tooltip label="Proses refund untuk peminjaman yang ditolak/dibatalkan">
                                                <Button
                                                    size="sm"
                                                    colorScheme="orange"
                                                    variant="outline"
                                                    leftIcon={<DollarSign size={14} />}
                                                    onClick={() => onRefund(item)}
                                                    borderRadius="full"
                                                >
                                                    Refund
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <Text fontSize="sm" color="gray.500">
                                                -
                                            </Text>
                                        )}
                                    </Td>
                                </motion.tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>

            {/* Pagination */}
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={onPageChange}
                showItemsPerPage={true}
            />
        </Box>
    );
};

export default HistoryTable; 