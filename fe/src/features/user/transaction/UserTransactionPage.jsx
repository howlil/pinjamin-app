import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Spinner,
    Alert,
    AlertIcon,
    Text,
    Badge
} from '@chakra-ui/react';
import { Receipt, CreditCard } from 'lucide-react';
import { H1, H3 } from '@shared/components/Typography';
import PaginationControls from '@shared/components/PaginationControls';
import { useTransactions } from './api/useTransactions';
import TransactionTable from './components/TransactionTable';
import TransactionEmptyState from './components/TransactionEmptyState';

const UserTransactionPage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const {
        transactions,
        loading: transactionsLoading,
        error: transactionsError,
        pagination: transactionsPagination,
        fetchTransactions
    } = useTransactions({ page: currentPage, limit: 10 });

    const handleTransactionPageChange = (page) => {
        setCurrentPage(page);
        fetchTransactions({ page, limit: 10 });
    };

    // Calculate statistics
    const stats = React.useMemo(() => {
        if (!transactions || transactions.length === 0) return null;

        const totalTransactions = transactionsPagination.totalItems || transactions.length;
        const paidTransactions = transactions.filter(t => ['PAID', 'SETTLED'].includes(t.paymentStatus?.toUpperCase())).length;
        const totalAmount = transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);

        return {
            total: totalTransactions,
            paid: paidTransactions,
            totalAmount
        };
    }, [transactions, transactionsPagination]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Box px={{ base: 4, md: 6, lg: 8 }} py={8} minH="100vh">
            <Box maxW="1400px" mx="auto">
                <VStack spacing={6} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={2}>
                            <H1 fontSize="2xl" fontWeight="700" color="#2A2A2A">
                                Riwayat Transaksi
                            </H1>
                            <H3 fontSize="md" color="#2A2A2A" opacity={0.7} fontWeight="400">
                                Kelola riwayat transaksi pembayaran Anda
                            </H3>
                        </VStack>

                        {/* Transaction Stats */}
                        {stats && (
                            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                                <Box
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(15px)"
                                    borderRadius="16px"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    p={3}
                                    textAlign="center"
                                    minW="120px"
                                >
                                    <Text fontSize="lg" fontWeight="700" color="#21D179">
                                        {stats.total}
                                    </Text>
                                    <Text fontSize="xs" color="#666" fontWeight="500">
                                        Total Transaksi
                                    </Text>
                                </Box>
                                <Box
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(15px)"
                                    borderRadius="16px"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    p={3}
                                    textAlign="center"
                                    minW="120px"
                                >
                                    <Text fontSize="lg" fontWeight="700" color="#21D179">
                                        {stats.paid}
                                    </Text>
                                    <Text fontSize="xs" color="#666" fontWeight="500">
                                        Berhasil
                                    </Text>
                                </Box>
                            </HStack>
                        )}
                    </HStack>

                    {/* Mobile Stats */}
                    {stats && (
                        <HStack spacing={4} display={{ base: 'flex', md: 'none' }}>
                            <Box
                                bg="rgba(255, 255, 255, 0.8)"
                                backdropFilter="blur(15px)"
                                borderRadius="16px"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                p={3}
                                textAlign="center"
                                flex={1}
                            >
                                <Text fontSize="lg" fontWeight="700" color="#21D179">
                                    {stats.total}
                                </Text>
                                <Text fontSize="xs" color="#666" fontWeight="500">
                                    Total
                                </Text>
                            </Box>
                            <Box
                                bg="rgba(255, 255, 255, 0.8)"
                                backdropFilter="blur(15px)"
                                borderRadius="16px"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                p={3}
                                textAlign="center"
                                flex={1}
                            >
                                <Text fontSize="lg" fontWeight="700" color="#21D179">
                                    {stats.paid}
                                </Text>
                                <Text fontSize="xs" color="#666" fontWeight="500">
                                    Berhasil
                                </Text>
                            </Box>
                        </HStack>
                    )}

                    <VStack spacing={6} align="stretch">
                        {transactionsError && (
                            <Alert status="error" borderRadius="16px">
                                <AlertIcon />
                                {transactionsError}
                            </Alert>
                        )}

                        {transactionsLoading ? (
                            <Box display="flex" justifyContent="center" py={12}>
                                <Spinner size="lg" color="#21D179" thickness="3px" />
                            </Box>
                        ) : transactions.length === 0 ? (
                            <TransactionEmptyState type="transactions" />
                        ) : (
                            <>
                                <TransactionTable transactions={transactions} />

                                {transactionsPagination.totalPages > 1 && (
                                    <PaginationControls
                                        currentPage={transactionsPagination.currentPage}
                                        totalPages={transactionsPagination.totalPages}
                                        totalItems={transactionsPagination.totalItems}
                                        itemsPerPage={transactionsPagination.itemsPerPage}
                                        onPageChange={handleTransactionPageChange}
                                    />
                                )}
                            </>
                        )}
                    </VStack>
                </VStack>
            </Box>
        </Box>
    );
};

export default UserTransactionPage;     