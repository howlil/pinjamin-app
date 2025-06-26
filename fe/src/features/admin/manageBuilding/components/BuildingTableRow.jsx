import React from 'react';
import {
    Tr,
    Td,
    HStack,
    Box,
    Text,
    Image,
    Badge,
    IconButton,
    Center
} from '@chakra-ui/react';
import { Eye, Edit2, Trash2, Building } from 'lucide-react';
import { COLORS } from '@utils/designTokens';

const getBuildingTypeLabel = (type) => {
    const labels = {
        'CLASSROOM': 'Classroom',
        'PKM': 'PKM',
        'LABORATORY': 'Laboratory',
        'MULTIFUNCTION': 'Multifunction',
        'SEMINAR': 'Seminar'
    };
    return labels[type] || type;
};

const getBuildingTypeBadgeColor = (type) => {
    const colors = {
        'CLASSROOM': 'blue',
        'PKM': 'green',
        'LABORATORY': 'purple',
        'MULTIFUNCTION': 'orange',
        'SEMINAR': 'pink'
    };
    return colors[type] || 'gray';
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const BuildingTableRow = ({ building, onView, onEdit, onDelete }) => {
    return (
        <Tr>
            <Td>
                <HStack spacing={3}>
                    <Box
                        w="60px"
                        h="60px"
                        borderRadius="12px"
                        overflow="hidden"
                        bg="gray.100"
                    >
                        {building.buildingPhoto ? (
                            <Image
                                src={building.buildingPhoto}
                                alt={building.buildingName}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                            />
                        ) : (
                            <Center w="100%" h="100%">
                                <Building size={24} color="gray.400" />
                            </Center>
                        )}
                    </Box>
                    <Box>
                        <Text fontWeight="semibold">
                            {building.buildingName}
                        </Text>
                        <Text fontSize="sm" color="gray.600"
                            maxW="200px"
                            noOfLines={1}>
                            {building.description || ''}
                        </Text>
                    </Box>
                </HStack>
            </Td>
            <Td>
                <Badge
                    colorScheme={getBuildingTypeBadgeColor(building.buildingType)}
                    borderRadius="full"
                    px={3}
                    py={1}
                >
                    {getBuildingTypeLabel(building.buildingType)}
                </Badge>
            </Td>

            <Td>
                <Text fontWeight="semibold" color={COLORS.primary}>
                    {formatCurrency(building.rentalPrice)}
                </Text>
            </Td>
            <Td>
                <Text fontSize="sm">{building.location}</Text>
            </Td>

            <Td>
                <HStack spacing={1}>
                    <IconButton
                        aria-label="View"
                        icon={<Eye size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => onView(building)}
                    />
                    <IconButton
                        aria-label="Edit"
                        icon={<Edit2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => onEdit(building)}
                    />
                    <IconButton
                        aria-label="Delete"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => onDelete(building)}
                    />
                </HStack>
            </Td>
        </Tr>
    );
};

export default BuildingTableRow;
