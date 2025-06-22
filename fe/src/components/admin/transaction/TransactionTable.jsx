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
    CheckCircle,
    XCircle,
    RefreshCw,
    Send,
    Receipt,
    User,
    Building,
    DollarSign,
    CreditCard,
    Calendar
} from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const TransactionTable = ({
    transactions = [],
    onView,
    onConfirmPayment,
    onCancelTransaction,
    onProcessRefund,
    onSendReminder,
    currentPage,
    totalPages,
    totalItems,
    onPageChange
}) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });

    // Format currency to Indonesian Rupiah
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get payment status badge config
    const getPaymentStatusConfig = (status) => {
        const configs = {
            'PENDING': {
                bg: 'rgba(251, 146, 60, 0.15)',
                color: '#fb923c',
                border: '1px solid rgba(251, 146, 60, 0.2)',
                label: 'Pending'
            },
            'PAID': {
                bg: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                label: 'Paid'
            },
            'FAILED': {
                bg: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                label: 'Failed'
            },
            'CANCELLED': {
                bg: 'rgba(156, 163, 175, 0.15)',
                color: '#6b7280',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                label: 'Cancelled'
            },
            'REFUNDED': {
                bg: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                label: 'Refunded'
            }
        };
        return configs[status] || configs['PENDING'];
    };

    // Get payment method badge config
    const getPaymentMethodConfig = (method) => {
        const configs = {
            'Credit Card': {
                bg: 'rgba(147, 51, 234, 0.15)',
                color: '#9333ea',
                border: '1px solid rgba(147, 51, 234, 0.2)'
            },
            'E-Wallet': {
                bg: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                border: '1px solid rgba(6, 182, 212, 0.2)'
            },
            'Bank Transfer': {
                bg: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)'
            },
            'Cash': {
                bg: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.2)'
            }
        };
        return configs[method] || {
            bg: 'rgba(156, 163, 175, 0.15)',
            color: '#6b7280',
            border: '1px solid rgba(156, 163, 175, 0.2)'
        };
    };

    // Get available actions based on payment status
    const getAvailableActions = (transaction) => {
        const actions = [];

        actions.push({
            label: 'Lihat Detail',
            icon: Eye,
            onClick: () => onView(transaction),
            color: 'blue'
        });

        switch (transaction.paymentStatus) {
            case 'PENDING':
                actions.push(
                    {
                        label: 'Konfirmasi Pembayaran',
                        icon: CheckCircle,
                        onClick: () => onConfirmPayment(transaction),
                        color: 'green'
                    },
                    {
                        label: 'Kirim Pengingat',
                        icon: Send,
                        onClick: () => onSendReminder(transaction),
                        color: 'blue'
                    },
                    {
                        label: 'Batalkan',
                        icon: XCircle,
                        onClick: () => onCancelTransaction(transaction),
                        color: 'red'
                    }
                );
                break;
            case 'PAID':
                actions.push({
                    label: 'Proses Refund',
                    icon: RefreshCw,
                    onClick: () => onProcessRefund(transaction),
                    color: 'orange'
                });
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
                                            <Receipt size={12} />
                                            <Text>Invoice</Text>
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
                                            <Building size={12} />
                                            <Text>Gedung</Text>
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
                                            <DollarSign size={12} />
                                            <Text>Jumlah</Text>
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
                                            <CreditCard size={12} />
                                            <Text>Status</Text>
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
                                            <Calendar size={12} />
                                            <Text>Tanggal</Text>
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
                                        Aksi
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {transactions.map((transaction, index) => {
                                    const actions = getAvailableActions(transaction);
                                    const statusConfig = getPaymentStatusConfig(transaction.paymentStatus);
                                    const methodConfig = getPaymentMethodConfig(transaction.paymentMethod);

                                    return (
                                        <MotionTr
                                            key={transaction.id}
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
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="bold"
                                                        color="#444444"
                                                    >
                                                        {transaction.invoiceNumber || 'No Invoice'}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="#666666"
                                                        fontWeight="medium"
                                                    >
                                                        ID: {transaction.id ? transaction.id.slice(-8) : 'N/A'}
                                                    </Text>
                                                </VStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <HStack spacing={3}>
                                                    <Avatar
                                                        size="sm"
                                                        name={transaction.borrowerName || 'Unknown'}
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
                                                            {transaction.borrowerName || 'Unknown'}
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="#666666"
                                                            fontWeight="medium"
                                                        >
                                                            {transaction.borrowerEmail || 'No Email'}
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
                                                        {transaction.buildingName || 'Unknown Building'}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="#666666"
                                                        fontWeight="medium"
                                                    >
                                                        {transaction.roomName || 'Unknown Room'}
                                                    </Text>
                                                </VStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color="#444444"
                                                >
                                                    {formatCurrency(transaction.amount || 0)}
                                                </Text>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <VStack align="start" spacing={2}>
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
                                                    <Badge
                                                        bg={methodConfig.bg}
                                                        color={methodConfig.color}
                                                        border={methodConfig.border}
                                                        borderRadius="6px"
                                                        px={2}
                                                        py={1}
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                    >
                                                        {transaction.paymentMethod || 'Unknown'}
                                                    </Badge>
                                                </VStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="sm"
                                                        color="#444444"
                                                        fontWeight="medium"
                                                    >
                                                        {transaction.createdAt ? formatDate(transaction.createdAt) : 'Unknown Date'}
                                                    </Text>
                                                    {transaction.paidAt && (
                                                        <Text
                                                            fontSize="xs"
                                                            color="#666666"
                                                            fontWeight="medium"
                                                        >
                                                            Paid: {formatDate(transaction.paidAt)}
                                                        </Text>
                                                    )}
                                                </VStack>
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
                                                                            : action.color === 'orange'
                                                                                ? 'rgba(251, 146, 60, 0.1)'
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

                    {transactions.length === 0 && (
                        <Box
                            textAlign="center"
                            py={12}
                            color="#666666"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                Belum ada data transaksi
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

export default TransactionTable; 