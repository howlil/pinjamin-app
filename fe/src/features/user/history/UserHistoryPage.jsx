import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Spinner,
    ButtonGroup,
    IconButton,
    Tooltip,
    Grid
} from '@chakra-ui/react';
import { Grid as GridIcon, Table } from 'lucide-react';
import { useBookingHistory } from './api/useHistory';
import HistoryTable from './components/HistoryTable';
import HistoryEmptyState from './components/HistoryEmptyState';
import StatusTabs from './components/StatusTabs';
import PaginationControls from '../../../shared/components/PaginationControls';

const UserHistoryPage = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('table'); // 'card' or 'table'

    const {
        bookings,
        loading,
        error,
        pagination,
        fetchBookingHistory
    } = useBookingHistory();

    useEffect(() => {
        fetchBookingHistory({
            status: statusFilter,
            page: currentPage,
            limit: 10
        });
    }, [statusFilter, currentPage]);

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            '': 'Semua Status',
            'PROCESSING': 'Diproses',
            'APPROVED': 'Disetujui',
            'REJECTED': 'Ditolak',
            'COMPLETED': 'Selesai'
        };
        return statusLabels[status] || status;
    };

    return (
        <Box
            minH="100vh"
            px={{ base: 4, md: 6, lg: 8 }}
            py={{ base: 6, md: 8 }}
        >
            <VStack align="stretch" spacing={8} maxW="1200px" mx="auto">
                {/* Header */}
                <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
                    <VStack align="flex-start" spacing={4}>
                        <Text
                            fontSize={{ base: "2xl", md: "3xl" }}
                            fontWeight="700"
                            color="#2A2A2A"
                            fontFamily="Inter, sans-serif"
                        >
                            Riwayat Peminjaman
                        </Text>
                        <Text
                            fontSize="md"
                            color="#666"
                            fontFamily="Inter, sans-serif"
                            maxW="600px"
                        >
                            Lihat semua riwayat peminjaman ruangan Anda dengan status terkini dan detail lengkap aktivitas.
                        </Text>
                    </VStack>

                </HStack>

                {/* Status Tabs */}
                <StatusTabs
                    activeStatus={statusFilter}
                    onStatusChange={handleStatusChange}
                />

                {/* Content */}
                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={12}
                    >
                        <VStack spacing={4}>
                            <Spinner size="xl" color="#21D179" thickness="4px" />
                            <Text
                                fontSize="md"
                                color="#666"
                                fontFamily="Inter, sans-serif"
                            >
                                Memuat riwayat peminjaman...
                            </Text>
                        </VStack>
                    </Box>
                ) : bookings.length === 0 ? (
                    <HistoryEmptyState />
                ) : (
                    <VStack align="stretch" spacing={6}>
                        <HistoryTable bookings={bookings} />


                        {pagination.totalPages > 1 && (
                            <Box display="flex" justifyContent="center" pt={4}>
                                <PaginationControls
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    totalItems={pagination.totalItems}
                                    itemsPerPage={pagination.itemsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            </Box>
                        )}
                    </VStack>
                )}

                {/* Summary */}
                {!loading && bookings.length > 0 && (
                    <Box
                        background="rgba(255, 255, 255, 0.9)"
                        backdropFilter="blur(15px)"
                        borderRadius="24px"
                        border="1px solid rgba(215, 215, 215, 0.3)"
                        p={4}
                        textAlign="center"
                    >
                        <Text
                            fontSize="sm"
                            color="#666"
                            fontFamily="Inter, sans-serif"
                        >
                            Menampilkan {bookings.length} dari {pagination.totalItems} riwayat peminjaman
                            {statusFilter && ` dengan status "${getStatusLabel(statusFilter)}"`}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default UserHistoryPage; 