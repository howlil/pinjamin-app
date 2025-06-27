import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    HStack,
    Text,
    VStack,
    Center,
    Spinner
} from '@chakra-ui/react';
import { FileDown, DollarSign } from 'lucide-react';
import { PrimaryButton } from '@shared/components/Button';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import TransactionTableRow from './TransactionTableRow';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';

function TransactionTable({
    transactions = [],
    pagination = {},
    currentPage = 1,
    onExport,
    onPageChange,
    exportLoading = false,
    loading = false
}) {
    if (loading) {
        return (
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <Box
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(15px)"
                    borderRadius={`${CORNER_RADIUS.components.cards}px`}
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    p={6}
                >
                    <HStack justify="space-between" align="center">
                        <Text
                            fontSize="lg"
                            fontWeight="600"
                            color={COLORS.text}
                            fontFamily="Inter, sans-serif"
                        >
                            Riwayat Transaksi
                        </Text>
                        <PrimaryButton
                            size="md"
                            leftIcon={<FileDown size={16} />}
                            onClick={onExport}
                            isLoading={exportLoading}
                            loadingText="Mengexport..."
                            isDisabled
                            fontFamily="Inter, sans-serif"
                        >
                            Export Excel
                        </PrimaryButton>
                    </HStack>
                </Box>

                {/* Loading Table */}
                <Box
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(15px)"
                    borderRadius={`${CORNER_RADIUS.components.cards}px`}
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    p={8}
                >
                    <Center>
                        <VStack spacing={4}>
                            <Spinner size="lg" color={COLORS.primary} thickness="3px" />
                            <Text color="gray.600" fontFamily="Inter, sans-serif">
                                Memuat data transaksi...
                            </Text>
                        </VStack>
                    </Center>
                </Box>
            </VStack>
        );
    }

    if (transactions.length === 0) {
        return (
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <Box
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(15px)"
                    borderRadius={`${CORNER_RADIUS.components.cards}px`}
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    p={6}
                >
                    <HStack justify="space-between" align="center">
                        <Text
                            fontSize="lg"
                            fontWeight="600"
                            color={COLORS.text}
                            fontFamily="Inter, sans-serif"
                        >
                            Riwayat Transaksi
                        </Text>
                        <PrimaryButton
                            size="md"
                            leftIcon={<FileDown size={16} />}
                            onClick={onExport}
                            isLoading={exportLoading}
                            loadingText="Mengexport..."
                            isDisabled={transactions.length === 0}
                            fontFamily="Inter, sans-serif"
                        >
                            Export Excel
                        </PrimaryButton>
                    </HStack>
                </Box>

                {/* Empty State */}
                <Box
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(15px)"
                    borderRadius={`${CORNER_RADIUS.components.cards}px`}
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    p={8}
                >
                    <EmptyState
                        icon={DollarSign}
                        title="Belum ada transaksi"
                        description="Transaksi akan muncul di sini setelah ada pembayaran"
                    />
                </Box>
            </VStack>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius={`${CORNER_RADIUS.components.cards}px`}
                border="1px solid rgba(215, 215, 215, 0.5)"
                p={6}
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
            >
                <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <Text
                            fontSize="lg"
                            fontWeight="600"
                            color={COLORS.text}
                            fontFamily="Inter, sans-serif"
                        >
                            Riwayat Transaksi
                        </Text>
                        <Text
                            fontSize="sm"
                            color="gray.600"
                            fontFamily="Inter, sans-serif"
                        >
                            Kelola dan pantau semua transaksi pembayaran
                        </Text>
                    </VStack>
                    <PrimaryButton
                        size="md"
                        leftIcon={<FileDown size={16} />}
                        onClick={onExport}
                        isLoading={exportLoading}
                        loadingText="Mengexport..."
                        fontFamily="Inter, sans-serif"
                        _hover={{
                            transform: "translateY(-2px)"
                        }}
                    >
                        Export Excel
                    </PrimaryButton>
                </HStack>
            </Box>

            {/* Transaction Table */}
            <Box
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius={`${CORNER_RADIUS.components.table}px`}
                border="1px solid rgba(215, 215, 215, 0.5)"
                overflow="hidden"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
            >
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr bg="rgba(33, 209, 121, 0.05)">
                                <Th
                                    color={COLORS.primary}
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    fontFamily="Inter, sans-serif"
                                >
                                    No Invoice
                                </Th>
                                <Th
                                    color={COLORS.primary}
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    fontFamily="Inter, sans-serif"
                                >
                                    Gedung & Peminjam
                                </Th>
                                <Th
                                    color={COLORS.primary}
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    fontFamily="Inter, sans-serif"
                                >
                                    Tanggal
                                </Th>
                                <Th
                                    color={COLORS.primary}
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    fontFamily="Inter, sans-serif"
                                >
                                    Total
                                </Th>
                                <Th
                                    color={COLORS.primary}
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    fontFamily="Inter, sans-serif"
                                >
                                    Status
                                </Th>
                                <Th
                                    color={COLORS.primary}
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    fontFamily="Inter, sans-serif"
                                >
                                    Metode
                                </Th>
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
            </Box>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <PaginationControls
                    currentPage={pagination.currentPage || currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={onPageChange}
                />
            )}
        </VStack>
    );
}

export default TransactionTable; 