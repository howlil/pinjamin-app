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
    Tooltip,
    useBreakpointValue
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
    RefreshCw,
    Timer,
    Activity
} from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const HistoryTable = ({
    historyItems = [],
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onRefund
}) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get status badge config
    const getStatusConfig = (status) => {
        const statusMap = {
            'PROCESSING': {
                bg: 'rgba(251, 146, 60, 0.15)',
                color: '#fb923c',
                border: '1px solid rgba(251, 146, 60, 0.2)',
                icon: RefreshCw,
                label: 'Diproses'
            },
            'APPROVED': {
                bg: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                icon: CheckCircle,
                label: 'Disetujui'
            },
            'COMPLETED': {
                bg: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                icon: CheckCircle,
                label: 'Selesai'
            },
            'CANCELLED': {
                bg: 'rgba(156, 163, 175, 0.15)',
                color: '#6b7280',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                icon: XCircle,
                label: 'Dibatalkan'
            },
            'REJECTED': {
                bg: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                icon: XCircle,
                label: 'Ditolak'
            }
        };
        return statusMap[status] || {
            bg: 'rgba(156, 163, 175, 0.15)',
            color: '#6b7280',
            border: '1px solid rgba(156, 163, 175, 0.2)',
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
        <VStack spacing={6} align="stretch">
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Box
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    p={padding}
                    _hover={{
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
                    }}
                    transition="all 0.3s ease"
                >
                    <Box
                        overflowX="auto"
                        css={{
                            '&::-webkit-scrollbar': {
                                height: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(116, 156, 115, 0.3)',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: 'rgba(116, 156, 115, 0.5)',
                            },
                        }}
                    >
                        <Table variant="unstyled" size="md">
                            <Thead>
                                <Tr>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <User size={12} />
                                            <Text>Peminjam</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <Activity size={12} />
                                            <Text>Ruangan</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <Clock size={12} />
                                            <Text>Waktu</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <Timer size={12} />
                                            <Text>Durasi</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        Status
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        Aksi
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {historyItems.map((item, index) => {
                                    const statusConfig = getStatusConfig(item.status);
                                    const duration = calculateDuration(
                                        item.startDate,
                                        item.endDate,
                                        item.startTime,
                                        item.endTime
                                    );

                                    return (
                                        <MotionTr
                                            key={item.bookingId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                            whileHover={{
                                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                scale: 1.005
                                            }}
                                            borderRadius="12px"
                                        >
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <HStack spacing={3}>
                                                    <Avatar
                                                        size="sm"
                                                        name={item.borrowerName}
                                                        bg="rgba(116, 156, 115, 0.2)"
                                                        color={COLORS.primary}
                                                        fontSize="xs"
                                                        fontWeight="bold"
                                                    />
                                                    <VStack align="start" spacing={0}>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="bold"
                                                            color="#444444"
                                                        >
                                                            {item.borrowerName || 'N/A'}
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="#666666"
                                                            fontWeight="medium"
                                                        >
                                                            ID: {item.bookingId?.slice(0, 8)}...
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <VStack align="start" spacing={1}>
                                                    <HStack spacing={2}>
                                                        <Box
                                                            w={5}
                                                            h={5}
                                                            borderRadius="4px"
                                                            bg="rgba(116, 156, 115, 0.15)"
                                                            border="1px solid rgba(116, 156, 115, 0.2)"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Building size={10} color={COLORS.primary} />
                                                        </Box>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="bold"
                                                            color="#444444"
                                                        >
                                                            {item.buildingName}
                                                        </Text>
                                                    </HStack>
                                                    <Text
                                                        fontSize="xs"
                                                        color="#666666"
                                                        noOfLines={2}
                                                        fontWeight="medium"
                                                    >
                                                        {item.activityName}
                                                    </Text>
                                                </VStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <VStack align="start" spacing={2}>
                                                    <HStack spacing={2}>
                                                        <Box
                                                            w={5}
                                                            h={5}
                                                            borderRadius="4px"
                                                            bg="rgba(116, 156, 115, 0.15)"
                                                            border="1px solid rgba(116, 156, 115, 0.2)"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Calendar size={10} color={COLORS.primary} />
                                                        </Box>
                                                        <Text
                                                            fontSize="xs"
                                                            color="#444444"
                                                            fontWeight="medium"
                                                        >
                                                            {item.startDate || 'N/A'}
                                                            {item.endDate && item.endDate !== item.startDate &&
                                                                ` - ${item.endDate}`
                                                            }
                                                        </Text>
                                                    </HStack>
                                                    <HStack spacing={2}>
                                                        <Box
                                                            w={5}
                                                            h={5}
                                                            borderRadius="4px"
                                                            bg="rgba(116, 156, 115, 0.15)"
                                                            border="1px solid rgba(116, 156, 115, 0.2)"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Clock size={10} color={COLORS.primary} />
                                                        </Box>
                                                        <Text
                                                            fontSize="xs"
                                                            color="#666666"
                                                            fontWeight="medium"
                                                        >
                                                            {item.startTime || 'N/A'} - {item.endTime || 'N/A'}
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color="#444444"
                                                >
                                                    {duration}
                                                </Text>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Badge
                                                    bg={statusConfig.bg}
                                                    color={statusConfig.color}
                                                    border={statusConfig.border}
                                                    borderRadius="8px"
                                                    px={3}
                                                    py={1}
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                >
                                                    <HStack spacing={1}>
                                                        <Icon as={statusConfig.icon} boxSize={2.5} />
                                                        <Text>{statusConfig.label}</Text>
                                                    </HStack>
                                                </Badge>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                {isRefundEligible(item.status) && onRefund ? (
                                                    <Tooltip label="Proses refund untuk peminjaman yang ditolak/dibatalkan">
                                                        <Button
                                                            size="sm"
                                                            leftIcon={<DollarSign size={14} />}
                                                            bg="rgba(251, 146, 60, 0.1)"
                                                            color="#fb923c"
                                                            border="1px solid rgba(251, 146, 60, 0.2)"
                                                            borderRadius="8px"
                                                            fontSize="xs"
                                                            fontWeight="bold"
                                                            _hover={{
                                                                bg: "rgba(251, 146, 60, 0.2)",
                                                                borderColor: "rgba(251, 146, 60, 0.4)",
                                                                transform: "translateY(-1px)"
                                                            }}
                                                            transition="all 0.2s ease"
                                                            onClick={() => onRefund(item)}
                                                        >
                                                            Refund
                                                        </Button>
                                                    </Tooltip>
                                                ) : (
                                                    <Text
                                                        fontSize="sm"
                                                        color="#999999"
                                                        fontWeight="medium"
                                                    >
                                                        -
                                                    </Text>
                                                )}
                                            </Td>
                                        </MotionTr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </Box>

                    {historyItems.length === 0 && (
                        <Box
                            textAlign="center"
                            py={12}
                            color="#666666"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                Belum ada riwayat peminjaman
                            </Text>
                        </Box>
                    )}
                </Box>
            </MotionBox>

            {/* Pagination */}
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={onPageChange}
            />
        </VStack>
    );
};

export default HistoryTable; 