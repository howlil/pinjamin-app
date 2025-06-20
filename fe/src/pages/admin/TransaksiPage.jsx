import React, { useState } from 'react';
import {
    Box,
    useDisclosure,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Select,
    VStack,
    Text,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { DollarSign, Download } from 'lucide-react';

import { PrimaryButton } from '@/components/ui';
import { useTransactions } from '@/hooks/useTransactions';
import { DataStateHandler, AdminSearchFilter, PageHeader, PageWrapper } from '@/components/admin/common';
import { TransactionTable } from '@/components/admin/transaction';

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
        exportTransactions
    } = useTransactions();

    // Local state for UI interactions
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [exportMonth, setExportMonth] = useState('');
    const [exportYear, setExportYear] = useState(new Date().getFullYear().toString());

    // Modal states - implement these later with specific modals
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();

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
        onExportOpen();
    };

    const handleConfirmExport = async () => {
        const month = exportMonth ? parseInt(exportMonth) : null;
        const year = exportYear ? parseInt(exportYear) : null;

        const success = await exportTransactions(month, year);
        if (success) {
            onExportClose();
            setExportMonth('');
            setExportYear(new Date().getFullYear().toString());
        }
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
        <PageWrapper>
            {/* Page Header */}
            <PageHeader
                title="Kelola Transaksi"
                subtitle="Manajemen transaksi pembayaran"
                icon={DollarSign}
                action={
                    <PrimaryButton
                        leftIcon={<Download size={18} />}
                        onClick={handleExport}
                        size="lg"
                        variant="outline"
                    >
                        Export
                    </PrimaryButton>
                }
            />

            {/* Search and Filter Section */}
            <Box mb={6}>
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
            </Box>

            {/* Content Section */}
            <DataStateHandler
                loading={loading}
                error={error}
                data={transactions}
                emptyMessage="Belum ada data transaksi"
                emptySearchMessage="Tidak ada transaksi yang sesuai dengan pencarian"
                loadingMessage="Memuat data transaksi..."
                isSearching={Boolean(searchTerm || paymentStatusFilter || paymentMethodFilter)}
                EmptyIcon={DollarSign}
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

            {/* Export Modal */}
            <Modal isOpen={isExportOpen} onClose={onExportClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Export Data Transaksi</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="sm" color="gray.600">
                                Pilih periode untuk mengekspor data transaksi ke file Excel
                            </Text>

                            <FormControl>
                                <FormLabel>Bulan (Opsional)</FormLabel>
                                <Select
                                    value={exportMonth}
                                    onChange={(e) => setExportMonth(e.target.value)}
                                    placeholder="Semua bulan"
                                >
                                    <option value="1">Januari</option>
                                    <option value="2">Februari</option>
                                    <option value="3">Maret</option>
                                    <option value="4">April</option>
                                    <option value="5">Mei</option>
                                    <option value="6">Juni</option>
                                    <option value="7">Juli</option>
                                    <option value="8">Agustus</option>
                                    <option value="9">September</option>
                                    <option value="10">Oktober</option>
                                    <option value="11">November</option>
                                    <option value="12">Desember</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Tahun</FormLabel>
                                <Select
                                    value={exportYear}
                                    onChange={(e) => setExportYear(e.target.value)}
                                >
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                </Select>
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onExportClose}>
                            Batal
                        </Button>
                        <Button
                            colorScheme="green"
                            onClick={handleConfirmExport}
                            isLoading={actionLoading}
                            loadingText="Mengekspor..."
                            leftIcon={<Download size={16} />}
                        >
                            Export
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Other Modals would go here */}
            {/* 
            <TransactionDetailModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                transaction={selectedTransaction}
            />
            */}
        </PageWrapper>
    );
};

export default TransaksiPage;
