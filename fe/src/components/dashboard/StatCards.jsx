import React from 'react';
import {
    SimpleGrid,
    Box,
    Text,
    Flex,
    Icon,
    useBreakpointValue
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
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const StatCard = ({ title, value, icon: IconComponent, subtitle, color = COLORS.primary, delay = 0 }) => {
    const cardPadding = useBreakpointValue({ base: 3, md: 4 });
    const iconSize = useBreakpointValue({ base: 10, md: 12 });

    return (
        <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ 
                y: -4, 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
        >
            <Box
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="16px"
                boxShadow="0 8px 32px rgba(116, 156, 115, 0.08)"
                p={cardPadding}
                position="relative"
                overflow="hidden"
                _hover={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 12px 40px rgba(116, 156, 115, 0.12)"
                }}
                style={{ transition: "all 0.3s ease" }}
                cursor="pointer"
            >
                {/* Subtle Background Pattern */}
                <AnimatedGridPattern
                    numSquares={8}
                    maxOpacity={0.03}
                    duration={3}
                    repeatDelay={1.5}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/6 stroke-[#749c73]/3"
                />

                <Flex align="center" justify="space-between" position="relative" zIndex={1}>
                    <Box flex={1}>
                        <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color="#666666"
                            mb={2}
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            {title}
                        </Text>
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="bold"
                            color="#444444"
                            lineHeight="1"
                            mb={1}
                        >
                            {value}
                        </Text>
                        {subtitle && (
                            <Text
                                fontSize="xs"
                                color="#777777"
                                fontWeight="medium"
                            >
                                {subtitle}
                            </Text>
                        )}
                    </Box>

                    <Box
                        w={iconSize}
                        h={iconSize}
                        borderRadius="12px"
                        bg={`${color}15`}
                        border={`1px solid ${color}30`}
                        display="flex"
                        align="center"
                        justify="center"
                        flexShrink={0}
                        position="relative"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bg: `linear-gradient(135deg, ${color}20, ${color}05)`,
                            borderRadius: '12px'
                        }}
                    >
                        <Icon 
                            as={IconComponent} 
                            boxSize={{ base: 4, md: 5 }} 
                            color={color}
                            position="relative"
                            zIndex={1}
                        />
                    </Box>
                </Flex>
            </Box>
        </MotionBox>
    );
};

const StatCards = ({ stats = {} }) => {
    const gridColumns = useBreakpointValue({ 
        base: 1, 
        sm: 2, 
        md: 3, 
        lg: 6,
        xl: 6 
    });

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
            columns={gridColumns}
            spacing={{ base: 3, md: 4 }}
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
                    delay={index * 0.05}
                />
            ))}
        </SimpleGrid>
    );
};

export default StatCards; 