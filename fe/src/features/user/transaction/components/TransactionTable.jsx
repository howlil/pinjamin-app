import React from 'react';
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
    VStack
} from '@chakra-ui/react';
import PrimaryButton from '@shared/components/Button';
import { useTransactionInvoice } from '../api/useTransactions';

const TransactionTable = ({ transactions }) => {
    const { generateInvoice, loading: invoiceLoading } = useTransactionInvoice();

    const getStatusConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
            case 'SETTLED':
                return {
                    label: 'Berhasil',
                    bgColor: '#21D179',
                    textColor: 'white'
                };
            case 'PENDING':
                return {
                    label: 'Pending',
                    bgColor: '#FF8C00',
                    textColor: 'white'
                };
            case 'UNPAID':
                return {
                    label: 'Belum Bayar',
                    bgColor: '#EF4444',
                    textColor: 'white'
                };
            case 'EXPIRED':
                return {
                    label: 'Kadaluarsa',
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleGenerateInvoice = async (bookingsId) => {
        console.log('Transaction data for invoice:', bookingsId); // Debug log
        await generateInvoice(bookingsId);
    };

    const canGenerateInvoice = (status) => {
        return ['PAID', 'SETTLED'].includes(status?.toUpperCase());
    };



    if (!transactions || transactions.length === 0) {
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
                    Tidak ada data transaksi
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
                                NO
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
                                Tanggal Bayar
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                            >
                                Metode
                            </Th>
                            <Th
                                color="#2A2A2A"
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                isNumeric
                            >
                                Total
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
                            >
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transactions.map((transaction, index) => {
                            const statusConfig = getStatusConfig(transaction.paymentStatus);

                            return (
                                <Tr
                                    key={transaction.transactionId || index}
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
                                            noOfLines={1}
                                        >
                                            {transaction.buildingName || '-'}
                                        </Text>
                                    </Td>

                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                    >
                                        <Text fontSize="sm" color="#2A2A2A">
                                            {transaction.paymentDate || '-'}
                                        </Text>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                    >
                                        <Text fontSize="sm" color="#2A2A2A">
                                            {transaction.paymentMethod || '-'}
                                        </Text>
                                    </Td>
                                    <Td
                                        py={4}
                                        borderColor="rgba(215, 215, 215, 0.2)"
                                        isNumeric
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="#21D179"
                                            fontWeight="700"
                                        >
                                            {formatCurrency(transaction.totalAmount || 0)}
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
                                    >
                                        <PrimaryButton
                                            size="sm"
                                            w="100%"
                                            isDisabled={!canGenerateInvoice(transaction.paymentStatus) || invoiceLoading}
                                            isLoading={invoiceLoading}
                                            onClick={() => {
                                                console.log('Full transaction object:', transaction); // Debug log
                                                handleGenerateInvoice(transaction.bookingsId || transaction.transactionId || transaction.id);
                                            }}
                                        >
                                            Cetak Invoice
                                        </PrimaryButton>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default TransactionTable; 