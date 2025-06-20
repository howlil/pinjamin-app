import { Box, Container, VStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { HistoryHeader, HistoryTable } from '@/components/user/history';
import { useUserHistory } from '@/hooks/useUserHistory';

const HistoryPage = () => {
    const {
        borrowHistory,
        loading,
        error,
        getStatusBadge,
        getStatusText,
        formatCurrency,
        formatDate,
        getStats,
        refetch
    } = useUserHistory();

    const toast = useToast();
    const stats = getStats();

    // Handle refresh
    const handleRefresh = () => {
        refetch();
        toast({
            title: 'Data diperbarui',
            description: 'Riwayat peminjaman telah diperbarui',
            status: 'success',
            duration: 2000,
            isClosable: true
        });
    };

    // Handle export
    const handleExport = () => {
        // Simulate export functionality
        toast({
            title: 'Export berhasil',
            description: 'Data riwayat telah diekspor ke CSV',
            status: 'success',
            duration: 3000,
            isClosable: true
        });
    };

    // Handle generate report
    const handleGenerateReport = () => {
        // Simulate report generation
        toast({
            title: 'Laporan dihasilkan',
            description: 'Laporan riwayat peminjaman telah dibuat',
            status: 'success',
            duration: 3000,
            isClosable: true
        });
    };

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={6} align="stretch">
                    <HistoryHeader
                        stats={stats}
                        formatCurrency={formatCurrency}
                        onRefresh={handleRefresh}
                        onExport={handleExport}
                        onGenerateReport={handleGenerateReport}
                    />

                    <HistoryTable
                        data={borrowHistory}
                        loading={loading}
                        error={error}
                        getStatusBadge={getStatusBadge}
                        getStatusText={getStatusText}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                    />
                </VStack>
            </Container>
        </Box>
    );
};

export default HistoryPage; 