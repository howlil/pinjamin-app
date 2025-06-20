import React from 'react';
import {
    VStack,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    Select,
    Wrap,
    WrapItem,
    Box
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { COLORS } from '@/utils/designTokens';

const AdminSearchFilter = ({
    searchTerm,
    onSearchChange,
    onSearch,
    searchPlaceholder = "Cari data...",
    filters = [], // Array of filter objects: { key, label, value, options, onChange }
    totalItems = 0,
    currentItems = 0,
    itemLabel = "item"
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                {/* Search and Filters Row */}
                <Wrap spacing={4} align="center">
                    {/* Search Input */}
                    <WrapItem flex={1} minW="250px">
                        <InputGroup w="full">
                            <InputLeftElement>
                                <Search size={18} color={COLORS.gray[500]} />
                            </InputLeftElement>
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyPress={handleKeyPress}
                                bg="gray.50"
                                borderColor={`${COLORS.primary}20`}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`,
                                    bg: "white"
                                }}
                                borderRadius="full"
                            />
                        </InputGroup>
                    </WrapItem>

                    {/* Filter Selects */}
                    {filters.map((filter) => (
                        <WrapItem key={filter.key} minW="180px">
                            <Select
                                placeholder={filter.label}
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                bg="gray.50"
                                borderColor={`${COLORS.primary}20`}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`,
                                    bg: "white"
                                }}
                                borderRadius="full"
                                size="md"
                            >
                                {filter.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </WrapItem>
                    ))}
                </Wrap>

            </VStack>
        </Box>
    );
};

export default AdminSearchFilter; 