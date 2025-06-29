import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Text,
    Center,
    Spinner,
    VStack
} from '@chakra-ui/react';
import { Users } from 'lucide-react';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import BorrowerTableRow from './BorrowerTableRow';

const BorrowerTable = ({
    bookings = [],
    loading = false,
    pagination = {},
    onPageChange,
    onApprove,
    onReject,
    onRefund,
    onViewDetail
}) => {
    if (loading) {
        return (
            <Box
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                p={8}
            >
                <Center>
                    <Spinner size="lg" color="#21D179" thickness="3px" />
                </Center>
            </Box>
        );
    }

    if (bookings.length === 0) {
        return (
            <Box
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                p={8}
            >
                <EmptyState
                    icon={Users}
                    title="Tidak ada data peminjaman"
                    description="Belum ada peminjaman yang perlu dikelola"
                />
            </Box>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            <Box
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                overflow="hidden"
            >
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr bg="rgba(33, 209, 121, 0.05)">
                                <Th
                                    color="#21D179"
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                >
                                    Peminjam
                                </Th>
                                <Th
                                    color="#21D179"
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                >
                                    Gedung
                                </Th>
                                <Th
                                    color="#21D179"
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                >
                                    Kegiatan
                                </Th>
                                <Th
                                    color="#21D179"
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                >
                                    Tanggal & Waktu
                                </Th>
                                <Th
                                    color="#21D179"
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    textAlign="center"
                                >
                                    Status
                                </Th>
                                <Th
                                    color="#21D179"
                                    fontWeight="700"
                                    fontSize="sm"
                                    textTransform="none"
                                    py={4}
                                    borderColor="rgba(215, 215, 215, 0.3)"
                                    textAlign="center"
                                    width="200px"
                                >
                                    Aksi
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bookings.map((booking) => (
                                <BorrowerTableRow
                                    key={booking.bookingId}
                                    booking={booking}
                                    onApprove={onApprove}
                                    onReject={onReject}
                                    onRefund={onRefund}
                                    onViewDetail={onViewDetail}
                                />
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={onPageChange}
                />
            )}
        </VStack>
    );
};

export default BorrowerTable; 