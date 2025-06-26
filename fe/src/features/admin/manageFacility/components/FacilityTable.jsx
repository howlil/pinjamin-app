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
import { Plus, Package } from 'lucide-react';
import { PrimaryButton } from '@shared/components/Button';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import FacilityTableRow from './FacilityTableRow';

const FacilityTable = ({
    facilities,
    pagination,
    currentPage,
    onAddFacility,
    onEditFacility,
    onDeleteFacility,
    onPageChange
}) => {
    if (facilities.length === 0) {
        return (
            <EmptyState
                icon={Package}
                title="Belum ada fasilitas"
                description="Tambahkan fasilitas pertama untuk memulai"
                action={
                    <PrimaryButton
                        leftIcon={<Plus size={20} />}
                        onClick={onAddFacility}
                    >
                        Tambah Fasilitas
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
                            <Th width="80px">Icon</Th>
                            <Th>Nama Fasilitas</Th>
                            <Th width="120px">Aksi</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {facilities.map((facility) => (
                            <FacilityTableRow
                                key={facility.id}
                                facility={facility}
                                onEdit={onEditFacility}
                                onDelete={onDeleteFacility}
                            />
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Box p={6} borderTop="1px" borderColor="gray.200">
                <PaginationControls
                    currentPage={pagination.currentPage || currentPage || 1}
                    totalPages={pagination.totalPages || 1}
                    onPageChange={onPageChange}
                />
            </Box>
        </>
    );
};

export default FacilityTable; 