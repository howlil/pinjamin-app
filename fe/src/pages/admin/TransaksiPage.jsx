import React, { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { CreditCard } from 'lucide-react';

import { GlassCard } from '@/components/ui';
import { useTransactions } from '@/hooks/useTransactions';
import { DataStateHandler, AdminSearchFilter } from '@/components/admin/common';
import { TransactionHeader, TransactionTable } from '@/components/admin/transaction';

// Payment status options for filter
const PAYMENT_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Menunggu' },
    { value: 'PAID', label: 'Lunas' },
    { value: 'FAILED', label: 'Gagal' },
    { value: 'CANCELLED', label: 'Dibatalkan' },
    { value: 'REFUNDED', label: 'Dikembalikan' }
];

// Payment method options for filter
const PAYMENT_METHOD_OPTIONS = [
    { value: 'Credit Card', label: 'Kartu Kredit' },
    { value: 'E-Wallet', label: 'E-Wallet' },
    { value: 'Bank Transfer', label: 'Transfer Bank' },
    { value: 'Cash', label: 'Tunai' }
];

const TransaksiPage = () => {
    // Custom hook for all business logic
    const {
        transactions,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalTransactions,
        actionLoading,
        paymentStatusFilter,
        paymentMethodFilter,
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        confirmPayment,
        cancelTransaction,
        processRefund,
        sendPaymentReminder,
        refreshData
    } = useTransactions();

    // Local state for UI interactions
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Modal states - implement these later with specific modals
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

    // Handle actions
    const handleView = (transaction) => {
        setSelectedTransaction(transaction);
        onViewOpen();
    };

    const handleConfirmPayment = async (transaction) => {
        const success = await confirmPayment(transaction.id);
        if (success) {
            // Could show success feedback or refresh
        }
    };

    const handleCancelTransaction = async (transaction) => {
        const success = await cancelTransaction(transaction.id);
        if (success) {
            // Could show success feedback or refresh
        }
    };

    const handleProcessRefund = async (transaction) => {
        // This would open a refund modal in a real implementation
        const refundData = { reason: 'Admin requested refund' };
        const success = await processRefund(transaction.id, refundData);
        if (success) {
            // Could show success feedback or refresh
        }
    };

    const handleSendReminder = async (transaction) => {
        const success = await sendPaymentReminder(transaction.id);
        if (success) {
            // Could show success feedback
        }
    };

    const handleExport = () => {
        // Implementation for exporting transaction data
        console.log('Export transactions');
    };

    // Prepare filters for search component
    const filters = [
        {
            key: 'paymentStatus',
            label: 'Status Pembayaran',
            value: paymentStatusFilter,
            options: PAYMENT_STATUS_OPTIONS,
            onChange: (value) => handleFilterChange('paymentStatus', value)
        },
        {
            key: 'paymentMethod',
            label: 'Metode Pembayaran',
            value: paymentMethodFilter,
            options: PAYMENT_METHOD_OPTIONS,
            onChange: (value) => handleFilterChange('paymentMethod', value)
        }
    ];

    return (
        <Box>
            {/* Header Section */}
            <TransactionHeader
                onRefresh={refreshData}
                onExport={handleExport}
            />

            {/* Search and Filter Section */}
            <AdminSearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                searchPlaceholder="Cari berdasarkan nama peminjam, gedung, atau invoice..."
                filters={filters}
                totalItems={totalTransactions}
                currentItems={transactions.length}
                itemLabel="transaksi"
            />

            {/* Content Section */}
            <GlassCard p={6} mt={6}>
                <DataStateHandler
                    loading={loading}
                    error={error}
                    data={transactions}
                    emptyMessage="Belum ada data transaksi"
                    emptySearchMessage="Tidak ada transaksi yang sesuai dengan pencarian"
                    loadingMessage="Memuat data transaksi..."
                    isSearching={Boolean(searchTerm || paymentStatusFilter || paymentMethodFilter)}
                    EmptyIcon={CreditCard}
                >
                    <TransactionTable
                        transactions={transactions}
                        onView={handleView}
                        onConfirmPayment={handleConfirmPayment}
                        onCancelTransaction={handleCancelTransaction}
                        onProcessRefund={handleProcessRefund}
                        onSendReminder={handleSendReminder}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalTransactions}
                        onPageChange={handlePageChange}
                    />
                </DataStateHandler>
            </GlassCard>

            {/* Modals would go here */}
            {/* 
            <TransactionDetailModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                transaction={selectedTransaction}
            />
            */}
        </Box>
    );
};

export default TransaksiPage;
