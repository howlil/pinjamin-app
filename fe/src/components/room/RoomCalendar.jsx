import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    SimpleGrid,
    Button,
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Icon,
    Divider
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Activity } from 'lucide-react';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';

const MotionBox = motion(Box);

const RoomCalendar = ({
    reservations = [],
    onBookRoom,
    formatDate,
    getBookingStatusColor,
    getBookingStatusText
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get month and year
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Month names
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Day names
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // Navigation functions
    const navigateToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1));
    };

    const navigateToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1));
    };

    // Check if date has booking
    const getBookingForDate = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return reservations.find(res => res.date === dateStr);
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<Box key={`empty-${i}`} />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const booking = getBookingForDate(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const isPastDate = new Date(year, month, day) < new Date().setHours(0, 0, 0, 0);

            days.push(
                <MotionBox
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Box
                        p={2}
                        minH="60px"
                        bg={
                            isToday
                                ? `${COLORS.primary}20`
                                : booking
                                    ? booking.status === 'approved'
                                        ? 'red.100'
                                        : 'yellow.100'
                                    : 'rgba(255, 255, 255, 0.5)'
                        }
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={
                            isToday
                                ? COLORS.primary
                                : booking
                                    ? booking.status === 'approved'
                                        ? 'red.300'
                                        : 'yellow.300'
                                    : 'rgba(255, 255, 255, 0.3)'
                        }
                        cursor={booking ? 'pointer' : isPastDate ? 'not-allowed' : 'pointer'}
                        onClick={() => {
                            if (booking) {
                                setSelectedBooking(booking);
                                onOpen();
                            } else if (!isPastDate && onBookRoom) {
                                onBookRoom();
                            }
                        }}
                        opacity={isPastDate && !booking ? 0.5 : 1}
                        _hover={{
                            bg: booking
                                ? booking.status === 'approved'
                                    ? 'red.200'
                                    : 'yellow.200'
                                : isPastDate
                                    ? 'rgba(255, 255, 255, 0.5)'
                                    : `${COLORS.primary}10`,
                            transform: 'translateY(-1px)',
                            boxShadow: SHADOWS.md
                        }}
                        transition="all 0.2s"
                    >
                        <VStack spacing={1} align="stretch">
                            <Text
                                fontSize="sm"
                                fontWeight={isToday ? 'bold' : 'medium'}
                                color={isToday ? COLORS.primary : COLORS.black}
                            >
                                {day}
                            </Text>
                            {booking && (
                                <Badge
                                    size="xs"
                                    colorScheme={getBookingStatusColor ? getBookingStatusColor(booking.booking?.status) : 'green'}
                                    borderRadius="full"
                                    fontSize="8px"
                                    px={1}
                                    py={0.5}
                                    textAlign="center"
                                >
                                    {getBookingStatusText ? getBookingStatusText(booking.booking?.status) : booking.status}
                                </Badge>
                            )}
                        </VStack>
                    </Box>
                </MotionBox>
            );
        }

        return days;
    };

    const handleBookingDetailClose = () => {
        setSelectedBooking(null);
        onClose();
    };

    return (
        <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            bg={GLASS.background}
            backdropFilter={GLASS.backdropFilter}
            border={GLASS.border}
            borderRadius="20px"
            boxShadow={SHADOWS.glass}
            p={6}
        >
            <VStack spacing={6} align="stretch">
                {/* Calendar Header */}
                <HStack justify="space-between" align="center">
                    <Heading size="md" color={COLORS.black}>
                        <HStack spacing={2}>
                            <Icon as={Calendar} color={COLORS.primary} />
                            <Text>Kalender Booking</Text>
                        </HStack>
                    </Heading>

                    <HStack spacing={2}>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={navigateToPreviousMonth}
                            _hover={{ bg: `${COLORS.primary}20` }}
                        >
                            <ChevronLeft size={16} />
                        </Button>

                        <Text fontWeight="semibold" color={COLORS.black} minW="150px" textAlign="center">
                            {monthNames[month]} {year}
                        </Text>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={navigateToNextMonth}
                            _hover={{ bg: `${COLORS.primary}20` }}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </HStack>
                </HStack>

                {/* Calendar Legend */}
                <HStack spacing={4} justify="center" flexWrap="wrap">
                    <HStack spacing={2}>
                        <Box w={3} h={3} bg="green.400" borderRadius="full" />
                        <Text fontSize="xs" color={COLORS.gray[600]}>Tersedia</Text>
                    </HStack>
                    <HStack spacing={2}>
                        <Box w={3} h={3} bg="red.400" borderRadius="full" />
                        <Text fontSize="xs" color={COLORS.gray[600]}>Disetujui</Text>
                    </HStack>
                    <HStack spacing={2}>
                        <Box w={3} h={3} bg="yellow.400" borderRadius="full" />
                        <Text fontSize="xs" color={COLORS.gray[600]}>Menunggu</Text>
                    </HStack>
                </HStack>

                {/* Day headers */}
                <SimpleGrid columns={7} spacing={2}>
                    {dayNames.map(day => (
                        <Text
                            key={day}
                            textAlign="center"
                            fontSize="sm"
                            fontWeight="semibold"
                            color={COLORS.gray[600]}
                            py={2}
                        >
                            {day}
                        </Text>
                    ))}
                </SimpleGrid>

                {/* Calendar Grid */}
                <SimpleGrid columns={7} spacing={2} minH="300px">
                    {generateCalendarDays()}
                </SimpleGrid>

                {/* Book Room Button */}
                <Button
                    colorScheme="green"
                    bg={COLORS.primary}
                    _hover={{ bg: COLORS.primary, opacity: 0.9 }}
                    size="lg"
                    borderRadius="full"
                    onClick={onBookRoom}
                >
                    Pesan Ruangan
                </Button>
            </VStack>

            {/* Booking Detail Modal */}
            <Modal isOpen={isOpen} onClose={handleBookingDetailClose} size="md">
                <ModalOverlay backdropFilter="blur(10px)" />
                <ModalContent
                    bg={GLASS.background}
                    backdropFilter={GLASS.backdropFilter}
                    border={GLASS.border}
                    borderRadius="20px"
                    mx={4}
                >
                    <ModalHeader color={COLORS.black}>
                        <HStack spacing={2}>
                            <Icon as={Calendar} color={COLORS.primary} />
                            <Text>Detail Booking</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedBooking && selectedBooking.booking && (
                            <VStack spacing={4} align="stretch">
                                <Box
                                    p={4}
                                    bg="rgba(255, 255, 255, 0.5)"
                                    borderRadius="lg"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                >
                                    <VStack spacing={3} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontWeight="semibold" color={COLORS.black}>
                                                Status Booking
                                            </Text>
                                            <Badge
                                                colorScheme={getBookingStatusColor ? getBookingStatusColor(selectedBooking.booking.status) : 'green'}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                            >
                                                {getBookingStatusText ? getBookingStatusText(selectedBooking.booking.status) : selectedBooking.booking.status}
                                            </Badge>
                                        </HStack>

                                        <Divider />

                                        <VStack spacing={2} align="stretch">
                                            <HStack>
                                                <Icon as={Calendar} size="16" color={COLORS.primary} />
                                                <Text fontSize="sm" color={COLORS.gray[600]}>Tanggal:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                    {formatDate ? formatDate(selectedBooking.booking.startDate) : selectedBooking.booking.startDate} - {formatDate ? formatDate(selectedBooking.booking.endDate) : selectedBooking.booking.endDate}
                                                </Text>
                                            </HStack>

                                            <HStack>
                                                <Icon as={Clock} size="16" color={COLORS.primary} />
                                                <Text fontSize="sm" color={COLORS.gray[600]}>Waktu:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                    {selectedBooking.booking.startTime} - {selectedBooking.booking.endTime}
                                                </Text>
                                            </HStack>

                                            <HStack>
                                                <Icon as={User} size="16" color={COLORS.primary} />
                                                <Text fontSize="sm" color={COLORS.gray[600]}>Peminjam:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                    {selectedBooking.booking.borrowerDetail?.borrowerName || 'Tidak tersedia'}
                                                </Text>
                                            </HStack>

                                            <HStack align="start">
                                                <Icon as={Activity} size="16" color={COLORS.primary} mt={0.5} />
                                                <Text fontSize="sm" color={COLORS.gray[600]}>Kegiatan:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                    {selectedBooking.booking.borrowerDetail?.activityName || 'Tidak tersedia'}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </VStack>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </MotionBox>
    );
};

export default RoomCalendar;
