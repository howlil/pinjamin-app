import React from 'react';
import {
    Tr,
    Td,
    HStack,
    Text,
    Badge,
    IconButton,
    Box
} from '@chakra-ui/react';
import { Edit2, Trash2, Building, Phone, UserCheck, UserX } from 'lucide-react';
import { COLORS } from '@utils/designTokens';

const BuildingManagerTableRow = ({ manager, onEdit, onDelete, onAssign }) => {
    const isAssigned = !!manager.buildingId;

    return (
        <Tr>
            <Td>
                <HStack spacing={3}>
                    <Box
                        w="40px"
                        h="40px"
                        bg={isAssigned ? "green.100" : "gray.100"}
                        borderRadius="12px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={isAssigned ? COLORS.primary : "gray.500"}
                    >
                        {isAssigned ? <UserCheck size={20} /> : <UserX size={20} />}
                    </Box>
                    <Box>
                        <Text fontWeight="semibold">
                            {manager.managerName}
                        </Text>
                        <HStack spacing={1} align="center">
                            <Phone size={14} color="gray" />
                            <Text fontSize="sm" color="gray.600">
                                {manager.phoneNumber}
                            </Text>
                        </HStack>
                    </Box>
                </HStack>
            </Td>
            <Td>
                {isAssigned && manager.building ? (
                    <HStack spacing={2}>
                        <Building size={16} color={COLORS.primary} />
                        <Text>{manager.building.buildingName}</Text>
                    </HStack>
                ) : (
                    <Badge colorScheme="gray" borderRadius="full">
                        Belum ditugaskan
                    </Badge>
                )}
            </Td>
            <Td>
                <Badge
                    colorScheme={isAssigned ? "green" : "yellow"}
                    borderRadius="full"
                    px={3}
                    py={1}
                >
                    {isAssigned ? "Aktif" : "Tersedia"}
                </Badge>
            </Td>
            <Td>
                <HStack spacing={1}>
                    <IconButton
                        aria-label="Assign"
                        icon={<Building size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => onAssign(manager)}
                        title={isAssigned ? "Ubah penugasan" : "Tugaskan ke gedung"}
                    />
                    <IconButton
                        aria-label="Edit"
                        icon={<Edit2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => onEdit(manager)}
                    />
                    <IconButton
                        aria-label="Delete"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onDelete(manager)}
                    />
                </HStack>
            </Td>
        </Tr>
    );
};

export default BuildingManagerTableRow; 