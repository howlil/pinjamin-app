import React from 'react';
import {
    Box,
    Text,
    HStack,
    VStack,
    Button,
    IconButton,
    Tooltip,
    Badge,
    SimpleGrid,
    useBreakpointValue,
    Container
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CreditCard, RefreshCw, AlertCircle, CheckCircle, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { COLORS, SHADOWS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const TransactionHeader = ({
    totalPending = 0,
    totalTransactions = 0,
    formatCurrency,
    onRefresh,
    onPayNow
}) => {
    // Responsive values
    const headerPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const cardColumns = useBreakpointValue({ base: 1, sm: 2 });
    const fontSize = useBreakpointValue({ base: "lg", md: "xl" });

    // Calculate statistics
    const getStats = () => ({
        totalPending,
        totalTransactions,
        hasPendingPayments: totalPending > 0
    });

    const stats = getStats();

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
                                    <CreditCard size={20} color={COLORS.primary} />
                                </MotionBox>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize={fontSize} fontWeight="bold" color="#444444">
                                        Riwayat Transaksi
                                    </Text>
                                    <Text fontSize={{ base: "xs", sm: "sm" }} color="#666666">
                                        Kelola pembayaran dan riwayat transaksi Anda
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
                        <SimpleGrid columns={cardColumns} spacing={4}>
                            {/* Total Transactions Card */}
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                bg="rgba(116, 156, 115, 0.1)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                borderRadius="16px"
                                p={{ base: 4, sm: 5 }}
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: `0 8px 25px rgba(116, 156, 115, 0.2)`
                                }}
                                transition="all 0.2s ease"
                            >
                                <VStack spacing={3}>
                                    <HStack spacing={3} w="full" justify="space-between">
                                        <VStack align="start" spacing={1}>
                                            <Text
                                                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                                                fontWeight="bold"
                                                color={COLORS.primary}
                                            >
                                                {stats.totalTransactions}
                                            </Text>
                                            <Text
                                                fontSize={{ base: "xs", sm: "sm" }}
                                                color="#666666"
                                                fontWeight="medium"
                                            >
                                                Total Transaksi
                                            </Text>
                                        </VStack>
                                        <TrendingUp size={24} color={COLORS.primary} />
                                    </HStack>
                                </VStack>
                            </MotionBox>

                            {/* Pending Payments Card */}
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                bg={stats.hasPendingPayments ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'}
                                backdropFilter="blur(8px)"
                                border={`1px solid ${stats.hasPendingPayments ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`}
                                borderRadius="16px"
                                p={{ base: 4, sm: 5 }}
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: `0 8px 25px ${stats.hasPendingPayments ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                }}
                                transition="all 0.2s ease"
                            >
                                <VStack spacing={3}>
                                    <HStack spacing={3} w="full" justify="space-between">
                                        <VStack align="start" spacing={1}>
                                            <Text
                                                fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                                                fontWeight="bold"
                                                color={stats.hasPendingPayments ? '#f59e0b' : '#10b981'}
                                            >
                                                {formatCurrency(stats.totalPending)}
                                            </Text>
                                            <Text
                                                fontSize={{ base: "xs", sm: "sm" }}
                                                color="#666666"
                                                fontWeight="medium"
                                                textAlign="left"
                                            >
                                                {stats.hasPendingPayments ? "Pembayaran Tertunda" : "Tidak Ada Pembayaran Tertunda"}
                                            </Text>
                                        </VStack>
                                        {stats.hasPendingPayments ? (
                                            <AlertCircle size={24} color="#f59e0b" />
                                        ) : (
                                            <CheckCircle size={24} color="#10b981" />
                                        )}
                                    </HStack>
                                </VStack>
                            </MotionBox>
                        </SimpleGrid>

                        {/* Pending Payment Alert */}
                        {stats.hasPendingPayments && (
                            <MotionBox
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                bg="rgba(245, 158, 11, 0.08)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(245, 158, 11, 0.2)"
                                borderRadius="12px"
                                p={{ base: 3, sm: 4 }}
                            >
                                <HStack justify="space-between" align="center" spacing={3} flexWrap="wrap">
                                    <HStack spacing={3} flex={1} minW="200px">
                                        <Box
                                            w={8}
                                            h={8}
                                            bg="rgba(245, 158, 11, 0.15)"
                                            borderRadius="8px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            border="1px solid rgba(245, 158, 11, 0.2)"
                                        >
                                            <AlertCircle size={16} color="#f59e0b" />
                                        </Box>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" fontWeight="semibold" color="#d97706">
                                                Anda memiliki pembayaran yang belum diselesaikan
                                            </Text>
                                            <Text fontSize="xs" color="#92400e">
                                                Total: {formatCurrency(stats.totalPending)}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <Button
                                        size="sm"
                                        bg="rgba(245, 158, 11, 0.15)"
                                        color="#f59e0b"
                                        border="1px solid rgba(245, 158, 11, 0.3)"
                                        borderRadius="8px"
                                        leftIcon={<DollarSign size={16} />}
                                        onClick={() => onPayNow && onPayNow()}
                                        _hover={{
                                            bg: "rgba(245, 158, 11, 0.2)",
                                            borderColor: "rgba(245, 158, 11, 0.4)"
                                        }}
                                        flexShrink={0}
                                    >
                                        Bayar Sekarang
                                    </Button>
                                </HStack>
                            </MotionBox>
                        )}
                    </VStack>
                </Box>
            </MotionBox>
        </Container>
    );
};

export default TransactionHeader; 