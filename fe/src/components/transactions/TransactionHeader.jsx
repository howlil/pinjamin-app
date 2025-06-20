import React from 'react';
import {
    Box,
    Text,
    HStack,
    VStack,
    Button,
    IconButton,
    Tooltip,
    Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CreditCard, RefreshCw, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';

const TransactionHeader = ({
    totalPending = 0,
    totalTransactions = 0,
    formatCurrency,
    onRefresh,
    onPayNow
}) => {
    // Calculate statistics
    const getStats = () => ({
        totalPending,
        totalTransactions,
        hasPendingPayments: totalPending > 0
    });

    const stats = getStats();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                bg="white"
                rounded="20px"
                shadow={SHADOWS.soft}
                p={6}
                mb={6}
            >
                {/* Title and Actions */}
                <HStack justify="space-between" align="center" mb={6}>
                    <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                            <Box
                                w={10}
                                h={10}
                                bg={`${COLORS.primary}20`}
                                rounded="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <CreditCard size={20} color={COLORS.primary} />
                            </Box>
                            <VStack align="start" spacing={0}>
                                <Text fontSize="xl" fontWeight="bold" color={COLORS.black}>
                                    Riwayat Transaksi
                                </Text>
                                <Text fontSize="sm" color={COLORS.gray[500]}>
                                    Kelola pembayaran dan riwayat transaksi Anda
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>

                    <HStack spacing={2}>
                        <Tooltip label="Refresh data">
                            <IconButton
                                icon={<RefreshCw size={16} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="green"
                                onClick={onRefresh}
                            />
                        </Tooltip>
                    </HStack>
                </HStack>

                {/* Stats Cards */}
                <HStack spacing={4} mb={6} wrap="wrap">
                    <Box
                        bg={`${COLORS.primary}10`}
                        rounded="lg"
                        p={4}
                        minW="160px"
                    >
                        <VStack spacing={1}>
                            <Text fontSize="2xl" fontWeight="bold" color={COLORS.primary}>
                                {stats.totalTransactions}
                            </Text>
                            <Text fontSize="sm" color={COLORS.gray[600]}>
                                Total Transaksi
                            </Text>
                        </VStack>
                    </Box>

                    <Box
                        bg={stats.hasPendingPayments ? "orange.50" : "green.50"}
                        rounded="lg"
                        p={4}
                        minW="200px"
                    >
                        <VStack spacing={2}>
                            <HStack spacing={2}>
                                {stats.hasPendingPayments ? (
                                    <AlertCircle size={20} color="orange" />
                                ) : (
                                    <CheckCircle size={20} color="green" />
                                )}
                                <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={stats.hasPendingPayments ? "orange.600" : "green.600"}
                                >
                                    {formatCurrency(stats.totalPending)}
                                </Text>
                            </HStack>
                            <Text
                                fontSize="sm"
                                color={stats.hasPendingPayments ? "orange.600" : "green.600"}
                                textAlign="center"
                            >
                                {stats.hasPendingPayments ? "Pembayaran Tertunda" : "Tidak Ada Pembayaran Tertunda"}
                            </Text>
                        </VStack>
                    </Box>
                </HStack>

                {/* Pending Payment Alert */}
                {stats.hasPendingPayments && (
                    <Box
                        bg="orange.50"
                        border="1px"
                        borderColor="orange.200"
                        rounded="lg"
                        p={4}
                    >
                        <HStack justify="space-between" align="center">
                            <HStack spacing={3}>
                                <AlertCircle size={20} color="orange" />
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" fontWeight="semibold" color="orange.700">
                                        Anda memiliki pembayaran yang belum diselesaikan
                                    </Text>
                                    <Text fontSize="xs" color="orange.600">
                                        Total: {formatCurrency(stats.totalPending)}
                                    </Text>
                                </VStack>
                            </HStack>
                            <Button
                                size="sm"
                                colorScheme="orange"
                                leftIcon={<DollarSign size={16} />}
                                onClick={() => onPayNow && onPayNow()}
                            >
                                Bayar Sekarang
                            </Button>
                        </HStack>
                    </Box>
                )}
            </Box>
        </motion.div>
    );
};

export default TransactionHeader; 