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
    MenuItem,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    Eye,
    Check,
    X,
    Calendar,
    Clock,
    User,
    Building2,
    Activity
} from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

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
        const configs = {
            'PROCESSING': {
                bg: 'rgba(251, 146, 60, 0.15)',
                color: '#fb923c',
                border: '1px solid rgba(251, 146, 60, 0.2)',
                label: 'Menunggu'
            },
            'APPROVED': {
                bg: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                label: 'Disetujui'
            },
            'REJECTED': {
                bg: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                label: 'Ditolak'
            },
            'COMPLETED': {
                bg: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                label: 'Selesai'
            },
            'CANCELLED': {
                bg: 'rgba(156, 163, 175, 0.15)',
                color: '#6b7280',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                label: 'Dibatalkan'
            }
        };
        return configs[status] || configs['PROCESSING'];
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
                                            <Building2 size={12} />
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
                                            <Activity size={12} />
                                            <Text>Kegiatan</Text>
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
                                {bookings.map((booking, index) => {
                                    const actions = getAvailableActions(booking);
                                    const statusConfig = getStatusConfig(booking.status);

                                    return (
                                        <MotionTr
                                            key={booking.bookingId}
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
                                                        name={booking.borrowerName}
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
                                                            {booking.borrowerName || 'N/A'}
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="#666666"
                                                            fontWeight="medium"
                                                        >
                                                            ID: {booking.bookingId?.slice(0, 8)}...
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="bold"
                                                        color="#444444"
                                                    >
                                                        {booking.buildingName || 'N/A'}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="#666666"
                                                        fontWeight="medium"
                                                    >
                                                        Peminjaman Ruangan
                                                    </Text>
                                                </VStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="bold"
                                                        color="#444444"
                                                    >
                                                        {booking.activityName || 'N/A'}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="#666666"
                                                        noOfLines={2}
                                                        fontWeight="medium"
                                                    >
                                                        Kegiatan peminjaman ruangan
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
                                                            {booking.startDate || 'N/A'}
                                                            {booking.endDate && booking.endDate !== booking.startDate &&
                                                                ` - ${booking.endDate}`
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
                                                            {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                                                        </Text>
                                                    </HStack>
                                                </VStack>
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
                                                    {statusConfig.label}
                                                </Badge>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Menu>
                                                    <MenuButton
                                                        as={IconButton}
                                                        icon={<MoreVertical size={16} />}
                                                        variant="ghost"
                                                        size="sm"
                                                        borderRadius="10px"
                                                        bg="rgba(255, 255, 255, 0.1)"
                                                        color="#444444"
                                                        border="1px solid rgba(255, 255, 255, 0.15)"
                                                        _hover={{
                                                            bg: "rgba(116, 156, 115, 0.1)",
                                                            borderColor: "rgba(116, 156, 115, 0.3)",
                                                            transform: "translateY(-1px)"
                                                        }}
                                                        transition="all 0.2s ease"
                                                    />
                                                    <MenuList
                                                        bg="rgba(255, 255, 255, 0.95)"
                                                        backdropFilter="blur(16px)"
                                                        border="1px solid rgba(255, 255, 255, 0.2)"
                                                        boxShadow="0 12px 40px rgba(116, 156, 115, 0.15)"
                                                        borderRadius="12px"
                                                        overflow="hidden"
                                                        p={2}
                                                    >
                                                        {actions.map((action, actionIndex) => (
                                                            <MenuItem
                                                                key={actionIndex}
                                                                icon={<action.icon size={16} />}
                                                                onClick={action.onClick}
                                                                borderRadius="8px"
                                                                fontWeight="medium"
                                                                _hover={{
                                                                    bg: action.color === 'red'
                                                                        ? 'rgba(239, 68, 68, 0.1)'
                                                                        : action.color === 'green'
                                                                            ? 'rgba(34, 197, 94, 0.1)'
                                                                            : 'rgba(116, 156, 115, 0.1)'
                                                                }}
                                                                color={action.color === 'red' ? 'red.500' : 'inherit'}
                                                                transition="all 0.2s ease"
                                                            >
                                                                {action.label}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </MotionTr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </Box>

                    {bookings.length === 0 && (
                        <Box
                            textAlign="center"
                            py={12}
                            color="#666666"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                Belum ada data peminjaman
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

export default BookingTable; 