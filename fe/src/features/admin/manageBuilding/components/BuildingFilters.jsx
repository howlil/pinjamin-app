import React from 'react';
import {
    Box,
    HStack,
    VStack,
    Select,
    Text
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import Input from '@shared/components/Input';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';

const BUILDING_TYPES = [
    { value: 'CLASSROOM', label: 'Classroom' },
    { value: 'PKM', label: 'PKM' },
    { value: 'LABORATORY', label: 'Laboratory' },
    { value: 'MULTIFUNCTION', label: 'Multifunction' },
    { value: 'SEMINAR', label: 'Seminar' }
];

const BuildingFilters = ({ filters, onSearchChange, onTypeFilterChange }) => {
    return (
        <Box
            bg="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(15px)"
            borderRadius={`${CORNER_RADIUS.components.cards}px`}
            border="1px solid rgba(215, 215, 215, 0.5)"
            p={6}
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
        >
            <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center">
                    <Text
                        fontSize="md"
                        fontWeight="600"
                        color={COLORS.text}
                        fontFamily="Inter, sans-serif"
                    >
                        Filter & Pencarian
                    </Text>

                    {(filters.search || filters.buildingType) && (
                        <Text
                            fontSize="sm"
                            color={COLORS.primary}
                            fontFamily="Inter, sans-serif"
                            fontWeight="500"
                        >
                            {filters.search && filters.buildingType
                                ? `Mencari "${filters.search}" pada tipe ${BUILDING_TYPES.find(t => t.value === filters.buildingType)?.label}`
                                : filters.search
                                    ? `Mencari "${filters.search}"`
                                    : `Filter: ${BUILDING_TYPES.find(t => t.value === filters.buildingType)?.label}`
                            }
                        </Text>
                    )}
                </HStack>

                <HStack spacing={4} align="end">
                    <VStack spacing={2} align="start" flex={1}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.600"
                            fontFamily="Inter, sans-serif"
                        >
                            Cari Gedung
                        </Text>
                        <Input
                            placeholder="Cari nama gedung..."
                            value={filters.search || ''}
                            onChange={onSearchChange}
                            leftIcon={<Search size={20} />}
                            bg="rgba(255, 255, 255, 0.8)"
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.9)",
                                borderColor: COLORS.primary
                            }}
                            _focus={{
                                bg: "rgba(255, 255, 255, 0.95)",
                                borderColor: COLORS.primary,
                                boxShadow: `0 0 0 1px ${COLORS.primary}`,
                            }}
                        />
                    </VStack>

                    <VStack spacing={2} align="start" minW="240px">
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.600"
                            fontFamily="Inter, sans-serif"
                        >
                            Tipe Gedung
                        </Text>
                        <Select
                            placeholder="Semua Tipe"
                            value={filters.buildingType || ''}
                            onChange={onTypeFilterChange}
                            bg="rgba(255, 255, 255, 0.8)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            borderRadius={`${CORNER_RADIUS.components.input}px`}
                            h="48px"
                            fontFamily="Inter, sans-serif"
                            fontWeight="500"
                            color={COLORS.text}
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.9)",
                                borderColor: COLORS.primary
                            }}
                            _focus={{
                                bg: "rgba(255, 255, 255, 0.95)",
                                borderColor: COLORS.primary,
                                boxShadow: `0 0 0 1px ${COLORS.primary}`,
                            }}
                        >
                            {BUILDING_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </Select>
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
};

export default BuildingFilters;
