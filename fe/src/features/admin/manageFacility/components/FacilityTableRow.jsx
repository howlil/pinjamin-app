import React from 'react';
import {
    Tr,
    Td,
    HStack,
    Text,
    Center,
    IconButton
} from '@chakra-ui/react';
import { Edit2, Trash2 } from 'lucide-react';
import FacilityIcon from './FacilityIcon';

const FacilityTableRow = ({ facility, onEdit, onDelete }) => {
    return (
        <Tr>
            <Td>
                <Center>
                    <FacilityIcon iconName={facility.iconUrl} />
                </Center>
            </Td>
            <Td>
                <Text fontWeight="medium">
                    {facility.facilityName}
                </Text>
            </Td>
            <Td>
                <HStack spacing={1}>
                    <IconButton
                        aria-label="Edit"
                        icon={<Edit2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => onEdit(facility)}
                    />
                    <IconButton
                        aria-label="Delete"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onDelete(facility)}
                    />
                </HStack>
            </Td>
        </Tr>
    );
};

export default FacilityTableRow; 