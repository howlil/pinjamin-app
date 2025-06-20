import React from 'react';
import {
    Box,
    Heading,
    Text,
    HStack,
    IconButton,
    Tooltip,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, FileText } from 'lucide-react';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';

const MotionBox = motion(Box);

const HistoryHeader = ({
    stats,
    formatCurrency,
    onRefresh,
    onExport,
    onGenerateReport
}) => {
    return (
        <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <Box
                bg={GLASS.background}
                backdropFilter={GLASS.backdropFilter}
                border={GLASS.border}
                borderRadius="20px"
                boxShadow={SHADOWS.glass}
                p={6}
                mb={6}
            >
                <HStack justify="space-between" align="start">
                    <Box>
                        <Heading size="lg" color={COLORS.black} mb={2}>
                            Riwayat Peminjaman
                        </Heading>
                        <Text color={COLORS.gray[600]} fontSize="md">
                            Kelola dan pantau semua aktivitas peminjaman Anda
                        </Text>
                    </Box>

                    <HStack spacing={2}>
                        <Tooltip label="Refresh Data">
                            <IconButton
                                icon={<RefreshCw size={18} />}
                                onClick={onRefresh}
                                variant="ghost"
                                size="sm"
                                borderRadius="lg"
                                _hover={{ bg: `${COLORS.primary}20` }}
                            />
                        </Tooltip>
                        <Tooltip label="Export Data">
                            <IconButton
                                icon={<Download size={18} />}
                                onClick={onExport}
                                variant="ghost"
                                size="sm"
                                borderRadius="lg"
                                _hover={{ bg: `${COLORS.primary}20` }}
                            />
                        </Tooltip>
                        <Tooltip label="Generate Report">
                            <IconButton
                                icon={<FileText size={18} />}
                                onClick={onGenerateReport}
                                variant="ghost"
                                size="sm"
                                borderRadius="lg"
                                _hover={{ bg: `${COLORS.primary}20` }}
                            />
                        </Tooltip>
                    </HStack>
                </HStack>
            </Box>

            {/* Stats Grid */}
            <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
                <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    bg={GLASS.background}
                    backdropFilter={GLASS.backdropFilter}
                    border={GLASS.border}
                    borderRadius="16px"
                    boxShadow={SHADOWS.glass}
                    p={4}
                >
                    <Stat>
                        <StatLabel color={COLORS.gray[600]} fontSize="sm">
                            Total Peminjaman
                        </StatLabel>
                        <StatNumber color={COLORS.black} fontSize="2xl">
                            {stats.total}
                        </StatNumber>
                        <StatHelpText color={COLORS.gray[500]}>
                            Sepanjang masa
                        </StatHelpText>
                    </Stat>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    bg={GLASS.background}
                    backdropFilter={GLASS.backdropFilter}
                    border={GLASS.border}
                    borderRadius="16px"
                    boxShadow={SHADOWS.glass}
                    p={4}
                >
                    <Stat>
                        <StatLabel color={COLORS.gray[600]} fontSize="sm">
                            Sedang Aktif
                        </StatLabel>
                        <StatNumber color="blue.500" fontSize="2xl">
                            {stats.active}
                        </StatNumber>
                        <StatHelpText color={COLORS.gray[500]}>
                            Saat ini
                        </StatHelpText>
                    </Stat>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    bg={GLASS.background}
                    backdropFilter={GLASS.backdropFilter}
                    border={GLASS.border}
                    borderRadius="16px"
                    boxShadow={SHADOWS.glass}
                    p={4}
                >
                    <Stat>
                        <StatLabel color={COLORS.gray[600]} fontSize="sm">
                            Selesai
                        </StatLabel>
                        <StatNumber color="green.500" fontSize="2xl">
                            {stats.returned}
                        </StatNumber>
                        <StatHelpText color={COLORS.gray[500]}>
                            Dikembalikan
                        </StatHelpText>
                    </Stat>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    bg={GLASS.background}
                    backdropFilter={GLASS.backdropFilter}
                    border={GLASS.border}
                    borderRadius="16px"
                    boxShadow={SHADOWS.glass}
                    p={4}
                >
                    <Stat>
                        <StatLabel color={COLORS.gray[600]} fontSize="sm">
                            Terlambat
                        </StatLabel>
                        <StatNumber color="red.500" fontSize="2xl">
                            {stats.overdue}
                        </StatNumber>
                        <StatHelpText color={COLORS.gray[500]}>
                            Perlu perhatian
                        </StatHelpText>
                    </Stat>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    bg={GLASS.background}
                    backdropFilter={GLASS.backdropFilter}
                    border={GLASS.border}
                    borderRadius="16px"
                    boxShadow={SHADOWS.glass}
                    p={4}
                >
                    <Stat>
                        <StatLabel color={COLORS.gray[600]} fontSize="sm">
                            Total Biaya
                        </StatLabel>
                        <StatNumber color={COLORS.primary} fontSize="lg">
                            {formatCurrency(stats.totalCost)}
                        </StatNumber>
                        <StatHelpText color={COLORS.gray[500]}>
                            Keseluruhan
                        </StatHelpText>
                    </Stat>
                </MotionBox>
            </SimpleGrid>
        </MotionBox>
    );
};

export default HistoryHeader; 