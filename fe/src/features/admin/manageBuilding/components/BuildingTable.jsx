import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    VStack,
    Center,
    Spinner,
    Text
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { PrimaryButton } from '@shared/components/Button';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import { Building } from 'lucide-react';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';
import BuildingTableRow from './BuildingTableRow';

const BuildingTable = ({
    buildings,
    loading,
    pagination,
    onView,
    onEdit,
    onDelete,
    onAddBuilding,
    onPageChange
}) => {
    if (loading) {
        return (
            <VStack spacing={6} align="stretch">
                <Box p={8}>
                    <Center>
                        <VStack spacing={4}>
                            <Spinner size="lg" color={COLORS.primary} thickness="3px" />
                            <Text color="gray.600" fontFamily="Inter, sans-serif">
                                Memuat data gedung...
                            </Text>
                        </VStack>
                    </Center>
                </Box>
            </VStack>
        );
    }

    if (buildings.length === 0) {
        return (
            <Box p={8}>
                <EmptyState
                    icon={Building}
                    title="Belum ada gedung"
                    description="Tambahkan gedung pertama untuk memulai"
                    action={
                        <PrimaryButton
                            leftIcon={<Plus size={20} />}
                            onClick={onAddBuilding}
                            fontFamily="Inter, sans-serif"
                        >
                            Tambah Gedung
                        </PrimaryButton>
                    }
                />
            </Box>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr bg="rgba(33, 209, 121, 0.05)">
                            <Th
                                color={COLORS.primary}
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                fontFamily="Inter, sans-serif"
                            >
                                Gedung
                            </Th>
                            <Th
                                color={COLORS.primary}
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                fontFamily="Inter, sans-serif"
                            >
                                Tipe
                            </Th>
                            <Th
                                color={COLORS.primary}
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                fontFamily="Inter, sans-serif"
                            >
                                Harga Sewa
                            </Th>
                            <Th
                                color={COLORS.primary}
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                fontFamily="Inter, sans-serif"
                            >
                                Lokasi
                            </Th>
                            <Th
                                color={COLORS.primary}
                                fontWeight="700"
                                fontSize="sm"
                                textTransform="none"
                                py={4}
                                borderColor="rgba(215, 215, 215, 0.3)"
                                fontFamily="Inter, sans-serif"
                                width="120px"
                                textAlign="center"
                            >
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {buildings.map((building) => (
                            <BuildingTableRow
                                key={building.id}
                                building={building}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <PaginationControls
                    currentPage={pagination.currentPage || pagination.page || 1}
                    totalPages={pagination.totalPages || 1}
                    totalItems={pagination.totalItems || pagination.total}
                    itemsPerPage={pagination.itemsPerPage || pagination.limit}
                    onPageChange={onPageChange}
                />
            )}
        </VStack>
    );
};

export default BuildingTable;
