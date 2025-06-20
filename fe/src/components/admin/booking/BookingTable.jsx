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
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    Eye,
    Check,
    X,
    Calendar,
    Clock
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const BookingTable = ({
    bookings = [],
    onView,
    onApprove,
    onReject,
    onComplete,
    onCancel,
    currentPage,
    totalPages,
    totalItems,
    onPageChange
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

    // Get status badge color
    const getStatusColor = (status) => {
        const colors = {
            'PROCESSING': 'orange',
            'APPROVED': 'green',
            'REJECTED': 'red',
            'COMPLETED': 'blue',
            'CANCELLED': 'gray'
        };
        return colors[status] || 'gray';
    };

    // Get status label
    const getStatusLabel = (status) => {
        const labels = {
            'PROCESSING': 'Menunggu',
            'APPROVED': 'Disetujui',
            'REJECTED': 'Ditolak',
            'COMPLETED': 'Selesai',
            'CANCELLED': 'Dibatalkan'
        };
        return labels[status] || status;
    };

    // Get available actions based on booking status
    const getAvailableActions = (booking) => {
        const actions = [];

        actions.push({
            label: 'Lihat Detail',
            icon: Eye,
            onClick: () => onView(booking),
            color: 'blue'
        });

        switch (booking.status) {
            case 'PROCESSING':
                actions.push(
                    {
                        label: 'Setujui',
                        icon: Check,
                        onClick: () => onApprove(booking),
                        color: 'green'
                    },
                    {
                        label: 'Tolak',
                        icon: X,
                        onClick: () => onReject(booking),
                        color: 'red'
                    }
                );
                break;
            case 'APPROVED':
                actions.push(
                    {
                        label: 'Selesaikan',
                        icon: Check,
                        onClick: () => onComplete(booking),
                        color: 'blue'
                    },
                    {
                        label: 'Batalkan',
                        icon: X,
                        onClick: () => onCancel(booking),
                        color: 'red'
                    }
                );
                break;
            default:
                break;
        }

        return actions;
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
                                Ruangan
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Kegiatan
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Waktu
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
                        {bookings.map((booking, index) => {
                            const actions = getAvailableActions(booking);
                            return (
                                <motion.tr
                                    key={booking.bookingId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <HStack spacing={3}>
                                            <Avatar
                                                size="sm"
                                                name={booking.borrowerName}
                                                bg={COLORS.primary}
                                                color="white"
                                                fontSize="xs"
                                            />
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                                    {booking.borrowerName || 'N/A'}
                                                </Text>
                                                <Text fontSize="xs" color={COLORS.gray[500]}>
                                                    ID: {booking.bookingId?.slice(0, 8)}...
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                                {booking.buildingName || 'N/A'}
                                            </Text>
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                Peminjaman Ruangan
                                            </Text>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                {booking.activityName || 'N/A'}
                                            </Text>
                                            <Text fontSize="xs" color={COLORS.gray[500]} noOfLines={2}>
                                                Kegiatan peminjaman ruangan
                                            </Text>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <HStack spacing={1}>
                                                <Calendar size={14} color={COLORS.gray[500]} />
                                                <Text fontSize="sm" color={COLORS.black}>
                                                    {booking.startDate || 'N/A'}
                                                    {booking.endDate && booking.endDate !== booking.startDate &&
                                                        ` - ${booking.endDate}`
                                                    }
                                                </Text>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Clock size={14} color={COLORS.gray[500]} />
                                                <Text fontSize="sm" color={COLORS.gray[600]}>
                                                    {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Badge
                                            colorScheme={getStatusColor(booking.status)}
                                            borderRadius="full"
                                            px={3}
                                            py={1}
                                            fontSize="xs"
                                            fontWeight="medium"
                                        >
                                            {getStatusLabel(booking.status)}
                                        </Badge>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<MoreVertical size={16} />}
                                                variant="ghost"
                                                size="sm"
                                                borderRadius="full"
                                                _hover={{ bg: `${COLORS.primary}10` }}
                                            />
                                            <MenuList
                                                bg="white"
                                                borderColor={`${COLORS.primary}20`}
                                                boxShadow={SHADOWS.lg}
                                                borderRadius="xl"
                                                overflow="hidden"
                                            >
                                                {actions.map((action, actionIndex) => (
                                                    <MenuItem
                                                        key={actionIndex}
                                                        icon={<action.icon size={16} />}
                                                        onClick={action.onClick}
                                                        _hover={{
                                                            bg: action.color === 'red' ? 'red.50' : `${COLORS.primary}10`
                                                        }}
                                                        color={action.color === 'red' ? 'red.500' : 'inherit'}
                                                    >
                                                        {action.label}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
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
            />
        </Box>
    );
};

export default BookingTable; 