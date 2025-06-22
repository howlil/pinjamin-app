import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Badge,
    VStack,
    HStack,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    IconButton,
    Tooltip,
    useBreakpointValue,
    Container
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Eye, Calendar, Clock, MapPin, User, RefreshCw, FileText, Activity } from 'lucide-react';
import { COLORS, SHADOWS } from '../../../utils/designTokens';
import { AdminPagination } from '../../admin/common';
import { AnimatedGridPattern } from '../../magicui/animated-grid-pattern';

const MotionBox = motion(Box);
const MotionTr = motion.tr;

const BookingHistoryTable = ({
    bookings = [],
    loading = false,
    error = null,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange,
    onRefresh,
    getStatusBadge,
    getStatusText
}) => {
    // Responsive values
    const containerPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const tableSize = useBreakpointValue({ base: "sm", md: "md" });
    const showDesktop = useBreakpointValue({ base: false, md: true });

    // Format date from DD-MM-YYYY to readable format
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const [day, month, year] = dateString.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (err) {
            return dateString;
        }
    };

    // Format time from HH:MM to readable format
    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return `${timeString} WIB`;
    };

    // Loading state
    if (loading) {
        return (
            <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    p={8}
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                >
                    <AnimatedGridPattern
                        numSquares={20}
                        maxOpacity={0.04}
                        duration={3}
                        repeatDelay={1.5}
                        className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                    />
                    <VStack spacing={4} position="relative" zIndex={1}>
                        <Spinner size="xl" color={COLORS.primary} thickness="3px" />
                        <Text color="#444444" fontSize="sm">Memuat riwayat peminjaman...</Text>
                    </VStack>
                </MotionBox>
            </Container>
        );
    }

    // Error state
    if (error) {
        return (
            <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(239, 68, 68, 0.1)"
                    p={containerPadding}
                    position="relative"
                    overflow="hidden"
                >
                    <Alert
                        status="error"
                        borderRadius="12px"
                        bg="rgba(254, 226, 226, 0.8)"
                        backdropFilter="blur(8px)"
                        border="1px solid rgba(239, 68, 68, 0.2)"
                    >
                        <AlertIcon color="red.500" />
                        <VStack align="start" spacing={2}>
                            <Text fontWeight="semibold" color="#444444">Gagal memuat data</Text>
                            <Text fontSize="sm" color="#666666">{error}</Text>
                            <Button
                                size="sm"
                                bg="rgba(239, 68, 68, 0.1)"
                                color="#ef4444"
                                border="1px solid rgba(239, 68, 68, 0.2)"
                                leftIcon={<RefreshCw size={16} />}
                                onClick={onRefresh}
                                _hover={{
                                    bg: "rgba(239, 68, 68, 0.15)"
                                }}
                            >
                                Coba Lagi
                            </Button>
                        </VStack>
                    </Alert>
                </MotionBox>
            </Container>
        );
    }

    // Empty state
    if (!bookings || bookings.length === 0) {
        return (
            <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    p={8}
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                >
                    <AnimatedGridPattern
                        numSquares={25}
                        maxOpacity={0.03}
                        duration={4}
                        repeatDelay={2}
                        className="absolute inset-0 h-full w-full fill-[#749c73]/6 stroke-[#749c73]/3"
                    />
                    <VStack spacing={4} position="relative" zIndex={1}>
                        <MotionBox
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            w={16}
                            h={16}
                            bg="rgba(116, 156, 115, 0.15)"
                            borderRadius="16px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                        >
                            <Calendar size={32} color={COLORS.primary} />
                        </MotionBox>
                        <VStack spacing={2}>
                            <Text fontSize="lg" fontWeight="semibold" color="#444444">
                                Belum ada riwayat peminjaman
                            </Text>
                            <Text color="#666666" fontSize="sm">
                                Riwayat peminjaman Anda akan muncul di sini
                            </Text>
                        </VStack>
                    </VStack>
                </MotionBox>
            </Container>
        );
    }

    return (
        <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="20px"
                boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                overflow="hidden"
                position="relative"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                />

                {/* Header */}
                <Box
                    p={containerPadding}
                    borderBottom="1px solid rgba(255, 255, 255, 0.12)"
                    position="relative"
                    zIndex={1}
                >
                    <HStack justify="space-between" align="center">
                        <HStack spacing={3}>
                            <Box
                                w={8}
                                h={8}
                                bg="rgba(116, 156, 115, 0.15)"
                                borderRadius="10px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                            >
                                <FileText size={16} color={COLORS.primary} />
                            </Box>
                            <VStack align="start" spacing={0}>
                                <Text fontSize="lg" fontWeight="bold" color="#444444">
                                    Riwayat Peminjaman
                                </Text>
                                <Text fontSize="sm" color="#666666">
                                    Total {totalItems} peminjaman
                                </Text>
                            </VStack>
                        </HStack>
                        <Tooltip label="Refresh data">
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
                </Box>

                {/* Table */}
                <Box overflowX="auto" position="relative" zIndex={1}>
                    <Table variant="simple" size={tableSize}>
                        <Thead>
                            <Tr>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    No
                                </Th>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    Gedung
                                </Th>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    Kegiatan
                                </Th>
                                {showDesktop && (
                                    <Th
                                        color="#444444"
                                        fontWeight="bold"
                                        fontSize="xs"
                                        bg="rgba(116, 156, 115, 0.08)"
                                        borderColor="rgba(255, 255, 255, 0.1)"
                                    >
                                        Tanggal
                                    </Th>
                                )}
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    Waktu
                                </Th>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    Status
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bookings.map((booking, index) => (
                                <MotionTr
                                    key={booking.bookingId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                        }
                                    }}
                                >
                                    <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                        <Text fontSize="sm" color="#444444" fontWeight="medium">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </Text>
                                    </Td>
                                    <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" fontWeight="semibold" color="#444444">
                                                {booking.buildingName || 'N/A'}
                                            </Text>
                                            <HStack spacing={1}>
                                                <MapPin size={12} color="#999999" />
                                                <Text fontSize="xs" color="#666666">
                                                    ID: {booking.bookingId?.slice(-8) || 'N/A'}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Td>
                                    <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                        <HStack spacing={2}>
                                            <Activity size={14} color={COLORS.primary} />
                                            <Text fontSize="sm" color="#444444" noOfLines={2}>
                                                {booking.activityName || 'N/A'}
                                            </Text>
                                        </HStack>
                                    </Td>
                                    {showDesktop && (
                                        <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                            <VStack align="start" spacing={1}>
                                                <HStack spacing={1}>
                                                    <Calendar size={12} color="#999999" />
                                                    <Text fontSize="xs" color="#666666">
                                                        {formatDate(booking.startDate)}
                                                    </Text>
                                                </HStack>
                                                {booking.endDate && booking.endDate !== booking.startDate && (
                                                    <HStack spacing={1}>
                                                        <Calendar size={12} color="#999999" />
                                                        <Text fontSize="xs" color="#666666">
                                                            {formatDate(booking.endDate)}
                                                        </Text>
                                                    </HStack>
                                                )}
                                            </VStack>
                                        </Td>
                                    )}
                                    <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                        <HStack spacing={1}>
                                            <Clock size={12} color="#999999" />
                                            <Text fontSize="xs" color="#666666">
                                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                            </Text>
                                        </HStack>
                                    </Td>
                                    <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                        <Badge
                                            bg={getStatusBadge(booking.status) === 'green' ? 'rgba(16, 185, 129, 0.15)' :
                                                getStatusBadge(booking.status) === 'orange' ? 'rgba(245, 158, 11, 0.15)' :
                                                    getStatusBadge(booking.status) === 'red' ? 'rgba(239, 68, 68, 0.15)' :
                                                        'rgba(59, 130, 246, 0.15)'}
                                            color={getStatusBadge(booking.status) === 'green' ? '#10b981' :
                                                getStatusBadge(booking.status) === 'orange' ? '#f59e0b' :
                                                    getStatusBadge(booking.status) === 'red' ? '#ef4444' :
                                                        '#3b82f6'}
                                            borderRadius="full"
                                            px={3}
                                            py={1}
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            border={`1px solid ${getStatusBadge(booking.status) === 'green' ? 'rgba(16, 185, 129, 0.3)' :
                                                getStatusBadge(booking.status) === 'orange' ? 'rgba(245, 158, 11, 0.3)' :
                                                    getStatusBadge(booking.status) === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                                                        'rgba(59, 130, 246, 0.3)'
                                                }`}
                                        >
                                            {getStatusText(booking.status)}
                                        </Badge>
                                    </Td>
                                </MotionTr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box
                        p={containerPadding}
                        borderTop="1px solid rgba(255, 255, 255, 0.12)"
                        position="relative"
                        zIndex={1}
                    >
                        <AdminPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            onPageChange={onPageChange}
                        />
                    </Box>
                )}
            </MotionBox>
        </Container>
    );
};

export default BookingHistoryTable; 