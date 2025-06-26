import React from 'react';
import {
    Tr,
    Td,
    HStack,
    Text,
    Badge,
    Box
} from '@chakra-ui/react';
import { Receipt, User, Calendar, CreditCard } from 'lucide-react';
import { COLORS } from '@utils/designTokens';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const getPaymentStatusBadge = (status) => {
    const statusConfig = {
        'PAID': { color: 'green', label: 'Dibayar' },
        'UNPAID': { color: 'red', label: 'Belum Dibayar' },
        'PENDING': { color: 'yellow', label: 'Menunggu' },
        'SETTLED': { color: 'blue', label: 'Selesai' },
        'EXPIRED': { color: 'gray', label: 'Kadaluarsa' }
    };
    return statusConfig[status] || { color: 'gray', label: status };
};

const TransactionTableRow = ({ transaction }) => {
    const statusConfig = getPaymentStatusBadge(transaction.paymentStatus);

    return (
        <Tr>
            <Td>
                <HStack spacing={2}>
                    <Receipt size={16} color={COLORS.primary} />
                    <Text fontWeight="medium">
                        {transaction.invoiceNumber || '-'}
                    </Text>
                </HStack>
            </Td>
            <Td>
                <Box>
                    <Text fontWeight="medium">
                        {transaction.buildingName}
                    </Text>
                    <HStack spacing={1} mt={1}>
                        <User size={14} color="gray" />
                        <Text fontSize="sm" color="gray.600">
                            {transaction.borrowerName}
                        </Text>
                    </HStack>
                </Box>
            </Td>
            <Td>
                <HStack spacing={1}>
                    <Calendar size={14} color="gray" />
                    <Text fontSize="sm">
                        {transaction.paymentDate}
                    </Text>
                </HStack>
            </Td>
            <Td>
                <Text fontWeight="bold" color={COLORS.primary}>
                    {formatCurrency(transaction.totalAmount)}
                </Text>
            </Td>
            <Td>
                <Badge
                    colorScheme={statusConfig.color}
                    borderRadius="full"
                    px={3}
                    py={1}
                >
                    {statusConfig.label}
                </Badge>
            </Td>
            <Td>
                <HStack spacing={1}>
                    <CreditCard size={14} color="gray" />
                    <Text fontSize="sm">
                        {transaction.paymentMethod || '-'}
                    </Text>
                </HStack>
            </Td>
        </Tr>
    );
};

export default TransactionTableRow; 