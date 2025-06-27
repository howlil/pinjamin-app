import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    VStack
} from '@chakra-ui/react';
import { useAdminTransactions, useExportTransactions } from './api/useAdminTransactions';
import TransactionTable from './components/TransactionTable';

const HistoryTransactionPage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    // Use hooks
    const { transactions, loading, pagination, fetchTransactions } = useAdminTransactions();
    const { exportTransactions, loading: exportLoading } = useExportTransactions();

    // Fetch data on component mount and page change
    useEffect(() => {
        fetchTransactions({
            page: currentPage,
            limit: 10
        });
    }, [currentPage]);

    const handleExport = useCallback(async () => {
        try {
            await exportTransactions();
        } catch (error) {
            // Error already handled in hook
        }
    }, [exportTransactions]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    return (
        <Container maxW="full" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Transaction Table */}
                <TransactionTable
                    transactions={transactions}
                    pagination={pagination}
                    currentPage={currentPage}
                    onExport={handleExport}
                    onPageChange={handlePageChange}
                    exportLoading={exportLoading}
                    loading={loading}
                />
            </VStack>
        </Container>
    );
};

export default HistoryTransactionPage; 