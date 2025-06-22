import React from 'react';
import {
    Box,
    Text,
    HStack,
    VStack,
    Select,
    Button,
    IconButton,
    Tooltip,
    Badge,
    SimpleGrid,
    useBreakpointValue,
    Container
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Calendar, Filter, RefreshCw, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';
import { AnimatedGridPattern } from '../../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const BookingHistoryHeader = ({
    totalItems = 0,
    statusFilter = '',
    onStatusFilter,
    onRefresh,
    statusCounts = {} // Receive real status counts from props
}) => {
    // Responsive values
    const headerPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const cardColumns = useBreakpointValue({ base: 2, sm: 3, md: 5 });
    const fontSize = useBreakpointValue({ base: "lg", md: "xl" });

    // Status options for filter
    const statusOptions = [
        { value: '', label: 'Semua Status' },
        { value: 'PROCESSING', label: 'Diproses' },
        { value: 'APPROVED', label: 'Disetujui' },
        { value: 'REJECTED', label: 'Ditolak' },
        { value: 'COMPLETED', label: 'Selesai' }
    ];

    // Use real status counts from props or fallback to zeros
    const actualStatusCounts = {
        total: statusCounts.total || totalItems || 0,
        processing: statusCounts.processing || 0,
        approved: statusCounts.approved || 0,
        completed: statusCounts.completed || 0,
        rejected: statusCounts.rejected || 0
    };

    // Status cards configuration
    const statusCards = [
        {
            label: 'Total',
            value: actualStatusCounts.total,
            color: COLORS.primary,
            bg: 'rgba(116, 156, 115, 0.1)',
            border: 'rgba(116, 156, 115, 0.2)',
            icon: TrendingUp
        },
        {
            label: 'Diproses',
            value: actualStatusCounts.processing,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)',
            border: 'rgba(245, 158, 11, 0.2)',
            icon: Clock
        },
        {
            label: 'Disetujui',
            value: actualStatusCounts.approved,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)',
            border: 'rgba(16, 185, 129, 0.2)',
            icon: CheckCircle
        },
        {
            label: 'Selesai',
            value: actualStatusCounts.completed,
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.1)',
            border: 'rgba(59, 130, 246, 0.2)',
            icon: CheckCircle
        },
        {
            label: 'Ditolak',
            value: actualStatusCounts.rejected,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.1)',
            border: 'rgba(239, 68, 68, 0.2)',
            icon: XCircle
        }
    ];

    return (
        <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
            <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="20px"
                boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                mb={6}
                position="relative"
                overflow="hidden"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={25}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                />

                <Box position="relative" zIndex={1} p={headerPadding}>
                    <VStack spacing={{ base: 4, md: 5 }} align="stretch">
                        {/* Title and Actions */}
                        <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                            <HStack spacing={3} flex={1}>
                                <MotionBox
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    w={{ base: 8, sm: 10 }}
                                    h={{ base: 8, sm: 10 }}
                                    bg="rgba(116, 156, 115, 0.15)"
                                    borderRadius="12px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="1px solid rgba(116, 156, 115, 0.2)"
                                >
                                    <Calendar size={20} color={COLORS.primary} />
                                </MotionBox>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize={fontSize} fontWeight="bold" color="#444444">
                                        Riwayat Peminjaman
                                    </Text>
                                    <Text fontSize={{ base: "xs", sm: "sm" }} color="#666666">
                                        Kelola dan pantau riwayat peminjaman Anda
                                    </Text>
                                </VStack>
                            </HStack>

                            <Tooltip label="Refresh data" placement="left">
                                <IconButton
                                    icon={<RefreshCw size={16} />}
                                    size="sm"
                                    bg="rgba(255, 255, 255, 0.1)"
                                    backdropFilter="blur(8px)"
                                    border="1px solid rgba(255, 255, 255, 0.15)"
                                    borderRadius="10px"
                                    color="#444444"
                                    _hover={{
                                        bg: "rgba(116, 156, 115, 0.15)",
                                        borderColor: "rgba(116, 156, 115, 0.3)",
                                        color: COLORS.primary
                                    }}
                                    onClick={onRefresh}
                                />
                            </Tooltip>
                        </HStack>

                        {/* Stats Cards */}
                        <SimpleGrid columns={cardColumns} spacing={3}>
                            {statusCards.map((card, index) => {
                                const IconComponent = card.icon;
                                return (
                                    <MotionBox
                                        key={card.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        bg={card.bg}
                                        backdropFilter="blur(8px)"
                                        border={`1px solid ${card.border}`}
                                        borderRadius="12px"
                                        p={{ base: 3, sm: 4 }}
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            boxShadow: `0 8px 25px ${card.color}20`
                                        }}
                                        transition="all 0.2s ease"
                                    >
                                        <VStack spacing={2}>
                                            <HStack spacing={2} w="full" justify="space-between">
                                                <Text
                                                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                                                    fontWeight="bold"
                                                    color={card.color}
                                                >
                                                    {card.value}
                                                </Text>
                                                <IconComponent size={16} color={card.color} />
                                            </HStack>
                                            <Text
                                                fontSize={{ base: "xs", sm: "sm" }}
                                                color="#666666"
                                                fontWeight="medium"
                                                textAlign="center"
                                            >
                                                {card.label}
                                            </Text>
                                        </VStack>
                                    </MotionBox>
                                );
                            })}
                        </SimpleGrid>

                        {/* Filters */}
                        <MotionBox
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            bg="rgba(255, 255, 255, 0.08)"
                            backdropFilter="blur(8px)"
                            borderRadius="12px"
                            border="1px solid rgba(255, 255, 255, 0.12)"
                            p={4}
                        >
                            <VStack spacing={3} align="stretch">
                                <HStack spacing={2}>
                                    <Filter size={16} color={COLORS.primary} />
                                    <Text fontSize="sm" color="#444444" fontWeight="semibold">
                                        Filter Status
                                    </Text>
                                </HStack>

                                <HStack spacing={3} align="center" flexWrap="wrap">
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => onStatusFilter(e.target.value)}
                                        size="sm"
                                        maxW={{ base: "full", sm: "200px" }}
                                        bg="rgba(255, 255, 255, 0.1)"
                                        backdropFilter="blur(8px)"
                                        border="1px solid rgba(255, 255, 255, 0.15)"
                                        borderRadius="8px"
                                        color="#444444"
                                        _focus={{
                                            borderColor: COLORS.primary,
                                            boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                        }}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>

                                    {statusFilter && (
                                        <HStack spacing={2}>
                                            <Badge
                                                bg="rgba(116, 156, 115, 0.15)"
                                                color={COLORS.primary}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                border="1px solid rgba(116, 156, 115, 0.2)"
                                            >
                                                Filter Aktif
                                            </Badge>

                                            <Button
                                                size="xs"
                                                variant="ghost"
                                                color="#666666"
                                                onClick={() => onStatusFilter('')}
                                                fontSize="xs"
                                                _hover={{
                                                    bg: "rgba(239, 68, 68, 0.1)",
                                                    color: "#ef4444"
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </HStack>
                                    )}
                                </HStack>
                            </VStack>
                        </MotionBox>
                    </VStack>
                </Box>
            </MotionBox>
        </Container>
    );
};

export default BookingHistoryHeader; 