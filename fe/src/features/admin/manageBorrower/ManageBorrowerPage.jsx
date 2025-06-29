import React, { useState } from 'react';
import {
    Box,
    VStack,
    Spinner,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { H1, H3 } from '@shared/components/Typography';
import { usePendingBookings, useBookingApproval } from './api/usePendingBookings';
import BorrowerTable from './components/BorrowerTable';
import ApprovalModal from './components/ApprovalModal';
import BookingDetailModal from '@shared/components/BookingDetailModal';

const ManageBorrowerPage = () => {
    const [modalConfig, setModalConfig] = useState({ type: null, booking: null });

    const {
        bookings,
        loading: bookingsLoading,
        error: bookingsError,
        refetch: refetchBookings
    } = usePendingBookings();

    const { approveOrRejectBooking, loading: approvalLoading } = useBookingApproval();

    const handleApprove = (booking) => {
        setModalConfig({ type: 'approve', booking });
    };

    const handleReject = (booking) => {
        setModalConfig({ type: 'reject', booking });
    };

    const handleViewDetail = (booking) => {
        setModalConfig({ type: 'detail', booking });
    };

    const handleConfirmAction = async (bookingId, data) => {
        try {
            if (modalConfig.type === 'approve') {
                await approveOrRejectBooking(bookingId, {
                    bookingStatus: 'APPROVED',
                    adminNotes: data.reason || ''
                });
            } else if (modalConfig.type === 'reject') {
                await approveOrRejectBooking(bookingId, {
                    bookingStatus: 'REJECTED',
                    adminNotes: data.reason || ''
                });
            }

            setModalConfig({ type: null, booking: null });
            refetchBookings(); // Refresh data after action
        } catch (error) {
            console.error('Error processing booking:', error);
        }
    };

    const handleCloseModal = () => {
        setModalConfig({ type: null, booking: null });
    };

    return (
        <Box px={{ base: 4, md: 6, lg: 8 }} py={8} minH="100vh">
            <Box maxW="1200px" mx="auto">
                <VStack spacing={6} align="stretch">
                    {/* Header */}
                    <VStack spacing={2} align="start">
                        <H1 fontSize="2xl" fontWeight="700" color="#2A2A2A">
                            Kelola Peminjam
                        </H1>
                        <H3 fontSize="md" color="#2A2A2A" opacity={0.7} fontWeight="400">
                            Kelola persetujuan peminjaman gedung
                        </H3>
                    </VStack>

                    <VStack spacing={6} align="stretch">
                        {bookingsError && (
                            <Alert status="error" borderRadius="16px">
                                <AlertIcon />
                                {bookingsError}
                            </Alert>
                        )}

                        {bookingsLoading ? (
                            <Box display="flex" justifyContent="center" py={12}>
                                <Spinner size="lg" color="#21D179" thickness="3px" />
                            </Box>
                        ) : (
                            <BorrowerTable
                                bookings={bookings}
                                loading={bookingsLoading}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onViewDetail={handleViewDetail}
                            />
                        )}
                    </VStack>
                </VStack>
            </Box>

            {/* Approval/Rejection Modal */}
            {(modalConfig.type === 'approve' || modalConfig.type === 'reject') && (
                <ApprovalModal
                    isOpen={true}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmAction}
                    booking={modalConfig.booking}
                    type={modalConfig.type}
                    loading={approvalLoading}
                />
            )}

            {/* Detail Modal */}
            {modalConfig.type === 'detail' && (
                <BookingDetailModal
                    isOpen={true}
                    onClose={handleCloseModal}
                    booking={modalConfig.booking}
                />
            )}
        </Box>
    );
};

export default ManageBorrowerPage; 