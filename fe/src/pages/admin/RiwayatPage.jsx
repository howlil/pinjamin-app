import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { History, Download } from 'lucide-react';

import { PrimaryButton } from '@/components/ui';
import { useHistory } from '@/hooks/useHistory';
import { DataStateHandler, AdminSearchFilter, PageHeader, PageWrapper } from '@/components/admin/common';
import { HistoryTable } from '@/components/admin/history';

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
        exportHistory
    } = useHistory();

    // Handle actions
    const handleExport = async () => {
        const success = await exportHistory('excel');
        if (success) {
            // Could show additional feedback or download file
        }
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
        <PageWrapper>
            {/* Page Header */}
            <PageHeader
                title="Riwayat Peminjaman"
                subtitle="Data historis semua peminjaman"
                icon={History}
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
                    searchPlaceholder="Cari berdasarkan nama peminjam, gedung, atau kegiatan..."
                    filters={filters}
                    totalItems={totalItems}
                    currentItems={historyItems.length}
                    itemLabel="riwayat"
                />
            </Box>

            {/* Content Section */}
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
        </PageWrapper>
    );
};

export default RiwayatPage; 