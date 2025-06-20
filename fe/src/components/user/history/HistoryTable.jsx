import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
    VStack,
    HStack,
    Avatar
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';
import { DataStateHandler } from '@/components/admin/common';

const MotionTr = motion(Tr);

const HistoryTable = ({
    data = [],
    loading,
    error,
    getStatusBadge,
    getStatusText,
    formatDate,
    formatCurrency
}) => {
    if (loading || error || !data || data.length === 0) {
        return (
            <DataStateHandler
                loading={loading}
                error={error}
                isEmpty={!data || data.length === 0}
                emptyMessage="Belum ada riwayat peminjaman"
                emptyDescription="Riwayat peminjaman Anda akan muncul di sini"
            />
        );
    }

    return (
        <Box
            bg={GLASS.background}
            backdropFilter={GLASS.backdropFilter}
            border={GLASS.border}
            borderRadius="20px"
            boxShadow={SHADOWS.glass}
            overflow="hidden"
        >
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr bg="rgba(255, 255, 255, 0.1)">
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                No
                            </Th>
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                Item
                            </Th>
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                Tanggal
                            </Th>
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                Durasi
                            </Th>
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                Biaya
                            </Th>
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                Status
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((item, index) => (
                            <MotionTr
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                _hover={{ bg: `${COLORS.primary}05` }}
                            >
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                        {index + 1}
                                    </Text>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={item.itemTitle}
                                            bg={COLORS.primary}
                                            color="white"
                                            fontSize="xs"
                                        />
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                {item.itemTitle || 'Unknown Item'}
                                            </Text>
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                {item.building || 'Unknown Building'}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="sm" color={COLORS.black}>
                                            Pinjam: {formatDate(item.borrowDate)}
                                        </Text>
                                        <Text fontSize="xs" color={COLORS.gray[500]}>
                                            Kembali: {formatDate(item.returnDate)}
                                        </Text>
                                        {item.actualReturnDate && (
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                Actual: {formatDate(item.actualReturnDate)}
                                            </Text>
                                        )}
                                    </VStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                        {item.duration || 'N/A'}
                                    </Text>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Text fontSize="sm" fontWeight="bold" color={COLORS.black}>
                                        {formatCurrency(item.cost || 0)}
                                    </Text>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Badge
                                        colorScheme={getStatusBadge(item.status)}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="medium"
                                    >
                                        {getStatusText(item.status)}
                                    </Badge>
                                </Td>
                            </MotionTr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default HistoryTable; 