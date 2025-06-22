import { Box, VStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { HistoryHeader, HistoryTable } from '../../components/user/history';
import { useUserHistory } from '../../hooks/booking';

const HistoryPage = () => {
    const {
        bookings,
        loading,
        error,
        currentPage,
        totalPages,
        totalItems,
        statusFilter,
        handlePageChange,
        handleStatusFilter,
        refreshData,
        getStatusBadge,
        getStatusText,
        formatCurrency,
        formatDate,
        getStats
    } = useUserHistory();

    const toast = useToast();
    const stats = getStats();

    // Handle refresh
    const handleRefresh = () => {
        refreshData();
        toast({
            title: 'Data diperbarui',
            description: 'Riwayat peminjaman telah diperbarui',
            status: 'success',
            duration: 2000,
            isClosable: true
        });
    };

    return (
        <Box py={8}>
            <VStack spacing={6} align="stretch">
                <HistoryHeader
                    totalItems={totalItems}
                    statusFilter={statusFilter}
                    onStatusFilter={handleStatusFilter}
                    onRefresh={handleRefresh}
                />

                <HistoryTable
                    bookings={bookings}
                    loading={loading}
                    error={error}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onRefresh={handleRefresh}
                    getStatusBadge={getStatusBadge}
                    getStatusText={getStatusText}
                />
            </VStack>
        </Box>
    );
};

export default HistoryPage; 