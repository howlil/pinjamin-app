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
    CheckCircle,
    XCircle,
    RefreshCw,
    Send
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import AdminPagination from '../common/AdminPagination';

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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get payment status badge color
    const getPaymentStatusColor = (status) => {
        const colors = {
            'PENDING': 'orange',
            'PAID': 'green',
            'FAILED': 'red',
            'CANCELLED': 'gray',
            'REFUNDED': 'blue'
        };
        return colors[status] || 'gray';
    };

    // Get payment method badge color
    const getPaymentMethodColor = (method) => {
        const colors = {
            'Credit Card': 'purple',
            'E-Wallet': 'cyan',
            'Bank Transfer': 'blue',
            'Cash': 'green'
        };
        return colors[method] || 'gray';
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
        <Box>
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Invoice
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Peminjam
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Gedung
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Jumlah
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Status
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Tanggal
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transactions.map((transaction, index) => {
                            const actions = getAvailableActions(transaction);
                            return (
                                <motion.tr
                                    key={transaction.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                                {transaction.invoiceNumber || 'No Invoice'}
                                            </Text>
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                ID: {transaction.id ? transaction.id.slice(-8) : 'N/A'}
                                            </Text>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <HStack spacing={3}>
                                            <Avatar
                                                size="sm"
                                                name={transaction.borrowerName || 'Unknown'}
                                                bg={COLORS.primary}
                                                color="white"
                                                fontSize="xs"
                                            />
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                    {transaction.borrowerName || 'Unknown'}
                                                </Text>
                                                <Text fontSize="xs" color={COLORS.gray[500]}>
                                                    {transaction.borrowerEmail || 'No Email'}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                {transaction.buildingName || 'Unknown Building'}
                                            </Text>
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                {transaction.roomName || 'Unknown Room'}
                                            </Text>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Text fontSize="sm" fontWeight="bold" color={COLORS.black}>
                                            {formatCurrency(transaction.amount || 0)}
                                        </Text>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={2}>
                                            <Badge
                                                colorScheme={getPaymentStatusColor(transaction.paymentStatus)}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                                fontSize="xs"
                                                fontWeight="medium"
                                            >
                                                {transaction.paymentStatus || 'UNKNOWN'}
                                            </Badge>
                                            <Badge
                                                colorScheme={getPaymentMethodColor(transaction.paymentMethod)}
                                                variant="outline"
                                                borderRadius="full"
                                                px={2}
                                                py={1}
                                                fontSize="xs"
                                            >
                                                {transaction.paymentMethod || 'Unknown'}
                                            </Badge>
                                        </VStack>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" color={COLORS.black}>
                                                {transaction.createdAt ? formatDate(transaction.createdAt) : 'Unknown Date'}
                                            </Text>
                                            {transaction.paidAt && (
                                                <Text fontSize="xs" color={COLORS.gray[500]}>
                                                    Paid: {formatDate(transaction.paidAt)}
                                                </Text>
                                            )}
                                        </VStack>
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

export default TransactionTable; 