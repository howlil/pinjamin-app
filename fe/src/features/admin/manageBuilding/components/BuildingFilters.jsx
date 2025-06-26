import React from 'react';
import {
    Box,
    HStack,
    Select
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import Input from '@shared/components/Input';

const BUILDING_TYPES = [
    { value: 'CLASSROOM', label: 'Classroom' },
    { value: 'PKM', label: 'PKM' },
    { value: 'LABORATORY', label: 'Laboratory' },
    { value: 'MULTIFUNCTION', label: 'Multifunction' },
    { value: 'SEMINAR', label: 'Seminar' }
];

const BuildingFilters = ({ filters, onSearchChange, onTypeFilterChange }) => {
    return (
        <Box bg="white" p={6} borderRadius="24px" boxShadow="sm">
            <HStack spacing={4}>
                <Box flex={1}>
                    <Input
                        placeholder="Cari nama gedung..."
                        value={filters.search || ''}
                        onChange={onSearchChange}
                        leftIcon={<Search size={20} />}
                    />
                </Box>
                <Box minW="200px">
                    <Select
                        placeholder="Semua Tipe"
                        value={filters.buildingType || ''}
                        onChange={onTypeFilterChange}
                        bg="rgba(255, 255, 255, 0.6)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        borderRadius="9999px"
                        h="48px"
                    >
                        {BUILDING_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </Select>
                </Box>
            </HStack>
        </Box>
    );
};

export default BuildingFilters;
