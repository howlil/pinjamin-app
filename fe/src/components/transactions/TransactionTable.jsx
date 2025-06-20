import React from 'react';
import { Box, Badge, Button, HStack, Text } from '@chakra-ui/react';
import { FileText } from 'lucide-react';
import { AdminPagination } from '@/components/admin/common';
import { COLORS } from '@/utils/designTokens';

const TransactionTable = ({
    transactions = [],
    formatCurrency,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange,
    onPayNow,
    onGenerateInvoice,
    generatingInvoice = false
}) => {
    // Helper functions for status and payment method display
    const getStatusBadge = (status) => {
        const statusColors = {
            'PENDING': 'orange',
            'PAID': 'green',
            'FAILED': 'red',
            'CANCELLED': 'gray',
            'REFUNDED': 'blue'
        };
        return statusColors[status] || 'gray';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'PENDING': 'Menunggu',
            'PAID': 'Lunas',
            'FAILED': 'Gagal',
            'CANCELLED': 'Dibatalkan',
            'REFUNDED': 'Dikembalikan'
        };
        return statusTexts[status] || status;
    };
    if (!transactions || transactions.length === 0) {
        return (
            <Box
                p={8}
                textAlign="center"
                bg="white"
                rounded="lg"
                shadow="sm"
                border="1px"
                borderColor="gray.200"
            >
                <Box fontSize="lg" color="gray.500" mb={2}>
                    Tidak ada transaksi
                </Box>
                <Box fontSize="sm" color="gray.400">
                    Transaksi Anda akan muncul di sini
                </Box>
            </Box>
        );
    }

    return (
        <Box
            overflowX="auto"
            bg="white"
            rounded="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.200"
        >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#F7FAFC' }}>
                    <tr>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            No
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Tanggal Pembayaran
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Gedung
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Metode Pembayaran
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'right',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Total
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Status
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr
                            key={transaction.transactionId}
                            style={{
                                borderBottom: index < transactions.length - 1 ? '1px solid #F7FAFC' : 'none'
                            }}
                        >
                            <td style={{
                                padding: '16px 12px',
                                fontSize: '14px',
                                color: COLORS.black
                            }}>
                                {(currentPage - 1) * 10 + index + 1}
                            </td>
                            <td style={{
                                padding: '16px 12px',
                                fontSize: '14px',
                                color: COLORS.black
                            }}>
                                {transaction.paymentDate || '-'}
                            </td>
                            <td style={{
                                padding: '16px 12px',
                                fontSize: '14px',
                                color: COLORS.black,
                                maxWidth: '200px'
                            }}>
                                {transaction.buildingName || 'N/A'}
                            </td>
                            <td style={{
                                padding: '16px 12px',
                                fontSize: '14px',
                                color: COLORS.black
                            }}>
                                {transaction.paymentMethod || '-'}
                            </td>
                            <td style={{
                                padding: '16px 12px',
                                textAlign: 'right',
                                fontWeight: '600',
                                fontSize: '14px',
                                color: COLORS.black
                            }}>
                                {formatCurrency(transaction.totalAmount || 0)}
                            </td>
                            <td style={{ padding: '16px 12px' }}>
                                <Badge
                                    colorScheme={getStatusBadge(transaction.paymentStatus)}
                                    borderRadius="full"
                                    px={2}
                                    py={1}
                                    fontSize="xs"
                                >
                                    {getStatusText(transaction.paymentStatus)}
                                </Badge>
                            </td>
                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                <HStack spacing={2} justify="center">
                                    {/* Tombol Bayar untuk status PENDING */}
                                    {transaction.paymentStatus === 'PENDING' && onPayNow && (
                                        <Button
                                            size="sm"
                                            colorScheme="green"
                                            borderRadius="full"
                                            onClick={() => onPayNow(transaction.transactionId)}
                                        >
                                            Bayar
                                        </Button>
                                    )}

                                    {/* Tombol Cetak Invoice untuk status PAID */}
                                    {transaction.paymentStatus === 'PAID' && onGenerateInvoice && (
                                        <Button
                                            size="sm"
                                            colorScheme="blue"
                                            variant="outline"
                                            borderRadius="full"
                                            leftIcon={<FileText size={14} />}
                                            onClick={() => onGenerateInvoice(
                                                transaction.bookingId || transaction.transactionId,
                                                transaction.buildingName
                                            )}
                                            isLoading={generatingInvoice}
                                            loadingText="Membuat..."
                                        >
                                            Invoice
                                        </Button>
                                    )}

                                    {/* Text untuk status lainnya */}
                                    {!['PENDING', 'PAID'].includes(transaction.paymentStatus) && (
                                        <Text fontSize="sm" color="gray.500">
                                            -
                                        </Text>
                                    )}
                                </HStack>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box p={4} borderTop="1px solid #E2E8F0">
                    <AdminPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        totalItems={totalItems}
                        itemsPerPage={10}
                        itemLabel="transaksi"
                    />
                </Box>
            )}
        </Box>
    );
};

export default TransactionTable; 