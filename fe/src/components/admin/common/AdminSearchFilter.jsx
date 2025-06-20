import React from 'react';
import {
    VStack,
    HStack,
    Input,
    Button,
    InputGroup,
    InputLeftElement,
    Text,
    Select,
    Wrap,
    WrapItem
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { GlassCard } from '@/components/ui';
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
        <GlassCard p={6}>
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
                                bg="white"
                                borderColor={`${COLORS.primary}30`}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`
                                }}
                                borderRadius="lg"
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
                                bg="white"
                                borderColor={`${COLORS.primary}30`}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`
                                }}
                                borderRadius="lg"
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

                    {/* Search Button */}
                    <WrapItem>
                        <Button
                            onClick={onSearch}
                            bg={COLORS.primary}
                            color="white"
                            leftIcon={<Search size={16} />}
                            borderRadius="lg"
                            _hover={{
                                bg: COLORS.primaryDark,
                                transform: 'translateY(-1px)'
                            }}
                            transition="all 0.2s"
                        >
                            Cari
                        </Button>
                    </WrapItem>
                </Wrap>

                {/* Results Summary */}
                <HStack justify="space-between" align="center" pt={2}>
                    <Text color={COLORS.gray[600]} fontSize="sm">
                        Menampilkan {currentItems} dari {totalItems} {itemLabel}
                    </Text>
                    <Text color={COLORS.primary} fontSize="sm" fontWeight="medium">
                        Total: {totalItems} {itemLabel}
                    </Text>
                </HStack>
            </VStack>
        </GlassCard>
    );
};

export default AdminSearchFilter; 