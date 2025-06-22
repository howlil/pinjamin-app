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
    Flex,
    Icon,
    useBreakpointValue
} from '@chakra-ui/react';
import { Calendar, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const getStatusConfig = (status) => {
    switch (status) {
        case 'disetujui':
        case 'APPROVED':
            return {
                bg: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                label: 'DISETUJUI'
            };
        case 'diproses':
        case 'PROCESSING':
            return {
                bg: 'rgba(251, 146, 60, 0.15)',
                color: '#fb923c',
                border: '1px solid rgba(251, 146, 60, 0.2)',
                label: 'DIPROSES'
            };
        case 'ditolak':
        case 'REJECTED':
            return {
                bg: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                label: 'DITOLAK'
            };
        case 'selesai':
        case 'COMPLETED':
            return {
                bg: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                label: 'SELESAI'
            };
        default:
            return {
                bg: 'rgba(156, 163, 175, 0.15)',
                color: '#6b7280',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                label: status ? status.toUpperCase() : 'UNKNOWN'
            };
    }
};

const RecentBookingsTable = ({ bookings = [], onRowClick }) => {
    const cardPadding = useBreakpointValue({ base: 4, md: 5 });

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            bg="rgba(255, 255, 255, 0.08)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.12)"
            borderRadius="20px"
            boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
            p={cardPadding}
            position="relative"
            overflow="hidden"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
            }}
            style={{ transition: "all 0.3s ease" }}
        >
            {/* Background Pattern */}
            <AnimatedGridPattern
                numSquares={22}
                maxOpacity={0.04}
                duration={7}
                repeatDelay={3.5}
                className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
            />

            <Box position="relative" zIndex={1}>
                <HStack justify="space-between" align="center" mb={5}>
                    <HStack spacing={3}>
                        <Box
                            w={10}
                            h={10}
                            borderRadius="12px"
                            bg="rgba(116, 156, 115, 0.15)"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={Calendar} boxSize={5} color={COLORS.primary} />
                        </Box>
                        <Text
                            fontSize={{ base: "md", md: "lg" }}
                            fontWeight="bold"
                            color="#444444"
                        >
                            Peminjaman Terbaru
                        </Text>
                    </HStack>
                </HStack>

                <Box
                    overflowX="auto"
                    css={{
                        '&::-webkit-scrollbar': {
                            height: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(116, 156, 115, 0.3)',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: 'rgba(116, 156, 115, 0.5)',
                        },
                    }}
                >
                    <Table size="sm" variant="unstyled">
                        <Thead>
                            <Tr>
                                <Th
                                    color="#666666"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                    pb={3}
                                >
                                    <HStack spacing={2}>
                                        <Icon as={Calendar} boxSize={3} />
                                        <Text>Ruangan</Text>
                                    </HStack>
                                </Th>
                                <Th
                                    color="#666666"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                    pb={3}
                                >
                                    <HStack spacing={2}>
                                        <Icon as={User} boxSize={3} />
                                        <Text>Peminjam</Text>
                                    </HStack>
                                </Th>
                                <Th
                                    color="#666666"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                    pb={3}
                                >
                                    <HStack spacing={2}>
                                        <Icon as={Clock} boxSize={3} />
                                        <Text>Tanggal</Text>
                                    </HStack>
                                </Th>
                                <Th
                                    color="#666666"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                    pb={3}
                                >
                                    Status
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bookings.map((booking, index) => {
                                const statusConfig = getStatusConfig(booking.status);

                                return (
                                    <MotionTr
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.4 }}
                                        whileHover={{
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            scale: 1.01
                                        }}
                                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                        onClick={() => onRowClick && onRowClick(booking)}
                                        borderRadius="8px"
                                    >
                                        <Td
                                            borderBottom="1px solid rgba(255, 255, 255, 0.05)"
                                            py={4}
                                        >
                                            <Text
                                                fontSize="sm"
                                                fontWeight="semibold"
                                                color="#444444"
                                            >
                                                {booking.room || booking.buildingName || 'N/A'}
                                            </Text>
                                        </Td>
                                        <Td
                                            borderBottom="1px solid rgba(255, 255, 255, 0.05)"
                                            py={4}
                                        >
                                            <HStack spacing={3}>
                                                <Avatar
                                                    size="sm"
                                                    name={booking.borrower || booking.borrowerName || booking.user}
                                                    bg="rgba(116, 156, 115, 0.2)"
                                                    color={COLORS.primary}
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                />
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    color="#444444"
                                                >
                                                    {booking.borrower || booking.borrowerName || booking.user || 'N/A'}
                                                </Text>
                                            </HStack>
                                        </Td>
                                        <Td
                                            borderBottom="1px solid rgba(255, 255, 255, 0.05)"
                                            py={4}
                                        >
                                            <Text
                                                fontSize="sm"
                                                color="#666666"
                                                fontWeight="medium"
                                            >
                                                {booking.date || booking.startDate || 'N/A'}
                                            </Text>
                                        </Td>
                                        <Td
                                            borderBottom="1px solid rgba(255, 255, 255, 0.05)"
                                            py={4}
                                        >
                                            <Badge
                                                bg={statusConfig.bg}
                                                color={statusConfig.color}
                                                border={statusConfig.border}
                                                fontSize="xs"
                                                px={2}
                                                py={1}
                                                borderRadius="6px"
                                                fontWeight="bold"
                                            >
                                                {statusConfig.label}
                                            </Badge>
                                        </Td>
                                    </MotionTr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>

                {bookings.length === 0 && (
                    <Box
                        textAlign="center"
                        py={8}
                        color="#666666"
                    >
                        <Icon as={Calendar} boxSize={8} mb={3} color="#999999" />
                        <Text fontSize="sm" fontWeight="medium">
                            Belum ada data peminjaman
                        </Text>
                    </Box>
                )}
            </Box>
        </MotionBox>
    );
};

export default RecentBookingsTable; 