import React, { useState } from 'react';
import {
    Box,
    Flex,
    useDisclosure,
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
    Badge,
    Input
} from '@chakra-ui/react';
import { History, Download, RefreshCw, Calendar, DollarSign } from 'lucide-react';

import { PrimaryButton } from '../../components/ui';
import { useAdminBookingHistory } from '../../hooks/booking';
import { DataStateHandler, PageHeader, PageWrapper } from '../../components/admin/common';
import { HistoryTable } from '../../components/admin/history';

const RiwayatPage = () => {
    // Modal controls
    const { isOpen: isRefundOpen, onOpen: onRefundOpen, onClose: onRefundClose } = useDisclosure();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [refundReason, setRefundReason] = useState('');

    // Custom hook for booking history
    const {
        bookings,
        loading,
        error,
        currentPage,
        totalPages,
        totalBookings,
        buildingFilter,
        startDateFilter,
        endDateFilter,
        actionLoading,
        handlePageChange,
        handleFilterChange,
        clearFilters,
        processRefund
    } = useAdminBookingHistory();

    // Handle refund
    const handleRefund = (booking) => {
        setSelectedBooking(booking);
        setRefundReason('');
        onRefundOpen();
    };

    const handleConfirmRefund = async () => {
        if (!selectedBooking || !refundReason.trim()) return;

        const success = await processRefund(selectedBooking.bookingId, refundReason);
        if (success) {
            onRefundClose();
            setSelectedBooking(null);
            setRefundReason('');
        }
    };



    return (
        <PageWrapper>
            {/* Page Header */}
            <PageHeader
                title="Riwayat Peminjaman"
                subtitle="Data historis semua peminjaman"
                icon={History}
            />

            {/* Filter Section */}
            <Box mb={6}>
                <VStack spacing={4} align="stretch">
                    {/* Building Filter */}
                    <HStack spacing={4} wrap="wrap">
                        <FormControl maxW="300px">
                            <FormLabel fontSize="sm" color="gray.600">Filter Gedung</FormLabel>
                            <Input
                                placeholder="Pilih gedung..."
                                value={buildingFilter}
                                onChange={(e) => handleFilterChange('building', e.target.value)}
                            />
                        </FormControl>

                        <FormControl maxW="200px">
                            <FormLabel fontSize="sm" color="gray.600">Tanggal Mulai</FormLabel>
                            <Input
                                type="date"
                                value={startDateFilter ?
                                    startDateFilter.split('-').reverse().join('-') : ''
                                }
                                onChange={(e) => {
                                    const date = e.target.value;
                                    if (date) {
                                        const [year, month, day] = date.split('-');
                                        const formattedDate = `${day}-${month}-${year}`;
                                        handleFilterChange('startDate', formattedDate);
                                    } else {
                                        handleFilterChange('startDate', '');
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl maxW="200px">
                            <FormLabel fontSize="sm" color="gray.600">Tanggal Akhir</FormLabel>
                            <Input
                                type="date"
                                value={endDateFilter ?
                                    endDateFilter.split('-').reverse().join('-') : ''
                                }
                                onChange={(e) => {
                                    const date = e.target.value;
                                    if (date) {
                                        const [year, month, day] = date.split('-');
                                        const formattedDate = `${day}-${month}-${year}`;
                                        handleFilterChange('endDate', formattedDate);
                                    } else {
                                        handleFilterChange('endDate', '');
                                    }
                                }}
                            />
                        </FormControl>


                    </HStack>

                    {/* Summary */}
                    <HStack spacing={4}>
                        <Text fontSize="sm" color="gray.600">
                            Total: <strong>{totalBookings}</strong> riwayat peminjaman
                        </Text>
                        {(buildingFilter || startDateFilter || endDateFilter) && (
                            <Badge colorScheme="blue" variant="subtle">
                                Filter Aktif
                            </Badge>
                        )}
                    </HStack>
                </VStack>
            </Box>

            {/* Content Section */}
            <DataStateHandler
                loading={loading}
                error={error}
                data={bookings}
                emptyMessage="Belum ada riwayat peminjaman"
                emptySearchMessage="Tidak ada riwayat yang sesuai dengan filter"
                loadingMessage="Memuat data riwayat..."
                isSearching={Boolean(buildingFilter || startDateFilter || endDateFilter)}
                EmptyIcon={History}
            >
                <HistoryTable
                    historyItems={bookings}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalBookings}
                    onPageChange={handlePageChange}
                    onRefund={handleRefund}
                />
            </DataStateHandler>

            {/* Refund Modal */}
            <Modal isOpen={isRefundOpen} onClose={onRefundClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack spacing={2}>
                            <DollarSign size={20} color="orange" />
                            <Text>Proses Refund</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedBooking && (
                            <VStack spacing={4} align="stretch">
                                <Alert status="warning">
                                    <AlertIcon />
                                    Anda akan memproses refund untuk peminjaman yang ditolak/dibatalkan.
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
                                            <Text fontSize="sm" color="gray.600">Status:</Text>
                                            <Badge colorScheme="red" variant="subtle">
                                                {selectedBooking.status === 'REJECTED' ? 'Ditolak' : 'Dibatalkan'}
                                            </Badge>
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
                                    </VStack>
                                </Box>

                                <FormControl isRequired>
                                    <FormLabel>Alasan Refund</FormLabel>
                                    <Textarea
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        placeholder="Masukkan alasan refund (misal: pembatalan karena force majeure, penolakan admin, dll)..."
                                        rows={4}
                                        resize="vertical"
                                    />
                                </FormControl>
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onRefundClose}>
                            Batal
                        </Button>
                        <Button
                            colorScheme="orange"
                            onClick={handleConfirmRefund}
                            isLoading={actionLoading}
                            loadingText="Memproses..."
                            leftIcon={<DollarSign size={16} />}
                            isDisabled={!refundReason.trim()}
                        >
                            Proses Refund
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </PageWrapper>
    );
};

export default RiwayatPage; 