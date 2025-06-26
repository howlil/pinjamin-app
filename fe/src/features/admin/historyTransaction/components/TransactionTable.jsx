import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    HStack,
    Text
} from '@chakra-ui/react';
import { FileDown, DollarSign } from 'lucide-react';
import { PrimaryButton } from '@shared/components/Button';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import TransactionTableRow from './TransactionTableRow';
import MonthYearPicker from './MonthYearPicker';

const TransactionTable = ({
    transactions,
    pagination,
    currentPage,
    selectedPeriod,
    onPeriodChange,
    onExport,
    onPageChange,
    exportLoading
}) => {
    if (transactions.length === 0 && !selectedPeriod) {
        return (
            <Box>
                <Box p={4} borderBottom="1px" borderColor="gray.200" bg="gray.50">
                    <HStack justify="space-between">
                        <MonthYearPicker
                            value={selectedPeriod}
                            onChange={onPeriodChange}
                            placeholder="Semua Periode"
                        />
                        <PrimaryButton
                            size="sm"
                            leftIcon={<FileDown size={16} />}
                            onClick={onExport}
                            isLoading={exportLoading}
                            loadingText="Mengexport..."
                            isDisabled={transactions.length === 0}
                        >
                            Export Excel
                        </PrimaryButton>
                    </HStack>
                </Box>
                <EmptyState
                    icon={DollarSign}
                    title="Belum ada transaksi"
                    description="Transaksi akan muncul di sini setelah ada pembayaran"
                />
            </Box>
        );
    }

    return (
        <>
            <Box p={4} borderBottom="1px" borderColor="gray.200" bg="gray.50">
                <HStack justify="space-between">
                    <MonthYearPicker
                        value={selectedPeriod}
                        onChange={onPeriodChange}
                        placeholder="Semua Periode"
                    />
                    <PrimaryButton
                        size="sm"
                        leftIcon={<FileDown size={16} />}
                        onClick={onExport}
                        isLoading={exportLoading}
                        loadingText="Mengexport..."
                    >
                        Export Excel
                    </PrimaryButton>
                </HStack>
            </Box>

            <TableContainer>
                <Table variant="simple">
                    <Thead bg="green.50">
                        <Tr>
                            <Th>No Invoice</Th>
                            <Th>Gedung & Peminjam</Th>
                            <Th>Tanggal</Th>
                            <Th>Total</Th>
                            <Th>Status</Th>
                            <Th>Metode</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transactions.map((transaction) => (
                            <TransactionTableRow
                                key={transaction.transactionId}
                                transaction={transaction}
                            />
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Box p={6} borderTop="1px" borderColor="gray.200">
                <PaginationControls
                    currentPage={pagination.currentPage || currentPage || 1}
                    totalPages={pagination.totalPages || 1}
                    onPageChange={onPageChange}
                />
            </Box>
        </>
    );
};

export default TransactionTable; 