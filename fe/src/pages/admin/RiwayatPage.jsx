import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { History } from 'lucide-react';

import { GlassCard } from '@/components/ui';
import { useHistory } from '@/hooks/useHistory';
import { DataStateHandler, AdminSearchFilter } from '@/components/admin/common';
import { HistoryHeader, HistoryTable } from '@/components/admin/history';

// History status options for filter
const HISTORY_STATUS_OPTIONS = [
    { value: 'COMPLETED', label: 'Selesai' },
    { value: 'CANCELLED', label: 'Dibatalkan' },
    { value: 'REJECTED', label: 'Ditolak' }
];

// Date range options for filter
const DATE_RANGE_OPTIONS = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'quarter', label: 'Kuartal Ini' },
    { value: 'year', label: 'Tahun Ini' },
    { value: 'all', label: 'Semua Waktu' }
];

const RiwayatPage = () => {
    // Custom hook for all business logic
    const {
        historyItems,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalItems,
        statusFilter,
        dateFilter,
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        exportHistory,
        refreshData
    } = useHistory();

    // Handle actions
    const handleExport = async () => {
        const success = await exportHistory('excel');
        if (success) {
            // Could show additional feedback or download file
        }
    };

    const handleGenerateReport = () => {
        // Implementation for generating detailed reports
        console.log('Generate detailed report');
    };

    // Prepare filters for search component
    const filters = [
        {
            key: 'status',
            label: 'Status Akhir',
            value: statusFilter,
            options: HISTORY_STATUS_OPTIONS,
            onChange: (value) => handleFilterChange('status', value)
        },
        {
            key: 'date',
            label: 'Periode Waktu',
            value: dateFilter,
            options: DATE_RANGE_OPTIONS,
            onChange: (value) => handleFilterChange('date', value)
        }
    ];

    return (
        <Box>
            {/* Header Section */}
            <HistoryHeader
                onRefresh={refreshData}
                onExport={handleExport}
                onGenerateReport={handleGenerateReport}
            />

            {/* Search and Filter Section */}
            <AdminSearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                searchPlaceholder="Cari berdasarkan nama peminjam, gedung, atau kegiatan..."
                filters={filters}
                totalItems={totalItems}
                currentItems={historyItems.length}
                itemLabel="riwayat"
            />

            {/* Content Section */}
            <GlassCard p={6} mt={6}>
                <DataStateHandler
                    loading={loading}
                    error={error}
                    data={historyItems}
                    emptyMessage="Belum ada riwayat peminjaman"
                    emptySearchMessage="Tidak ada riwayat yang sesuai dengan pencarian"
                    loadingMessage="Memuat data riwayat..."
                    isSearching={Boolean(searchTerm || statusFilter || dateFilter)}
                    EmptyIcon={History}
                >
                    <HistoryTable
                        historyItems={historyItems}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                    />
                </DataStateHandler>
            </GlassCard>
        </Box>
    );
};

export default RiwayatPage; 