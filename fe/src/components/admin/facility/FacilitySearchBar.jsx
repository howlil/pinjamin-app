import React from 'react';
import {
    VStack,
    HStack,
    Input,
    Button,
    InputGroup,
    InputLeftElement,
    Text
} from '@chakra-ui/react';
import { Search, Settings } from 'lucide-react';
import { GlassCard } from '@/components/ui';
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
        <GlassCard p={6}>
            <VStack spacing={4} align="stretch">
                <HStack spacing={4} wrap="wrap">
                    <InputGroup flex={1} minW="250px">
                        <InputLeftElement>
                            <Search size={18} color={COLORS.gray[500]} />
                        </InputLeftElement>
                        <Input
                            placeholder="Cari fasilitas berdasarkan nama..."
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
                </HStack>

                {/* Results Summary */}
                <HStack justify="space-between" align="center">
                    <Text color={COLORS.gray[600]} fontSize="sm">
                        Menampilkan {currentItems} dari {totalItems} fasilitas
                    </Text>
                    <HStack spacing={2}>
                        <Settings size={16} color={COLORS.primary} />
                        <Text color={COLORS.primary} fontSize="sm" fontWeight="medium">
                            Total: {totalItems} fasilitas
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
        </GlassCard>
    );
};

export default FacilitySearchBar; 