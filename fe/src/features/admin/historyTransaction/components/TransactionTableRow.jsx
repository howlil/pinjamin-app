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
        'PAID': {
            color: 'green',
            label: 'Dibayar',
            bg: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)'
        },
        'UNPAID': {
            color: 'red',
            label: 'Belum Dibayar',
            bg: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
        },
        'PENDING': {
            color: 'yellow',
            label: 'Menunggu',
            bg: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)'
        },
        'SETTLED': {
            color: 'blue',
            label: 'Selesai',
            bg: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)'
        },
        'EXPIRED': {
            color: 'gray',
            label: 'Kadaluarsa',
            bg: 'rgba(107, 114, 128, 0.1)',
            borderColor: 'rgba(107, 114, 128, 0.3)'
        }
    };
    return statusConfig[status] || {
        color: 'gray',
        label: status,
        bg: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgba(107, 114, 128, 0.3)'
    };
};

const TransactionTableRow = ({ transaction }) => {
    const statusConfig = getPaymentStatusBadge(transaction.paymentStatus);

    return (
        <Tr
            _hover={{
                bg: "rgba(33, 209, 121, 0.02)",
                transform: "translateX(2px)"
            }}
            transition="all 0.2s ease"
        >
            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <HStack spacing={2}>
                    <Box
                        p={2}
                        bg="rgba(33, 209, 121, 0.1)"
                        borderRadius="8px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Receipt size={14} color={COLORS.primary} />
                    </Box>
                    <Text
                        fontWeight="600"
                        color={COLORS.text}
                        fontFamily="Inter, sans-serif"
                        fontSize="sm"
                    >
                        {transaction.invoiceNumber || '-'}
                    </Text>
                </HStack>
            </Td>
            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <Box>
                    <Text
                        fontWeight="600"
                        color={COLORS.text}
                        fontFamily="Inter, sans-serif"
                        fontSize="sm"
                        mb={1}
                    >
                        {transaction.buildingName}
                    </Text>
                    <HStack spacing={1}>
                        <User size={12} color="gray" />
                        <Text
                            fontSize="xs"
                            color="gray.600"
                            fontFamily="Inter, sans-serif"
                        >
                            {transaction.borrowerName}
                        </Text>
                    </HStack>
                </Box>
            </Td>
            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <HStack spacing={2}>
                    <Box
                        p={1}
                        bg="rgba(107, 114, 128, 0.1)"
                        borderRadius="6px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Calendar size={12} color="gray" />
                    </Box>
                    <Text
                        fontSize="sm"
                        color={COLORS.text}
                        fontFamily="Inter, sans-serif"
                        fontWeight="500"
                    >
                        {transaction.paymentDate}
                    </Text>
                </HStack>
            </Td>
            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <Text
                    fontWeight="700"
                    color={COLORS.primary}
                    fontFamily="Inter, sans-serif"
                    fontSize="sm"
                >
                    {formatCurrency(transaction.totalAmount)}
                </Text>
            </Td>
            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <Box
                    bg={statusConfig.bg}
                    border="1px solid"
                    borderColor={statusConfig.borderColor}
                    borderRadius="20px"
                    px={3}
                    py={1}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    backdropFilter="blur(10px)"
                >
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color={`${statusConfig.color}.600`}
                        fontFamily="Inter, sans-serif"
                    >
                        {statusConfig.label}
                    </Text>
                </Box>
            </Td>
            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <HStack spacing={2}>
                    <Box
                        p={1}
                        bg="rgba(107, 114, 128, 0.1)"
                        borderRadius="6px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CreditCard size={12} color="gray" />
                    </Box>
                    <Text
                        fontSize="sm"
                        color={COLORS.text}
                        fontFamily="Inter, sans-serif"
                        fontWeight="500"
                    >
                        {transaction.paymentMethod || '-'}
                    </Text>
                </HStack>
            </Td>
        </Tr>
    );
};

export default TransactionTableRow; 