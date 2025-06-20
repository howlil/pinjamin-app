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
    Textarea,
    VStack,
    Text,
    FormControl,
    FormLabel,
    Alert,
    AlertIcon,
    HStack,
    Badge
} from '@chakra-ui/react';
import { Calendar, Download, Check, X, AlertTriangle } from 'lucide-react';

import { PrimaryButton } from '@/components/ui';
import { useBookings } from '@/hooks/useBookings';
import { DataStateHandler, AdminSearchFilter, PageHeader, PageWrapper } from '@/components/admin/common';
import { BookingTable } from '@/components/admin/booking';

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
        cancelBooking
    } = useBookings();

    // Local state for UI interactions
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Modal states
    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isApprovalOpen, onOpen: onApprovalOpen, onClose: onApprovalClose } = useDisclosure();
    const { isOpen: isRejectionOpen, onOpen: onRejectionOpen, onClose: onRejectionClose } = useDisclosure();

    // Handle actions
    const handleView = (booking) => {
        setSelectedBooking(booking);
        onViewOpen();
    };

    const handleApprove = (booking) => {
        setSelectedBooking(booking);
        onApprovalOpen();
    };

    const handleReject = (booking) => {
        setSelectedBooking(booking);
        setRejectionReason('');
        onRejectionOpen();
    };

    const handleConfirmApproval = async () => {
        if (!selectedBooking) return;

        const success = await approveBooking(selectedBooking.bookingId);
        if (success) {
            onApprovalClose();
            setSelectedBooking(null);
        }
    };

    const handleConfirmRejection = async () => {
        if (!selectedBooking || !rejectionReason.trim()) return;

        const success = await rejectBooking(selectedBooking.bookingId, rejectionReason.trim());
        if (success) {
            onRejectionClose();
            setSelectedBooking(null);
            setRejectionReason('');
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
        <PageWrapper>
            {/* Page Header */}
            <PageHeader
                title="Kelola Peminjaman"
                subtitle="Manajemen peminjaman ruangan"
                icon={Calendar}
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
                    totalItems={totalBookings}
                    currentItems={bookings.length}
                    itemLabel="peminjaman"
                />
            </Box>

            {/* Content Section */}
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

            {/* Approval Confirmation Modal */}
            <Modal isOpen={isApprovalOpen} onClose={onApprovalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack spacing={2}>
                            <Check size={20} color="green" />
                            <Text>Konfirmasi Persetujuan</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedBooking && (
                            <VStack spacing={4} align="stretch">
                                <Alert status="info">
                                    <AlertIcon />
                                    Anda akan menyetujui peminjaman berikut:
                                </Alert>

                                <Box p={4} bg="gray.50" borderRadius="md">
                                    <VStack spacing={2} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Peminjam:</Text>
                                            <Text fontSize="sm" fontWeight="medium">{selectedBooking.borrowerName}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Gedung:</Text>
                                            <Text fontSize="sm" fontWeight="medium">{selectedBooking.buildingName}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Kegiatan:</Text>
                                            <Text fontSize="sm" fontWeight="medium">{selectedBooking.activityName}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Tanggal:</Text>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {selectedBooking.startDate}
                                                {selectedBooking.endDate && selectedBooking.endDate !== selectedBooking.startDate &&
                                                    ` - ${selectedBooking.endDate}`
                                                }
                                            </Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Waktu:</Text>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {selectedBooking.startTime} - {selectedBooking.endTime}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onApprovalClose}>
                            Batal
                        </Button>
                        <Button
                            colorScheme="green"
                            onClick={handleConfirmApproval}
                            isLoading={actionLoading}
                            loadingText="Menyetujui..."
                            leftIcon={<Check size={16} />}
                        >
                            Setujui Peminjaman
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Rejection Modal */}
            <Modal isOpen={isRejectionOpen} onClose={onRejectionClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack spacing={2}>
                            <X size={20} color="red" />
                            <Text>Tolak Peminjaman</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedBooking && (
                            <VStack spacing={4} align="stretch">
                                <Alert status="warning">
                                    <AlertIcon />
                                    Anda akan menolak peminjaman berikut. Berikan alasan penolakan:
                                </Alert>

                                <Box p={4} bg="gray.50" borderRadius="md">
                                    <VStack spacing={2} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Peminjam:</Text>
                                            <Text fontSize="sm" fontWeight="medium">{selectedBooking.borrowerName}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Gedung:</Text>
                                            <Text fontSize="sm" fontWeight="medium">{selectedBooking.buildingName}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color="gray.600">Kegiatan:</Text>
                                            <Text fontSize="sm" fontWeight="medium">{selectedBooking.activityName}</Text>
                                        </HStack>
                                    </VStack>
                                </Box>

                                <FormControl isRequired>
                                    <FormLabel>Alasan Penolakan</FormLabel>
                                    <Textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Masukkan alasan penolakan peminjaman..."
                                        rows={4}
                                        resize="vertical"
                                    />
                                </FormControl>
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onRejectionClose}>
                            Batal
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleConfirmRejection}
                            isLoading={actionLoading}
                            loadingText="Menolak..."
                            leftIcon={<X size={16} />}
                            isDisabled={!rejectionReason.trim()}
                        >
                            Tolak Peminjaman
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Other Modals would go here */}
            {/* 
            <BookingDetailModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                booking={selectedBooking}
            />
            */}
        </PageWrapper>
    );
};

export default PeminjamanPage;
