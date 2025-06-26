import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
 
} from '@chakra-ui/react';
import { Plus, Users } from 'lucide-react';
import { PrimaryButton } from '@shared/components/Button';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import BuildingManagerTableRow from './BuildingManagerTableRow';

const BuildingManagerTable = ({
    managers,
    pagination,
    currentPage,
    onAddManager,
    onEditManager,
    onDeleteManager,
    onAssignManager,
    onPageChange
}) => {

    if (managers.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title="Belum ada building manager"
                description="Tambahkan building manager pertama untuk memulai"
                action={
                    <PrimaryButton
                        leftIcon={<Plus size={20} />}
                        onClick={onAddManager}
                    >
                        Tambah Building Manager
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
                            <Th>Manager</Th>
                            <Th>Gedung</Th>
                            <Th>Status</Th>
                            <Th width="140px">Aksi</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {managers.map((manager) => (
                            <BuildingManagerTableRow
                                key={manager.id}
                                manager={manager}
                                onEdit={onEditManager}
                                onDelete={onDeleteManager}
                                onAssign={onAssignManager}
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

export default BuildingManagerTable; 