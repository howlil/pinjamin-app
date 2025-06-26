import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack
} from '@chakra-ui/react';
import { H2, Text as CustomText } from '@shared/components/Typography';
import LoadingSkeleton from '@shared/components/LoadingSkeleton';
import { useAdminTransactions, useExportTransactions } from './api/useAdminTransactions';
import TransactionTable from './components/TransactionTable';

const HistoryTransactionPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPeriod, setSelectedPeriod] = useState('');

    // Parse period to get month and year
    const parsePeriod = useCallback((period) => {
        if (!period) return {};
        const [month, year] = period.split('-');
        return {
            month: parseInt(month),
            year: parseInt(year)
        };
    }, []);

    // Build filters object - using useMemo to prevent recreating on every render
    const filters = useMemo(() => {
        const { month, year } = parsePeriod(selectedPeriod);
        return {
            page: currentPage,
            limit: 10,
            ...(month && { month }),
            ...(year && { year })
        };
    }, [currentPage, selectedPeriod, parsePeriod]);

    // Use hooks
    const { transactions, loading, pagination, fetchTransactions } = useAdminTransactions(filters);
    const { exportTransactions, loading: exportLoading } = useExportTransactions();

    // Single useEffect for fetching data
    useEffect(() => {
        fetchTransactions(filters);
    }, [currentPage, selectedPeriod]); // Only depend on actual state values, not complex objects

    const handlePeriodChange = useCallback((period) => {
        setSelectedPeriod(period);
        setCurrentPage(1); // Reset to first page when filter changes
    }, []);

    const handleExport = useCallback(async () => {
        try {
            const { month, year } = parsePeriod(selectedPeriod);
            await exportTransactions(month || null, year || null);
        } catch (error) {
            // Error already handled in hook
        }
    }, [selectedPeriod, parsePeriod, exportTransactions]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    if (loading && transactions.length === 0) {
        return (
            <Container maxW="full" py={8}>
                <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                        <Box>
                            <H2>Riwayat Transaksi</H2>
                            <CustomText color="gray.600">
                                Kelola dan export data transaksi
                            </CustomText>
                        </Box>
                    </HStack>
                    <LoadingSkeleton />
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="full" py={8}>
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <HStack justify="space-between" align="center">
                    <Box>
                        <H2>Riwayat Transaksi</H2>
                        <CustomText color="gray.600">
                            Kelola dan export data transaksi
                        </CustomText>
                    </Box>
                </HStack>

                {/* Table */}
                <Box bg="white" borderRadius="24px" overflow="hidden" boxShadow="sm">
                    <TransactionTable
                        transactions={transactions}
                        pagination={pagination}
                        currentPage={currentPage}
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={handlePeriodChange}
                        onExport={handleExport}
                        onPageChange={handlePageChange}
                        exportLoading={exportLoading}
                    />
                </Box>
            </VStack>
        </Container>
    );
};

export default HistoryTransactionPage; 