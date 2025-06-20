import React from 'react';
import { SimpleGrid, Box, Text, HStack, Icon } from '@chakra-ui/react';
import { Building, Calendar, CreditCard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS, SHADOWS, RADII, ANIMATIONS } from '@/utils/designTokens';
import { GlassCard } from '@/components/ui';

// Default stat data - would typically come from props or a data hook
const defaultStats = [
    {
        id: 1,
        label: 'Total Gedung',
        value: 24,
        icon: Building,
        change: '+4% dari bulan lalu',
        color: 'blue.500',
        bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))'
    },
    {
        id: 2,
        label: 'Total Peminjaman',
        value: 147,
        icon: Calendar,
        change: '+12% dari bulan lalu',
        color: COLORS.primary,
        bgGradient: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.primary}10)`
    },
    {
        id: 3,
        label: 'Total Transaksi',
        value: 4,
        icon: CreditCard,
        change: '+12% dari bulan lalu',
        color: 'purple.500',
        bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))'
    },
    {
        id: 4,
        label: 'Total Pendapatan',
        value: 'Rp 6.6jt',
        icon: TrendingUp,
        change: '+23% dari bulan lalu',
        color: 'orange.500',
        bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))'
    }
];

const StatCard = ({ stat, index }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <GlassCard
                p={6}
                h="140px"
                position="relative"
                overflow="hidden"
                _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: SHADOWS.lg,
                }}
                transition="all 0.3s ease"
                cursor="pointer"
            >
                {/* Background Gradient */}
                <Box
                    position="absolute"
                    top={0}
                    right={0}
                    w="80px"
                    h="80px"
                    borderRadius="full"
                    bg={stat.bgGradient}
                    opacity={0.6}
                    transform="translate(20px, -20px)"
                />

                <Box position="relative" zIndex={2}>
                    <HStack justify="space-between" align="start" mb={4}>
                        <Box>
                            <Text
                                fontSize="sm"
                                color={COLORS.gray[600]}
                                fontWeight="medium"
                                mb={1}
                            >
                                {stat.label}
                            </Text>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={COLORS.black}
                                lineHeight="1.2"
                            >
                                {stat.value}
                            </Text>
                        </Box>

                        <Box
                            p={2.5}
                            borderRadius="lg"
                            bg={`${stat.color}15`}
                            border={`1px solid ${stat.color}20`}
                        >
                            <Icon
                                as={stat.icon}
                                boxSize={5}
                                color={stat.color}
                            />
                        </Box>
                    </HStack>

                    <Text
                        fontSize="xs"
                        color={COLORS.primary}
                        fontWeight="medium"
                    >
                        {stat.change}
                    </Text>
                </Box>
            </GlassCard>
        </motion.div>
    );
};

const StatCards = ({ stats = defaultStats }) => {
    return (
        <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing={6}
            mb={8}
        >
            {stats.map((stat, index) => (
                <StatCard key={stat.id} stat={stat} index={index} />
            ))}
        </SimpleGrid>
    );
};

export default StatCards; 