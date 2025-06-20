import React from 'react';
import { Box, Container, VStack, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { TransactionHeader, TransactionTable } from '@/components/transactions';
import { useUserTransactions } from '@/hooks/useUserTransactions';

const TransactionsPage = () => {
  const {
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    totalTransactions,
    generatingInvoice,
    handlePageChange,
    refreshData,
    generateInvoice
  } = useUserTransactions();

  // Helper functions for formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTotalPending = () => {
    return transactions
      .filter(t => t.paymentStatus === 'PENDING')
      .reduce((total, t) => total + (t.totalAmount || 0), 0);
  };

  const handlePayNow = (transactionId) => {
    // Implement payment logic
    console.log('Pay now for transaction:', transactionId);
    // In real app, this would navigate to payment page or open payment modal
  };

  // Handle refresh
  const handleRefresh = () => {
    refreshData();
  };

  // Handle generate invoice
  const handleGenerateInvoice = (bookingId, buildingName) => {
    generateInvoice(bookingId, buildingName);
  };

  if (loading) {
    return (
      <Box py={8}>
        <Container maxW="7xl">
          <VStack spacing={4} align="center" py={8}>
            <Spinner size="xl" color="green.500" />
            <Text>Memuat riwayat transaksi...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={8}>
        <Container maxW="7xl">
          <Alert status="error" rounded="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="semibold">Gagal memuat data transaksi</Text>
              <Text fontSize="sm">{error}</Text>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  const totalPending = getTotalPending();

  return (
    <Box py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          <TransactionHeader
            totalPending={totalPending}
            totalTransactions={totalTransactions}
            formatCurrency={formatCurrency}
            onRefresh={handleRefresh}
            onPayNow={handlePayNow}
          />

          <TransactionTable
            transactions={transactions}
            formatCurrency={formatCurrency}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalTransactions}
            onPageChange={handlePageChange}
            onPayNow={handlePayNow}
            onGenerateInvoice={handleGenerateInvoice}
            generatingInvoice={generatingInvoice}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default TransactionsPage; 