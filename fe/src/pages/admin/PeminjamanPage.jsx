import React, { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';

import { GlassCard } from '@/components/ui';
import { useBookings } from '@/hooks/useBookings';
import { DataStateHandler, AdminSearchFilter } from '@/components/admin/common';
import { BookingHeader, BookingTable } from '@/components/admin/booking';

// Booking status options for filter
const BOOKING_STATUS_OPTIONS = [
    { value: 'PROCESSING', label: 'Diproses' },
    { value: 'APPROVED', label: 'Disetujui' },
    { value: 'REJECTED', label: 'Ditolak' },
    { value: 'COMPLETED', label: 'Selesai' },
    { value: 'CANCELLED', label: 'Dibatalkan' }
];

const PeminjamanPage = () => {
    // Custom hook for all business logic
    const {
        bookings,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalBookings,
        actionLoading,
        statusFilter,
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        approveBooking,
        rejectBooking,
        completeBooking,
        cancelBooking,
        refreshData
    } = useBookings();

    // Local state for UI interactions
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Modal states - implement these later with specific modals
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

    // Handle actions
    const handleView = (booking) => {
        setSelectedBooking(booking);
        onViewOpen();
    };

    const handleApprove = async (booking) => {
        const success = await approveBooking(booking.id);
        if (success) {
            // Could show success feedback
        }
    };

    const handleReject = async (booking) => {
        // This would open a rejection modal in a real implementation
        const reason = 'Admin rejected the booking';
        const success = await rejectBooking(booking.id, reason);
        if (success) {
            // Could show success feedback
        }
    };

    const handleComplete = async (booking) => {
        const success = await completeBooking(booking.id);
        if (success) {
            // Could show success feedback
        }
    };

    const handleCancel = async (booking) => {
        // This would open a cancellation modal in a real implementation
        const reason = 'Admin cancelled the booking';
        const success = await cancelBooking(booking.id, reason);
        if (success) {
            // Could show success feedback
        }
    };

    const handleExport = () => {
        // Implementation for exporting booking data
        console.log('Export bookings');
    };

    const handleViewCalendar = () => {
        // Implementation for viewing calendar
        console.log('View calendar');
    };

    // Prepare filters for search component
    const filters = [
        {
            key: 'status',
            label: 'Status Peminjaman',
            value: statusFilter,
            options: BOOKING_STATUS_OPTIONS,
            onChange: (value) => handleFilterChange('status', value)
        }
    ];

    return (
        <Box>
            {/* Header Section */}
            <BookingHeader
                onRefresh={refreshData}
                onExport={handleExport}
                onViewCalendar={handleViewCalendar}
            />

            {/* Search and Filter Section */}
            <AdminSearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                searchPlaceholder="Cari berdasarkan nama peminjam, gedung, atau kegiatan..."
                filters={filters}
                totalItems={totalBookings}
                currentItems={bookings.length}
                itemLabel="peminjaman"
            />

            {/* Content Section */}
            <GlassCard p={6} mt={6}>
                <DataStateHandler
                    loading={loading}
                    error={error}
                    data={bookings}
                    emptyMessage="Belum ada data peminjaman"
                    emptySearchMessage="Tidak ada peminjaman yang sesuai dengan pencarian"
                    loadingMessage="Memuat data peminjaman..."
                    isSearching={Boolean(searchTerm || statusFilter)}
                    EmptyIcon={Calendar}
                >
                    <BookingTable
                        bookings={bookings}
                        onView={handleView}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalBookings}
                        onPageChange={handlePageChange}
                    />
                </DataStateHandler>
            </GlassCard>

            {/* Modals would go here */}
            {/* 
            <BookingDetailModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                booking={selectedBooking}
            />
            */}
        </Box>
    );
};

export default PeminjamanPage;
