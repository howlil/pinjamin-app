import React, { useState } from 'react';
import { Box, VStack, Heading, Text, Input, Button, Select } from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { COLORS, GLASS_EFFECT } from '@/utils/designTokens';

const SearchForm = ({ onSearch, buildingTypes = [] }) => {
    const [searchData, setSearchData] = useState({
        query: '',
        buildingType: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchData);
        }
    };

    const handleClear = () => {
        setSearchData({
            query: '',
            buildingType: ''
        });
        if (onSearch) {
            onSearch({
                query: '',
                buildingType: ''
            });
        }
    };

    return (
        <Box
            bg={GLASS_EFFECT.bg}
            backdropFilter={GLASS_EFFECT.backdropFilter}
            border={GLASS_EFFECT.border}
            p={8}
            borderRadius={GLASS_EFFECT.borderRadius}
            boxShadow={GLASS_EFFECT.boxShadow}
            w="full"
            maxW="md"
            position="relative"
            _before={{
                ...GLASS_EFFECT.beforeProps,
                borderRadius: GLASS_EFFECT.borderRadius
            }}
        >
            <VStack spacing={6} align="stretch" as="form" onSubmit={handleSubmit}>
                <Heading size="md" color={COLORS.black} fontWeight="600">
                    Cari Gedung
                </Heading>

                <VStack spacing={4} align="stretch">
                    <Box>
                        <Text fontSize="sm" color={COLORS.black} mb={2} fontWeight="500">
                            Nama Gedung
                        </Text>
                        <Box position="relative">
                            <Input
                                name="query"
                                type="text"
                                placeholder="Cari berdasarkan nama atau deskripsi..."
                                value={searchData.query}
                                onChange={handleChange}
                                bg="rgba(255, 255, 255, 0.4)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(255, 255, 255, 0.3)"
                                borderRadius="full"
                                color={COLORS.black}
                                pl={10}
                                _placeholder={{ color: COLORS.black, opacity: 0.6 }}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: "0 0 0 3px rgba(116, 156, 115, 0.1)"
                                }}
                            />
                            <Box
                                position="absolute"
                                left={3}
                                top="50%"
                                transform="translateY(-50%)"
                                color={COLORS.black}
                                opacity={0.6}
                            >
                                <Search size={16} />
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <Text fontSize="sm" color={COLORS.black} mb={2} fontWeight="500">
                            Jenis Gedung
                        </Text>
                        <Select
                            name="buildingType"
                            value={searchData.buildingType}
                            onChange={handleChange}
                            bg="rgba(255, 255, 255, 0.4)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            borderRadius="full"
                            color={COLORS.black}
                            _focus={{
                                borderColor: COLORS.primary,
                                boxShadow: "0 0 0 3px rgba(116, 156, 115, 0.1)"
                            }}
                        >
                            <option value="">Semua Jenis</option>
                            {buildingTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </Select>
                    </Box>
                </VStack>

                <VStack spacing={3}>
                    <Button
                        type="submit"
                        bg={COLORS.primary}
                        color="white"
                        size="lg"
                        w="full"
                        borderRadius="full"
                        boxShadow="0 4px 20px rgba(116, 156, 115, 0.4)"
                        _hover={{
                            bg: COLORS.primary,
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 25px rgba(116, 156, 115, 0.5)"
                        }}
                        transition="all 0.3s ease"
                    >
                        Cari Gedung
                    </Button>

                    {(searchData.query || searchData.buildingType) && (
                        <Button
                            type="button"
                            onClick={handleClear}
                            variant="ghost"
                            size="sm"
                            color={COLORS.black}
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.2)"
                            }}
                        >
                            Bersihkan Filter
                        </Button>
                    )}
                </VStack>
            </VStack>
        </Box>
    );
};

export default SearchForm; 