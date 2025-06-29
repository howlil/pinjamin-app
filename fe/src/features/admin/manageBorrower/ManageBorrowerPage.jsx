import React, { useState, useCallback } from 'react';
import {
    Container,
    VStack,
    HStack,
    Text,
    useDisclosure,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorState from '@shared/components/ErrorState';
import BookingDetailModal from '@shared/components/BookingDetailModal';
import BorrowerTable from './components/BorrowerTable';
import ApprovalModal from './components/ApprovalModal';
import {
    usePendingBookings,
    useBookingApproval
} from './api/useBorrowerManagement';

const ManageBorrowerPage = () => {
    // Modal state
    const { isOpen: isApprovalOpen, onOpen: onApprovalOpen, onClose: onApprovalClose } = useDisclosure();
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
    const [modalConfig, setModalConfig] = useState({ type: '', booking: null });
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Hooks
    const {
        bookings: pendingBookings,
        loading: pendingLoading,
        error: pendingError,
        pagination: pendingPagination,
        refresh,
        handlePageChange
    } = usePendingBookings();

    const { approveBooking, loading: approvalLoading } = useBookingApproval();

    // Action handlers
    const handleApprove = useCallback((booking) => {
        setModalConfig({ type: 'approve', booking });
        onApprovalOpen();
    }, [onApprovalOpen]);

    const handleReject = useCallback((booking) => {
        setModalConfig({ type: 'reject', booking });
        onApprovalOpen();
    }, [onApprovalOpen]);

    const handleRefund = useCallback((booking) => {
        setModalConfig({ type: 'refund', booking });
        onApprovalOpen();
    }, [onApprovalOpen]);

    const handleViewDetail = useCallback((booking) => {
        setSelectedBooking(booking);
        onDetailOpen();
    }, [onDetailOpen]);

    const handleModalConfirm = async (bookingId, data) => {
        try {
            if (modalConfig.type === 'approve' || modalConfig.type === 'reject') {
                await approveBooking(bookingId, data);
                // Refresh data setelah approval
                refresh();
            } else if (modalConfig.type === 'refund') {
                // Mock refund processing for now
                console.log('Refund processed:', bookingId, data);
                toast.success('Refund berhasil diproses');
                refresh();
            }
        } catch (error) {
            console.error('Error processing action:', error);
        }
    };

    const handleRefresh = useCallback(() => {
        refresh();
    }, [refresh]);

    if (pendingError) {
        return (
            <Container maxW="7xl" py={8}>
                <ErrorState
                    title="Error Loading Data"
                    description={pendingError}
                    onRetry={handleRefresh}
                />
            </Container>
        );
    }

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={6} align="stretch">


                {/* Table */}
                <BorrowerTable
                    bookings={pendingBookings}
                    loading={pendingLoading}
                    pagination={pendingPagination}
                    onPageChange={handlePageChange}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRefund={handleRefund}
                    onViewDetail={handleViewDetail}
                />
            </VStack>

            {/* Approval Modal */}
            <ApprovalModal
                isOpen={isApprovalOpen}
                onClose={onApprovalClose}
                booking={modalConfig.booking}
                type={modalConfig.type}
                loading={approvalLoading}
                onConfirm={handleModalConfirm}
            />

            {/* Detail Modal */}
            <BookingDetailModal
                isOpen={isDetailOpen}
                onClose={onDetailClose}
                booking={selectedBooking}
            />
        </Container>
    );
};

export default ManageBorrowerPage; 