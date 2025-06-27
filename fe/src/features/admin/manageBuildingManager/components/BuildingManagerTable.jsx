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
import { Users } from 'lucide-react';
import EmptyState from '@shared/components/EmptyState';
import PaginationControls from '@shared/components/PaginationControls';
import BuildingManagerTableRow from './BuildingManagerTableRow';

const BuildingManagerTable = ({
    managers = [],
    pagination = { currentPage: 1, totalPages: 1 },
    loading = false,
    onEditManager,
    onDeleteManager,
    onAssignBuilding,
    onPageChange
}) => {

    if (managers.length === 0) {
        return (
            <Box p={8}>
                <EmptyState
                    icon={Users}
                    title="Belum ada building manager"
                    description="Tambahkan building manager pertama untuk memulai"
                />
            </Box>
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
                                onAssign={onAssignBuilding}
                            />
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {onPageChange && pagination.totalPages > 1 && (
                <Box p={6} borderTop="1px" borderColor="gray.200">
                    <PaginationControls
                        currentPage={pagination.currentPage || 1}
                        totalPages={pagination.totalPages || 1}
                        onPageChange={onPageChange}
                    />
                </Box>
            )}
        </>
    );
};

export default BuildingManagerTable; 