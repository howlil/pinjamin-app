import React from 'react';
import {
    VStack,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    Box
} from '@chakra-ui/react';
import { Search, Settings } from 'lucide-react';
import { COLORS } from '@/utils/designTokens';

const FacilitySearchBar = ({
    searchTerm,
    onSearchChange,
    onSearch,
    totalItems = 0,
    currentItems = 0
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                <InputGroup>
                    <InputLeftElement>
                        <Search size={18} color={COLORS.gray[500]} />
                    </InputLeftElement>
                    <Input
                        placeholder="Cari fasilitas berdasarkan nama..."
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

           
            </VStack>
        </Box>
    );
};

export default FacilitySearchBar; 