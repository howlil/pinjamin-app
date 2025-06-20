import React from 'react';
import {
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    HStack,
    Avatar,
    VStack,
    Flex
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, SHADOWS, RADII } from '@/utils/designTokens';
import { GlassCard } from '@/components/ui';

// Sample data - would typically come from props
const defaultBookings = [
    {
        id: 1,
        room: 'Auditorium Utama',
        borrower: 'Ahmad Fauzi',
        date: '24 Mar 2024',
        status: 'diproses',
        avatar: null
    },
    {
        id: 2,
        room: 'Seminar Gedung F',
        borrower: 'Dewi Safitri',
        date: '25 Mar 2024',
        status: 'disetujui',
        avatar: null
    },
    {
        id: 3,
        room: 'Ruang Rapat A',
        borrower: 'Budi Santoso',
        date: '26 Mar 2024',
        status: 'ditolak',
        avatar: null
    }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'disetujui':
            return 'green';
        case 'diproses':
            return 'orange';
        case 'ditolak':
            return 'red';
        default:
            return 'gray';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'disetujui':
            return 'DISETUJUI';
        case 'diproses':
            return 'DIPROSES';
        case 'ditolak':
            return 'DITOLAK';
        default:
            return status.toUpperCase();
    }
};

const RecentBookingsTable = ({ bookings = defaultBookings, onRowClick }) => {
    return (
        <GlassCard p={6}>
            <Text
                fontSize="lg"
                fontWeight="semibold"
                color={COLORS.black}
                mb={6}
            >
                Peminjaman Terbaru
            </Text>

            <Box overflowX="auto">
                <Table size="sm" variant="simple">
                    <Thead>
                        <Tr>
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                Ruangan
                            </Th>
                            <Th
                                color={COLORS.gray[600]}
                                fontSize="xs"
                                fontWeight="semibold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                borderColor={`${COLORS.primary}20`}
                            >
                                Peminjam
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
                                Status
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bookings.map((booking, index) => (
                            <motion.tr
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                onClick={() => onRowClick && onRowClick(booking)}
                            >
                                <Td
                                    borderColor={`${COLORS.primary}10`}
                                    py={4}
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color={COLORS.black}
                                    >
                                        {booking.room}
                                    </Text>
                                </Td>
                                <Td
                                    borderColor={`${COLORS.primary}10`}
                                    py={4}
                                >
                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={booking.borrower}
                                            bg={COLORS.primary}
                                            color="white"
                                            fontSize="xs"
                                        />
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color={COLORS.black}
                                        >
                                            {booking.borrower}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td
                                    borderColor={`${COLORS.primary}10`}
                                    py={4}
                                >
                                    <Text
                                        fontSize="sm"
                                        color={COLORS.gray[600]}
                                    >
                                        {booking.date}
                                    </Text>
                                </Td>
                                <Td
                                    borderColor={`${COLORS.primary}10`}
                                    py={4}
                                >
                                    <Badge
                                        colorScheme={getStatusColor(booking.status)}
                                        variant="subtle"
                                        fontSize="xs"
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                        fontWeight="semibold"
                                        textTransform="uppercase"
                                    >
                                        {getStatusText(booking.status)}
                                    </Badge>
                                </Td>
                            </motion.tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {bookings.length === 0 && (
                <Box
                    textAlign="center"
                    py={8}
                    color={COLORS.gray[500]}
                >
                    <Text fontSize="sm">Belum ada data peminjaman</Text>
                </Box>
            )}
        </GlassCard>
    );
};

export default RecentBookingsTable; 