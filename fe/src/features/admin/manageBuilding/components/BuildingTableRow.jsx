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

const getBuildingTypeBadgeConfig = (type) => {
    const configs = {
        'CLASSROOM': {
            color: 'blue.600',
            bg: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)'
        },
        'PKM': {
            color: 'green.600',
            bg: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)'
        },
        'LABORATORY': {
            color: 'purple.600',
            bg: 'rgba(147, 51, 234, 0.1)',
            borderColor: 'rgba(147, 51, 234, 0.3)'
        },
        'MULTIFUNCTION': {
            color: 'orange.600',
            bg: 'rgba(249, 115, 22, 0.1)',
            borderColor: 'rgba(249, 115, 22, 0.3)'
        },
        'SEMINAR': {
            color: 'pink.600',
            bg: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'rgba(236, 72, 153, 0.3)'
        }
    };
    return configs[type] || {
        color: 'gray.600',
        bg: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgba(107, 114, 128, 0.3)'
    };
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
    const badgeConfig = getBuildingTypeBadgeConfig(building.buildingType);

    return (
        <Tr
            _hover={{
                bg: "rgba(33, 209, 121, 0.02)",
                transform: "translateX(2px)"
            }}
            transition="all 0.2s ease"
        >
            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <HStack spacing={3}>
                    <Box
                        w="60px"
                        h="60px"
                        borderRadius="12px"
                        overflow="hidden"
                        bg="rgba(248, 250, 252, 0.8)"
                        border="1px solid rgba(215, 215, 215, 0.3)"
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
                        <Text
                            fontWeight="600"
                            color={COLORS.text}
                            fontFamily="Inter, sans-serif"
                            fontSize="sm"
                            mb={1}
                        >
                            {building.buildingName}
                        </Text>
                        <Text
                            fontSize="xs"
                            color="gray.600"
                            maxW="200px"
                            noOfLines={1}
                            fontFamily="Inter, sans-serif"
                        >
                            {building.description || 'Tidak ada deskripsi'}
                        </Text>
                    </Box>
                </HStack>
            </Td>

            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <Box
                    bg={badgeConfig.bg}
                    border="1px solid"
                    borderColor={badgeConfig.borderColor}
                    borderRadius="20px"
                    px={3}
                    py={1}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    backdropFilter="blur(10px)"
                >
                    <Text
                        fontSize="xs"
                        fontWeight="600"
                        color={badgeConfig.color}
                        fontFamily="Inter, sans-serif"
                    >
                        {getBuildingTypeLabel(building.buildingType)}
                    </Text>
                </Box>
            </Td>

            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <Text
                    fontWeight="700"
                    color={COLORS.primary}
                    fontFamily="Inter, sans-serif"
                    fontSize="sm"
                >
                    {formatCurrency(building.rentalPrice)}
                </Text>
            </Td>

            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <Text
                    fontSize="sm"
                    color={COLORS.text}
                    fontFamily="Inter, sans-serif"
                    fontWeight="500"
                >
                    {building.location}
                </Text>
            </Td>

            <Td
                borderColor="rgba(215, 215, 215, 0.3)"
                py={4}
            >
                <HStack spacing={1} justify="center">
                    <IconButton
                        aria-label="View"
                        icon={<Eye size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        borderRadius="8px"
                        _hover={{
                            bg: "rgba(59, 130, 246, 0.1)",
                            transform: "translateY(-1px)"
                        }}
                        _active={{
                            transform: "translateY(0)"
                        }}
                        transition="all 0.2s ease"
                        onClick={() => onView(building)}
                    />
                    <IconButton
                        aria-label="Edit"
                        icon={<Edit2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        borderRadius="8px"
                        _hover={{
                            bg: "rgba(34, 197, 94, 0.1)",
                            transform: "translateY(-1px)"
                        }}
                        _active={{
                            transform: "translateY(0)"
                        }}
                        transition="all 0.2s ease"
                        onClick={() => onEdit(building)}
                    />
                    <IconButton
                        aria-label="Delete"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        borderRadius="8px"
                        _hover={{
                            bg: "rgba(239, 68, 68, 0.1)",
                            transform: "translateY(-1px)"
                        }}
                        _active={{
                            transform: "translateY(0)"
                        }}
                        transition="all 0.2s ease"
                        onClick={() => onDelete(building)}
                    />
                </HStack>
            </Td>
        </Tr>
    );
};

export default BuildingTableRow;
