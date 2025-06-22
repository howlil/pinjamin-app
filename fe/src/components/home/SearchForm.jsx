import React, { useState } from 'react';
import { Box, VStack, Input, Button, HStack, Text } from '@chakra-ui/react';
import { Calendar, Clock, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS, GLASS_EFFECT, RADII, SHADOWS } from '../../utils/designTokens';

const MotionBox = motion(Box);

const SearchForm = ({ onCheckAvailability, loading = false }) => {
    const [searchData, setSearchData] = useState({
        date: '',
        time: ''
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

        if (searchData.date && searchData.time && onCheckAvailability) {
            // Transform date from YYYY-MM-DD to DD-MM-YYYY format expected by API
            const [year, month, day] = searchData.date.split('-');
            const formattedDate = `${day}-${month}-${year}`;

            // Send data to API with correct format
            onCheckAvailability({
                date: formattedDate, // DD-MM-YYYY format
                time: searchData.time // HH:MM format (already correct from input)
            });
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <MotionBox
            bg={GLASS_EFFECT.bg}
            backdropFilter={GLASS_EFFECT.backdropFilter}
            border={GLASS_EFFECT.border}
            borderRadius={GLASS_EFFECT.borderRadius}
            boxShadow={GLASS_EFFECT.boxShadow}
            p={8}
            w="full"
            position="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            _hover={{
                boxShadow: "0 12px 40px rgba(116, 156, 115, 0.15)",
                transform: "translateY(-2px)"
            }}
            style={{
                transition: "all 0.3s ease"
            }}
        >
            <VStack spacing={6} align="stretch" as="form" onSubmit={handleSubmit}>
                <VStack align="start" spacing={1}>
                    <Text fontSize="xl" fontWeight="bold" color={COLORS.black}>
                        Cek Ketersediaan Ruangan
                    </Text>
                    <Text fontSize="sm" color={COLORS.gray[600]}>
                        Temukan ruangan yang sesuai dengan kebutuhan Anda
                    </Text>
                </VStack>

                {/* Form Fields - Horizontal Layout */}
                <HStack spacing={4} align="end" flexWrap={{ base: "wrap", md: "nowrap" }}>
                    {/* Tanggal - Required */}
                    <Box flex="1" minW="200px">
                        <Text fontSize="sm" color={COLORS.gray[700]} mb={2} fontWeight="medium">
                            Tanggal <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Box position="relative">
                            <Input
                                name="date"
                                type="date"
                                min={today}
                                value={searchData.date}
                                onChange={handleChange}
                                bg="rgba(255, 255, 255, 0.5)"
                                backdropFilter="blur(10px)"
                                border="1px solid"
                                borderColor={`${COLORS.primary}30`}
                                borderRadius={RADII.buttonAndInput}
                                color={COLORS.black}
                                pl={10}
                                _hover={{
                                    borderColor: COLORS.primary
                                }}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 3px ${COLORS.primary}20`
                                }}
                                size="lg"
                                required
                            />
                            <Box
                                position="absolute"
                                left={3}
                                top="50%"
                                transform="translateY(-50%)"
                                color={COLORS.primary}
                                pointerEvents="none"
                            >
                                <Calendar size={18} />
                            </Box>
                        </Box>
                    </Box>

                    {/* Waktu - Required */}
                    <Box flex="1" minW="200px">
                        <Text fontSize="sm" color={COLORS.gray[700]} mb={2} fontWeight="medium">
                            Waktu <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Box position="relative">
                            <Input
                                name="time"
                                type="time"
                                value={searchData.time}
                                onChange={handleChange}
                                bg="rgba(255, 255, 255, 0.5)"
                                backdropFilter="blur(10px)"
                                border="1px solid"
                                borderColor={`${COLORS.primary}30`}
                                borderRadius={RADII.buttonAndInput}
                                color={COLORS.black}
                                pl={10}
                                _hover={{
                                    borderColor: COLORS.primary
                                }}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 3px ${COLORS.primary}20`
                                }}
                                size="lg"
                                required
                            />
                            <Box
                                position="absolute"
                                left={3}
                                top="50%"
                                transform="translateY(-50%)"
                                color={COLORS.primary}
                                pointerEvents="none"
                            >
                                <Clock size={18} />
                            </Box>
                        </Box>
                    </Box>
                </HStack>

                {/* Submit Button - Full Width */}
                <Button
                    type="submit"
                    bg={COLORS.primary}
                    color="white"
                    size="lg"
                    w="full"
                    h="50px"
                    borderRadius={RADII.buttonAndInput}
                    boxShadow={SHADOWS.primary}
                    _hover={{
                        bg: COLORS.primaryDark,
                        transform: "translateY(-2px)",
                        boxShadow: SHADOWS.primaryHover
                    }}
                    _active={{
                        bg: COLORS.primaryDark,
                        transform: "translateY(0)"
                    }}
                    transition="all 0.2s"
                    isLoading={loading}
                    loadingText="Mengecek..."
                    isDisabled={!searchData.date || !searchData.time}
                    fontWeight="medium"
                    leftIcon={<Search size={18} />}
                >
                    Cek Ketersediaan
                </Button>

                {/* Info Text */}
                <Text fontSize="xs" color={COLORS.gray[500]} textAlign="center">
                    * Field wajib diisi untuk mencari ketersediaan ruangan.
                </Text>
            </VStack>
        </MotionBox>
    );
};

export default SearchForm; 