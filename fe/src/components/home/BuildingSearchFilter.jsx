import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    HStack,
    VStack,
    Input,
    Select,
    Button,
    Text,
    InputGroup,
    InputLeftElement,
    Flex,
    Wrap,
    WrapItem,
    Spinner
} from '@chakra-ui/react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { COLORS, GLASS_EFFECT } from '../../utils/designTokens';
import { useDebounce } from '../../hooks';

const BuildingSearchFilter = ({ onSearch, buildingTypes = [], loading = false }) => {
    const [searchData, setSearchData] = useState({
        query: '',
        buildingType: ''
    });

    // Debounce search query dengan delay 800ms (lebih lama untuk mengurangi calls)
    const debouncedQuery = useDebounce(searchData.query, 800);

    // State untuk menunjukkan loading saat mengetik
    const [isSearching, setIsSearching] = useState(false);

    // Ref untuk menyimpan onSearch function dan mencegah loop
    const onSearchRef = useRef(onSearch);
    onSearchRef.current = onSearch;

    // Ref untuk mencegah call pertama kali saat komponen mount
    const isInitialMount = useRef(true);

    // Ref untuk menyimpan nilai terakhir yang dikirim untuk mencegah duplikasi
    const lastSearchParams = useRef({ query: '', buildingType: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: value
        }));

        // Tampilkan loading indicator saat mengetik
        if (name === 'query' && value !== searchData.query) {
            setIsSearching(true);
        }
    };

    // Effect untuk search dengan debounce - Hanya call saat ada perubahan yang berarti
    useEffect(() => {
        // Skip pada mount pertama kali untuk menghindari double call
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const currentParams = {
            query: debouncedQuery,
            buildingType: searchData.buildingType
        };

        // Cek apakah parameter sudah berubah dari sebelumnya
        const hasChanged =
            currentParams.query !== lastSearchParams.current.query ||
            currentParams.buildingType !== lastSearchParams.current.buildingType;

        // Hanya call jika ada perubahan, onSearch ada, dan tidak dalam kondisi loading
        if (hasChanged && onSearchRef.current && !loading) {
            lastSearchParams.current = currentParams;
            onSearchRef.current(currentParams);
        }
        setIsSearching(false);
    }, [debouncedQuery, searchData.buildingType, loading]);

    const handleClear = useCallback(() => {
        const newSearchData = {
            query: '',
            buildingType: ''
        };

        setSearchData(newSearchData);
        setIsSearching(false);

        // Update last search params dan call search dengan parameter kosong
        lastSearchParams.current = newSearchData;
        if (onSearchRef.current) {
            onSearchRef.current(newSearchData);
        }
    }, []);

    return (
        <Box
            mb={6}
            w="full"
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(12px)"
            borderRadius="16px"
            p={4}
            border="1px solid rgba(255, 255, 255, 0.1)"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
        >
            <VStack spacing={3} align="stretch">
                {/* Header */}
                <HStack spacing={2} align="center">
                    <Filter size={16} color={COLORS.primary} />
                    <Text fontSize="md" fontWeight="600" color={COLORS.black}>
                        Cari & Filter Gedung
                    </Text>
                    {(isSearching || loading) && (
                        <Spinner size="sm" color={COLORS.primary} />
                    )}
                </HStack>

                {/* Search Form */}
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap={3}
                    align={{ base: 'stretch', md: 'end' }}
                >
                    {/* Search Query */}
                    <Box flex="2">
                        <Text fontSize="sm" color={COLORS.black} mb={1} fontWeight="500">
                            Nama atau Deskripsi Gedung
                        </Text>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <Search size={14} color={COLORS.black} opacity={0.6} />
                            </InputLeftElement>
                            <Input
                                name="query"
                                type="text"
                                placeholder="Cari berdasarkan nama atau deskripsi gedung..."
                                value={searchData.query}
                                onChange={handleChange}
                                bg="rgba(255, 255, 255, 0.6)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(255, 255, 255, 0.2)"
                                borderRadius="full"
                                color={COLORS.black}
                                fontSize="sm"
                                _placeholder={{ color: COLORS.black, opacity: 0.5 }}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: "0 0 0 2px rgba(116, 156, 115, 0.1)"
                                }}
                            />
                        </InputGroup>
                    </Box>

                    {/* Building Type Filter */}
                    <Box flex="1" minW={{ base: 'full', md: '180px' }}>
                        <Text fontSize="sm" color={COLORS.black} mb={1} fontWeight="500">
                            Jenis Gedung
                        </Text>
                        <Select
                            name="buildingType"
                            value={searchData.buildingType}
                            onChange={handleChange}
                            bg="rgba(255, 255, 255, 0.6)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            borderRadius="full"
                            color={COLORS.black}
                            fontSize="sm"
                            _focus={{
                                borderColor: COLORS.primary,
                                boxShadow: "0 0 0 2px rgba(116, 156, 115, 0.1)"
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

                    {/* Reset Button */}
                    {(searchData.query || searchData.buildingType) && (
                        <Button
                            type="button"
                            onClick={handleClear}
                            variant="outline"
                            borderColor="rgba(255, 255, 255, 0.2)"
                            color={COLORS.black}
                            borderRadius="full"
                            px={4}
                            size="md"
                            fontSize="sm"
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.1)"
                            }}
                            leftIcon={<RotateCcw size={12} />}
                        >
                            Reset
                        </Button>
                    )}
                </Flex>

                {/* Active Filters Display */}
                {(searchData.query || searchData.buildingType) && (
                    <Box pt={2} borderTop="1px solid rgba(255, 255, 255, 0.1)">
                        <Text fontSize="xs" color={COLORS.black} opacity={0.6} mb={1}>
                            Filter aktif:
                        </Text>
                        <Wrap spacing={1}>
                            {searchData.query && (
                                <WrapItem>
                                    <Box
                                        bg={`${COLORS.primary}15`}
                                        color={COLORS.primary}
                                        px={2}
                                        py={0.5}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="500"
                                    >
                                        Pencarian: "{searchData.query}"
                                    </Box>
                                </WrapItem>
                            )}
                            {searchData.buildingType && (
                                <WrapItem>
                                    <Box
                                        bg={`${COLORS.primary}15`}
                                        color={COLORS.primary}
                                        px={2}
                                        py={0.5}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="500"
                                    >
                                        Jenis: {buildingTypes.find(t => t.value === searchData.buildingType)?.label || searchData.buildingType}
                                    </Box>
                                </WrapItem>
                            )}
                        </Wrap>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default BuildingSearchFilter; 