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
    Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Calendar, Filter, RefreshCw, Clock } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';

const BookingHistoryHeader = ({
    totalItems = 0,
    statusFilter = '',
    onStatusFilter,
    onRefresh
}) => {
    // Status options for filter
    const statusOptions = [
        { value: '', label: 'Semua Status' },
        { value: 'PROCESSING', label: 'Diproses' },
        { value: 'APPROVED', label: 'Disetujui' },
        { value: 'REJECTED', label: 'Ditolak' },
        { value: 'COMPLETED', label: 'Selesai' }
    ];

    // Get status counts (mock data - in real app this would come from API)
    const getStatusCounts = () => ({
        total: totalItems,
        processing: Math.floor(totalItems * 0.2),
        approved: Math.floor(totalItems * 0.3),
        completed: Math.floor(totalItems * 0.4),
        rejected: Math.floor(totalItems * 0.1)
    });

    const statusCounts = getStatusCounts();

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
                                <Calendar size={20} color={COLORS.primary} />
                            </Box>
                            <VStack align="start" spacing={0}>
                                <Text fontSize="xl" fontWeight="bold" color={COLORS.black}>
                                    Riwayat Peminjaman
                                </Text>
                                <Text fontSize="sm" color={COLORS.gray[500]}>
                                    Kelola dan pantau riwayat peminjaman Anda
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
                        minW="140px"
                    >
                        <VStack spacing={1}>
                            <Text fontSize="2xl" fontWeight="bold" color={COLORS.primary}>
                                {statusCounts.total}
                            </Text>
                            <Text fontSize="sm" color={COLORS.gray[600]}>
                                Total Peminjaman
                            </Text>
                        </VStack>
                    </Box>

                    <Box
                        bg="orange.50"
                        rounded="lg"
                        p={4}
                        minW="120px"
                    >
                        <VStack spacing={1}>
                            <Text fontSize="xl" fontWeight="bold" color="orange.600">
                                {statusCounts.processing}
                            </Text>
                            <Text fontSize="sm" color="orange.600">
                                Diproses
                            </Text>
                        </VStack>
                    </Box>

                    <Box
                        bg="green.50"
                        rounded="lg"
                        p={4}
                        minW="120px"
                    >
                        <VStack spacing={1}>
                            <Text fontSize="xl" fontWeight="bold" color="green.600">
                                {statusCounts.approved}
                            </Text>
                            <Text fontSize="sm" color="green.600">
                                Disetujui
                            </Text>
                        </VStack>
                    </Box>

                    <Box
                        bg="blue.50"
                        rounded="lg"
                        p={4}
                        minW="120px"
                    >
                        <VStack spacing={1}>
                            <Text fontSize="xl" fontWeight="bold" color="blue.600">
                                {statusCounts.completed}
                            </Text>
                            <Text fontSize="sm" color="blue.600">
                                Selesai
                            </Text>
                        </VStack>
                    </Box>

                    <Box
                        bg="red.50"
                        rounded="lg"
                        p={4}
                        minW="120px"
                    >
                        <VStack spacing={1}>
                            <Text fontSize="xl" fontWeight="bold" color="red.600">
                                {statusCounts.rejected}
                            </Text>
                            <Text fontSize="sm" color="red.600">
                                Ditolak
                            </Text>
                        </VStack>
                    </Box>
                </HStack>

                {/* Filters */}
                <HStack spacing={4} align="center">
                    <HStack spacing={2}>
                        <Filter size={16} color={COLORS.gray[500]} />
                        <Text fontSize="sm" color={COLORS.gray[600]} fontWeight="medium">
                            Filter:
                        </Text>
                    </HStack>

                    <Select
                        value={statusFilter}
                        onChange={(e) => onStatusFilter(e.target.value)}
                        size="sm"
                        maxW="200px"
                        bg="white"
                        borderColor={COLORS.gray[300]}
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>

                    {statusFilter && (
                        <Badge
                            colorScheme="green"
                            variant="subtle"
                            rounded="full"
                            px={2}
                            py={1}
                            fontSize="xs"
                        >
                            Filter Aktif
                        </Badge>
                    )}

                    {statusFilter && (
                        <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            onClick={() => onStatusFilter('')}
                            fontSize="xs"
                        >
                            Reset
                        </Button>
                    )}
                </HStack>
            </Box>
        </motion.div>
    );
};

export default BookingHistoryHeader; 