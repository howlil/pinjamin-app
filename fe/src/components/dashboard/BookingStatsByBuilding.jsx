import React from 'react';
import { Box, Text, VStack, HStack, Progress, Badge, Icon, Flex, useBreakpointValue } from '@chakra-ui/react';
import { Building, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const BookingStatsByBuilding = ({ bookingStatistics = [] }) => {
    const cardPadding = useBreakpointValue({ base: 4, md: 5 });

    // Calculate total bookings
    const totalBookings = bookingStatistics.reduce((sum, item) => sum + item.totalBookings, 0);

    // Sort by total bookings (descending)
    const sortedStats = [...bookingStatistics].sort((a, b) => b.totalBookings - a.totalBookings);

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            bg="rgba(255, 255, 255, 0.08)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.12)"
            borderRadius="20px"
            boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
            p={cardPadding}
            position="relative"
            overflow="hidden"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
            }}
            transition="all 0.3s ease"
        >
            {/* Background Pattern */}
            <AnimatedGridPattern
                numSquares={18}
                maxOpacity={0.04}
                duration={5}
                repeatDelay={2.5}
                className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
            />

            <Box position="relative" zIndex={1}>
                <Flex justify="space-between" align="center" mb={5}>
                    <Text
                        fontSize={{ base: "md", md: "lg" }}
                        fontWeight="bold"
                        color="#444444"
                    >
                        Statistik Peminjaman
                    </Text>
                    <Badge
                        bg="rgba(116, 156, 115, 0.15)"
                        color={COLORS.primary}
                        border="1px solid rgba(116, 156, 115, 0.2)"
                        px={3}
                        py={1}
                        borderRadius="8px"
                        fontSize="xs"
                        fontWeight="semibold"
                    >
                        <HStack spacing={1}>
                            <TrendingUp size={12} />
                            <Text>Total: {totalBookings}</Text>
                        </HStack>
                    </Badge>
                </Flex>

                <VStack spacing={3} align="stretch">
                    {sortedStats.length === 0 ? (
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            py={10}
                            gap={3}
                        >
                            <MotionBox
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                w={12}
                                h={12}
                                borderRadius="12px"
                                bg="rgba(116, 156, 115, 0.15)"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                display="flex"
                                align="center"
                                justify="center"
                            >
                                <Building size={20} color={COLORS.primary} />
                            </MotionBox>
                            <Text
                                color="#666666"
                                textAlign="center"
                                fontSize="sm"
                                fontWeight="medium"
                            >
                                Belum ada data peminjaman gedung
                            </Text>
                        </Flex>
                    ) : (
                        sortedStats.map((building, index) => {
                            const percentage = totalBookings > 0
                                ? (building.totalBookings / totalBookings) * 100
                                : 0;

                            return (
                                <MotionBox
                                    key={`${building.buildingName}-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    whileHover={{ scale: 1.02, y: -1 }}
                                >
                                    <Box
                                        p={4}
                                        borderRadius="12px"
                                        bg="rgba(255, 255, 255, 0.1)"
                                        backdropFilter="blur(8px)"
                                        border="1px solid rgba(255, 255, 255, 0.15)"
                                        _hover={{
                                            bg: "rgba(116, 156, 115, 0.1)",
                                            borderColor: "rgba(116, 156, 115, 0.25)",
                                            boxShadow: "0 4px 20px rgba(116, 156, 115, 0.1)"
                                        }}
                                        transition="all 0.2s ease"
                                        cursor="pointer"
                                    >
                                        <HStack justify="space-between" mb={3}>
                                            <HStack spacing={3}>
                                                <Box
                                                    w={8}
                                                    h={8}
                                                    borderRadius="8px"
                                                    bg="rgba(116, 156, 115, 0.15)"
                                                    border="1px solid rgba(116, 156, 115, 0.2)"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Icon
                                                        as={Building}
                                                        boxSize={4}
                                                        color={COLORS.primary}
                                                    />
                                                </Box>
                                                <Text
                                                    fontWeight="semibold"
                                                    color="#444444"
                                                    fontSize="sm"
                                                >
                                                    {building.buildingName}
                                                </Text>
                                            </HStack>
                                            <VStack spacing={0} align="end">
                                                <Text
                                                    fontWeight="bold"
                                                    color="#444444"
                                                    fontSize="sm"
                                                >
                                                    {building.totalBookings}
                                                </Text>
                                                <Text
                                                    color="#666666"
                                                    fontSize="xs"
                                                    fontWeight="medium"
                                                >
                                                    {percentage.toFixed(1)}%
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <Progress
                                            value={percentage}
                                            bg="rgba(255, 255, 255, 0.2)"
                                            borderRadius="full"
                                            size="sm"
                                            sx={{
                                                '& > div': {
                                                    bg: `linear-gradient(90deg, ${COLORS.primary}, rgba(116, 156, 115, 0.7))`,
                                                    borderRadius: "full"
                                                }
                                            }}
                                        />
                                    </Box>
                                </MotionBox>
                            );
                        })
                    )}
                </VStack>
            </Box>
        </MotionBox>
    );
};

export default BookingStatsByBuilding; 