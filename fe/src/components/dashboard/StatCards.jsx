import React from 'react';
import {
    SimpleGrid,
    Box,
    Text,
    Flex,
    Icon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    Users,
    Building,
    Calendar,
    DollarSign,
    TrendingUp,
    Clock
} from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { COLORS } from '@/utils/designTokens';

const StatCard = ({ title, value, icon: IconComponent, subtitle, color = COLORS.primary, delay = 0 }) => {
    return (
        <Box
            as={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
        >
            <GlassCard p={6} hoverEffect={true}>
                <Flex align="center" justify="space-between">
                    <Box flex={1}>
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={COLORS.gray[600]}
                            mb={2}
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            {title}
                        </Text>
                        <Text
                            fontSize="3xl"
                            fontWeight="bold"
                            color={COLORS.black}
                            lineHeight="1"
                            mb={1}
                        >
                            {value}
                        </Text>
                        {subtitle && (
                            <Text
                                fontSize="xs"
                                color={COLORS.gray[500]}
                                fontWeight="medium"
                            >
                                {subtitle}
                            </Text>
                        )}
                    </Box>

                    <Box
                        w="60px"
                        h="60px"
                        borderRadius="full"
                        bg={`${color}15`}
                        border={`2px solid ${color}30`}
                        display="flex"
                        align="center"
                        justify="center"
                        flexShrink={0}
                    >
                        <Icon as={IconComponent} boxSize={6} color={color} />
                    </Box>
                </Flex>
            </GlassCard>
        </Box>
    );
};

const StatCards = ({ stats = {} }) => {
    const {
        totalUsers = 0,
        totalBuildings = 0,
        totalBookings = 0,
        totalRevenue = 0,
        monthlyBookings = 0,
        activeBookings = 0
    } = stats;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const cardData = [
        {
            title: 'Total Pengguna',
            value: totalUsers.toLocaleString(),
            icon: Users,
            color: COLORS.primary,
            subtitle: 'Pengguna terdaftar'
        },
        {
            title: 'Total Gedung',
            value: totalBuildings.toLocaleString(),
            icon: Building,
            color: '#3182CE',
            subtitle: 'Gedung tersedia'
        },
        {
            title: 'Total Peminjaman',
            value: totalBookings.toLocaleString(),
            icon: Calendar,
            color: '#38A169',
            subtitle: 'Semua waktu'
        },
        {
            title: 'Pendapatan',
            value: formatCurrency(totalRevenue),
            icon: DollarSign,
            color: '#D69E2E',
            subtitle: 'Total pendapatan'
        },
        {
            title: 'Bulan Ini',
            value: monthlyBookings.toLocaleString(),
            icon: TrendingUp,
            color: '#9F7AEA',
            subtitle: 'Peminjaman bulan ini'
        },
        {
            title: 'Sedang Berlangsung',
            value: activeBookings.toLocaleString(),
            icon: Clock,
            color: '#F56565',
            subtitle: 'Peminjaman aktif'
        }
    ];

    return (
        <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3, xl: 6 }}
            spacing={4}
            w="full"
        >
            {cardData.map((card, index) => (
                <StatCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    color={card.color}
                    subtitle={card.subtitle}
                    delay={index * 0.1}
                />
            ))}
        </SimpleGrid>
    );
};

export default StatCards; 