import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Spinner,
    Alert,
    AlertIcon,
    ButtonGroup,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { Grid, Table } from 'lucide-react';
import { H1, H3 } from '@shared/components/Typography';
import PaginationControls from '@shared/components/PaginationControls';
import { useTransactionHistory } from './api/useTransactions';
import TransactionTable from './components/TransactionTable';
import TransactionEmptyState from './components/TransactionEmptyState';

const UserTransactionPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('table'); // 'card' or 'table'

    const {
        transactions,
        loading: transactionsLoading,
        error: transactionsError,
        pagination: transactionsPagination,
        fetchTransactionHistory
    } = useTransactionHistory({ page: currentPage, limit: 10 });

    const handleTransactionPageChange = (page) => {
        setCurrentPage(page);
        fetchTransactionHistory({ page, limit: 10 });
    };

    return (
        <Box px={{ base: 4, md: 6, lg: 8 }} py={8} minH="100vh">
            <Box maxW="1200px" mx="auto">
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

                    </HStack>

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