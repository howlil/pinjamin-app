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
    Box,
    Icon,
    useBreakpointValue
} from '@chakra-ui/react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '../../../utils/designTokens';

const MotionBox = motion(Box);

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
    const padding = useBreakpointValue({ base: 3, md: 4 });
    const inputHeight = useBreakpointValue({ base: "40px", md: "44px" });

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Box
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="16px"
                boxShadow="0 8px 32px rgba(116, 156, 115, 0.08)"
                p={padding}
            >
                <VStack spacing={4} align="stretch">
                    {/* Header */}
                    <HStack spacing={3} mb={2}>
                        <Box
                            w={10}
                            h={10}
                            borderRadius="12px"
                            bg="rgba(116, 156, 115, 0.15)"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={Filter} boxSize={5} color={COLORS.primary} />
                        </Box>
                        <Box>
                            <Text fontSize="md" fontWeight="bold" color="#444444">
                                Pencarian & Filter
                            </Text>
                            <Text fontSize="sm" color="#666666" fontWeight="medium">
                                Temukan data yang Anda butuhkan
                            </Text>
                        </Box>
                    </HStack>

                    {/* Search and Filters Row */}
                    <Wrap spacing={3} align="center">
                        {/* Search Input */}
                        <WrapItem flex={1} minW={{ base: "100%", md: "280px" }}>
                            <InputGroup w="full">
                                <InputLeftElement
                                    pointerEvents="none"
                                    h={inputHeight}
                                    left={2}
                                >
                                    <Search size={18} color="#666666" />
                                </InputLeftElement>
                                <Input
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    h={inputHeight}
                                    pl={12}
                                    bg="rgba(255, 255, 255, 0.1)"
                                    backdropFilter="blur(8px)"
                                    border="1px solid rgba(255, 255, 255, 0.15)"
                                    borderRadius="12px"
                                    color="#444444"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    _placeholder={{
                                        color: "#999999"
                                    }}
                                    _focus={{
                                        borderColor: COLORS.primary,
                                        boxShadow: `0 0 0 3px rgba(116, 156, 115, 0.1)`,
                                        bg: "rgba(255, 255, 255, 0.15)"
                                    }}
                                    _hover={{
                                        bg: "rgba(255, 255, 255, 0.15)",
                                        borderColor: "rgba(116, 156, 115, 0.3)"
                                    }}
                                    transition="all 0.2s ease"
                                />
                            </InputGroup>
                        </WrapItem>

                        {/* Filter Selects */}
                        {filters.map((filter) => (
                            <WrapItem key={filter.key} minW={{ base: "100%", md: "180px" }}>
                                <Select
                                    placeholder={filter.label}
                                    value={filter.value}
                                    onChange={(e) => filter.onChange(e.target.value)}
                                    h={inputHeight}
                                    bg="rgba(255, 255, 255, 0.1)"
                                    backdropFilter="blur(8px)"
                                    border="1px solid rgba(255, 255, 255, 0.15)"
                                    borderRadius="12px"
                                    color="#444444"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    _focus={{
                                        borderColor: COLORS.primary,
                                        boxShadow: `0 0 0 3px rgba(116, 156, 115, 0.1)`,
                                        bg: "rgba(255, 255, 255, 0.15)"
                                    }}
                                    _hover={{
                                        bg: "rgba(255, 255, 255, 0.15)",
                                        borderColor: "rgba(116, 156, 115, 0.3)"
                                    }}
                                    transition="all 0.2s ease"
                                >
                                    {filter.options.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                            style={{ background: '#ffffff', color: '#444444' }}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </WrapItem>
                        ))}
                    </Wrap>
                </VStack>
            </Box>
        </MotionBox>
    );
};

export default AdminSearchFilter; 