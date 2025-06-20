import React from 'react';
import { Box, Text, VStack, HStack, Progress, Badge, Icon, Flex } from '@chakra-ui/react';
import { Building, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui';
import { COLORS, SHADOWS, RADII } from '@/utils/designTokens';

const BookingStatsByBuilding = ({ bookingStatistics = [] }) => {
    // Calculate total bookings
    const totalBookings = bookingStatistics.reduce((sum, item) => sum + item.totalBookings, 0);

    // Sort by total bookings (descending)
    const sortedStats = [...bookingStatistics].sort((a, b) => b.totalBookings - a.totalBookings);

    return (
        <GlassCard p={6}>
            <Flex justify="space-between" align="center" mb={6}>
                <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color={COLORS.black}
                >
                    Statistik Peminjaman
                </Text>
                <Badge
                    bg={`${COLORS.primary}15`}
                    color={COLORS.primary}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="semibold"
                    border={`1px solid ${COLORS.primary}30`}
                >
                    <HStack spacing={1}>
                        <TrendingUp size={12} />
                        <Text>Total: {totalBookings}</Text>
                    </HStack>
                </Badge>
            </Flex>

            <VStack spacing={4} align="stretch">
                {sortedStats.length === 0 ? (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        py={12}
                        gap={3}
                    >
                        <Box
                            w="50px"
                            h="50px"
                            borderRadius="full"
                            bg={`${COLORS.primary}10`}
                            display="flex"
                            align="center"
                            justify="center"
                        >
                            <Building size={20} color={COLORS.primary} />
                        </Box>
                        <Text
                            color={COLORS.gray[500]}
                            textAlign="center"
                            fontSize="sm"
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
                            <motion.div
                                key={`${building.buildingName}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Box
                                    p={4}
                                    borderRadius="lg"
                                    bg={`${COLORS.primary}05`}
                                    border={`1px solid ${COLORS.primary}15`}
                                    _hover={{
                                        bg: `${COLORS.primary}10`,
                                        borderColor: `${COLORS.primary}25`,
                                        transform: 'translateY(-1px)',
                                        boxShadow: SHADOWS.sm
                                    }}
                                    transition="all 0.2s"
                                    cursor="pointer"
                                >
                                    <HStack justify="space-between" mb={3}>
                                        <HStack spacing={3}>
                                            <Box
                                                p={2}
                                                borderRadius="md"
                                                bg={`${COLORS.primary}15`}
                                            >
                                                <Icon
                                                    as={Building}
                                                    boxSize={4}
                                                    color={COLORS.primary}
                                                />
                                            </Box>
                                            <Text
                                                fontWeight="semibold"
                                                color={COLORS.black}
                                                fontSize="sm"
                                            >
                                                {building.buildingName}
                                            </Text>
                                        </HStack>
                                        <VStack spacing={0} align="end">
                                            <Text
                                                fontWeight="bold"
                                                color={COLORS.black}
                                                fontSize="sm"
                                            >
                                                {building.totalBookings}
                                            </Text>
                                            <Text
                                                color={COLORS.gray[600]}
                                                fontSize="xs"
                                            >
                                                {percentage.toFixed(1)}%
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <Progress
                                        value={percentage}
                                        bg="gray.100"
                                        sx={{
                                            '& > div': {
                                                bg: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`
                                            }
                                        }}
                                        size="sm"
                                        borderRadius="full"
                                    />
                                </Box>
                            </motion.div>
                        );
                    })
                )}
            </VStack>
        </GlassCard>
    );
};

export default BookingStatsByBuilding; 