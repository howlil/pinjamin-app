import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { PrimaryButton } from '@shared/components/Button';
import LoadingSkeleton from '@shared/components/LoadingSkeleton';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import { Building } from 'lucide-react';
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
        return <LoadingSkeleton />;
    }

    if (buildings.length === 0) {
        return (
            <EmptyState
                icon={Building}
                title="Belum ada gedung"
                description="Tambahkan gedung pertama untuk memulai"
                action={
                    <PrimaryButton
                        leftIcon={<Plus size={20} />}
                        onClick={onAddBuilding}
                    >
                        Tambah Gedung
                    </PrimaryButton>
                }
            />
        );
    }

    return (
        <>
            <TableContainer>
                <Table variant="simple">
                    <Thead bg="green.50">
                        <Tr>
                            <Th>Gedung</Th>
                            <Th>Tipe</Th>
                            <Th>Harga Sewa</Th>
                            <Th>Lokasi</Th>
                            <Th width="120px">Aksi</Th>
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

            <Box p={6} borderTop="1px" borderColor="gray.200">
                <PaginationControls
                    currentPage={pagination.currentPage || pagination.page || 1}
                    totalPages={pagination.totalPages || 1}
                    onPageChange={onPageChange}
                />
            </Box>
        </>
    );
};

export default BuildingTable;
