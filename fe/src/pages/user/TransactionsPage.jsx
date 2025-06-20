import React from 'react';
import { Box, Container, VStack } from '@chakra-ui/react';
import { TransactionHeader, TransactionTable } from '@/components/transactions';
import { useTransactions } from '@/hooks/useTransactions';

const TransactionsPage = () => {
  const {
    transactions,
    getStatusBadge,
    getStatusText,
    getTypeBadge,
    getTypeText,
    formatCurrency,
    getTotalPending,
    handlePayNow
  } = useTransactions();

  const totalPending = getTotalPending();

  return (
    <Box py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          <TransactionHeader
            totalPending={totalPending}
            formatCurrency={formatCurrency}
            onPayNow={handlePayNow}
          />

          <TransactionTable
            transactions={transactions}
            getStatusBadge={getStatusBadge}
            getStatusText={getStatusText}
            getTypeBadge={getTypeBadge}
            getTypeText={getTypeText}
            formatCurrency={formatCurrency}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default TransactionsPage; 