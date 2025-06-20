import React from 'react';
import { Box } from '@chakra-ui/react';
import { COLORS } from '@/utils/designTokens';

const TransactionTable = ({
    transactions = [],
    getStatusBadge,
    getStatusText,
    getTypeBadge,
    getTypeText,
    formatCurrency
}) => {
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
                            Tanggal
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Keterangan
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Jenis
                        </th>
                        <th style={{
                            padding: '12px',
                            textAlign: 'right',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.gray[600],
                            borderBottom: '1px solid #E2E8F0'
                        }}>
                            Jumlah
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
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((item, index) => (
                        <tr
                            key={item.id}
                            style={{
                                borderBottom: index < transactions.length - 1 ? '1px solid #F7FAFC' : 'none'
                            }}
                        >
                            <td style={{
                                padding: '16px 12px',
                                fontSize: '14px',
                                color: COLORS.black
                            }}>
                                {index + 1}
                            </td>
                            <td style={{
                                padding: '16px 12px',
                                fontSize: '14px',
                                color: COLORS.black
                            }}>
                                {item.date || 'N/A'}
                            </td>
                            <td style={{
                                padding: '16px 12px',
                                fontSize: '14px',
                                color: COLORS.black,
                                maxWidth: '200px'
                            }}>
                                {item.description || 'No description'}
                            </td>
                            <td style={{ padding: '16px 12px' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    border: `1px solid ${getTypeBadge(item.type) === 'red' ? '#E53E3E' : '#3182CE'}`,
                                    color: getTypeBadge(item.type) === 'red' ? '#E53E3E' : '#3182CE',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: getTypeBadge(item.type) === 'red' ? '#FED7D7' : '#EBF8FF'
                                }}>
                                    {getTypeText(item.type)}
                                </span>
                            </td>
                            <td style={{
                                padding: '16px 12px',
                                textAlign: 'right',
                                fontWeight: '600',
                                fontSize: '14px',
                                color: COLORS.black
                            }}>
                                {formatCurrency(item.amount || 0)}
                            </td>
                            <td style={{ padding: '16px 12px' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: getStatusBadge(item.status) === 'green' ? '#48BB78' : getStatusBadge(item.status) === 'orange' ? '#ED8936' : '#ECC94B',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    {getStatusText(item.status)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
};

export default TransactionTable; 