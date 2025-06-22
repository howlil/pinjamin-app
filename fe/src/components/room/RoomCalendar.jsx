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
    Divider,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Activity } from 'lucide-react';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

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

    // Responsive values
    const calendarPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const cellHeight = useBreakpointValue({ base: "50px", sm: "55px", md: "60px" });
    const headerSize = useBreakpointValue({ base: "sm", md: "md" });

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
        if (!reservations || !Array.isArray(reservations)) return null;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return reservations.find(res => res && res.date === dateStr);
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(
                <Box
                    key={`empty-${i}`}
                    minH={cellHeight}
                    bg="rgba(255, 255, 255, 0.02)"
                    borderRadius="8px"
                    border="1px solid rgba(255, 255, 255, 0.05)"
                />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const booking = getBookingForDate(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const isPastDate = new Date(year, month, day) < new Date().setHours(0, 0, 0, 0);

            days.push(
                <MotionBox
                    key={day}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    <Box
                        p={{ base: 2, sm: 3 }}
                        minH={cellHeight}
                        bg={
                            isToday
                                ? "rgba(116, 156, 115, 0.15)"
                                : booking
                                    ? booking.status === 'approved'
                                        ? 'rgba(239, 68, 68, 0.1)'
                                        : 'rgba(245, 158, 11, 0.1)'
                                    : 'rgba(255, 255, 255, 0.05)'
                        }
                        backdropFilter="blur(8px)"
                        borderRadius="10px"
                        border="1px solid"
                        borderColor={
                            isToday
                                ? "rgba(116, 156, 115, 0.3)"
                                : booking
                                    ? booking.status === 'approved'
                                        ? 'rgba(239, 68, 68, 0.2)'
                                        : 'rgba(245, 158, 11, 0.2)'
                                    : 'rgba(255, 255, 255, 0.1)'
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
                        opacity={isPastDate && !booking ? 0.4 : 1}
                        _hover={{
                            bg: booking
                                ? booking.status === 'approved'
                                    ? 'rgba(239, 68, 68, 0.15)'
                                    : 'rgba(245, 158, 11, 0.15)'
                                : isPastDate
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : "rgba(116, 156, 115, 0.1)",
                            borderColor: booking
                                ? booking.status === 'approved'
                                    ? 'rgba(239, 68, 68, 0.3)'
                                    : 'rgba(245, 158, 11, 0.3)'
                                : "rgba(116, 156, 115, 0.2)",
                            boxShadow: "0 4px 20px rgba(116, 156, 115, 0.1)"
                        }}
                        transition="all 0.2s ease"
                        position="relative"
                    >
                        <VStack spacing={1} align="stretch">
                            <Text
                                fontSize={{ base: "xs", sm: "sm" }}
                                fontWeight={isToday ? 'bold' : 'medium'}
                                color={isToday ? COLORS.primary : "#444444"}
                                textAlign="center"
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
                                    bg={booking.status === 'approved' ? 'red.500' : 'yellow.500'}
                                    color="white"
                                >
                                    {getBookingStatusText ? getBookingStatusText(booking.booking?.status) : 'Booked'}
                                </Badge>
                            )}
                        </VStack>

                        {/* Today indicator */}
                        {isToday && (
                            <Box
                                position="absolute"
                                top={1}
                                right={1}
                                w={2}
                                h={2}
                                bg={COLORS.primary}
                                borderRadius="full"
                            />
                        )}
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
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="20px"
            boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
            overflow="hidden"
            position="relative"
        >
            {/* Animated Grid Pattern Background */}
            <AnimatedGridPattern
                numSquares={25}
                maxOpacity={0.06}
                duration={4}
                repeatDelay={2}
                className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
            />

            <Box position="relative" zIndex={1} p={calendarPadding}>
                <VStack spacing={{ base: 4, md: 5 }} align="stretch">
                    {/* Calendar Header */}
                    <HStack justify="space-between" align="center">
                        <Heading size={headerSize} color="#444444">
                            <HStack spacing={2}>
                                <Icon as={Calendar} color={COLORS.primary} />
                                <Text>Kalender Booking</Text>
                            </HStack>
                        </Heading>

                        <HStack spacing={2}>
                            <MotionButton
                                size="sm"
                                variant="ghost"
                                onClick={navigateToPreviousMonth}
                                bg="rgba(255, 255, 255, 0.1)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(255, 255, 255, 0.1)"
                                borderRadius="10px"
                                color="#444444"
                                _hover={{
                                    bg: "rgba(116, 156, 115, 0.15)",
                                    borderColor: "rgba(116, 156, 115, 0.3)"
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronLeft size={16} />
                            </MotionButton>

                            <Text
                                fontWeight="semibold"
                                color="#444444"
                                minW={{ base: "120px", sm: "150px" }}
                                textAlign="center"
                                fontSize={{ base: "sm", sm: "md" }}
                                bg="rgba(116, 156, 115, 0.1)"
                                px={3}
                                py={1.5}
                                borderRadius="10px"
                                border="1px solid rgba(116, 156, 115, 0.15)"
                            >
                                {monthNames[month]} {year}
                            </Text>

                            <MotionButton
                                size="sm"
                                variant="ghost"
                                onClick={navigateToNextMonth}
                                bg="rgba(255, 255, 255, 0.1)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(255, 255, 255, 0.1)"
                                borderRadius="10px"
                                color="#444444"
                                _hover={{
                                    bg: "rgba(116, 156, 115, 0.15)",
                                    borderColor: "rgba(116, 156, 115, 0.3)"
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronRight size={16} />
                            </MotionButton>
                        </HStack>
                    </HStack>

                    {/* Calendar Legend */}
                    <HStack spacing={4} justify="center" flexWrap="wrap">
                        <HStack spacing={2}>
                            <Box w={3} h={3} bg="rgba(116, 156, 115, 0.6)" borderRadius="full" />
                            <Text fontSize="xs" color="#666666">Tersedia</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Box w={3} h={3} bg="red.400" borderRadius="full" />
                            <Text fontSize="xs" color="#666666">Disetujui</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Box w={3} h={3} bg="yellow.400" borderRadius="full" />
                            <Text fontSize="xs" color="#666666">Menunggu</Text>
                        </HStack>
                    </HStack>

                    {/* Day headers */}
                    <SimpleGrid columns={7} spacing={{ base: 1, sm: 2 }}>
                        {dayNames.map(day => (
                            <Text
                                key={day}
                                textAlign="center"
                                fontSize={{ base: "xs", sm: "sm" }}
                                fontWeight="semibold"
                                color="#666666"
                                py={2}
                                bg="rgba(255, 255, 255, 0.05)"
                                borderRadius="8px"
                            >
                                {day}
                            </Text>
                        ))}
                    </SimpleGrid>

                    {/* Calendar Grid */}
                    <SimpleGrid
                        columns={7}
                        spacing={{ base: 1, sm: 2 }}
                        minH={{ base: "250px", sm: "280px", md: "320px" }}
                    >
                        {generateCalendarDays()}
                    </SimpleGrid>

                    {/* Book Room Button */}
                    <MotionButton
                        bg={COLORS.primary}
                        color="white"
                        size="lg"
                        borderRadius="16px"
                        onClick={onBookRoom}
                        _hover={{
                            bg: COLORS.primary,
                            opacity: 0.9,
                            transform: "translateY(-2px)"
                        }}
                        boxShadow="0 8px 25px rgba(116, 156, 115, 0.3)"
                        whileHover={{
                            scale: 1.02,
                            y: -2
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        Pesan Ruangan
                    </MotionButton>
                </VStack>
            </Box>

            {/* Booking Detail Modal */}
            <Modal isOpen={isOpen} onClose={handleBookingDetailClose} size="md" isCentered>
                <ModalOverlay backdropFilter="blur(12px)" bg="rgba(0,0,0,0.4)" />
                <ModalContent
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.15)"
                    borderRadius="20px"
                    mx={4}
                    overflow="hidden"
                >
                    <ModalHeader color="#444444">
                        <HStack spacing={2}>
                            <Icon as={Calendar} color={COLORS.primary} />
                            <Text>Detail Booking</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton
                        color="#444444"
                        bg="rgba(255, 255, 255, 0.1)"
                        borderRadius="8px"
                        _hover={{
                            bg: "rgba(116, 156, 115, 0.15)",
                            color: COLORS.primary
                        }}
                    />
                    <ModalBody pb={6}>
                        {selectedBooking && selectedBooking.booking && (
                            <VStack spacing={4} align="stretch">
                                <Box
                                    p={4}
                                    bg="rgba(255, 255, 255, 0.1)"
                                    backdropFilter="blur(10px)"
                                    borderRadius="16px"
                                    border="1px solid rgba(255, 255, 255, 0.15)"
                                >
                                    <VStack spacing={3} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontWeight="semibold" color="#444444">
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

                                        <Divider borderColor="rgba(255, 255, 255, 0.2)" />

                                        <VStack spacing={3} align="stretch">
                                            <HStack>
                                                <Icon as={Calendar} size="16" color={COLORS.primary} />
                                                <Text fontSize="sm" color="#666666">Tanggal:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color="#444444">
                                                    {formatDate ? formatDate(selectedBooking.booking.startDate) : selectedBooking.booking.startDate} - {formatDate ? formatDate(selectedBooking.booking.endDate) : selectedBooking.booking.endDate}
                                                </Text>
                                            </HStack>

                                            <HStack>
                                                <Icon as={Clock} size="16" color={COLORS.primary} />
                                                <Text fontSize="sm" color="#666666">Waktu:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color="#444444">
                                                    {selectedBooking.booking.startTime} - {selectedBooking.booking.endTime}
                                                </Text>
                                            </HStack>

                                            <HStack>
                                                <Icon as={User} size="16" color={COLORS.primary} />
                                                <Text fontSize="sm" color="#666666">Peminjam:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color="#444444">
                                                    {selectedBooking.booking.borrowerDetail?.borrowerName || 'Tidak tersedia'}
                                                </Text>
                                            </HStack>

                                            <HStack align="start">
                                                <Icon as={Activity} size="16" color={COLORS.primary} mt={0.5} />
                                                <Text fontSize="sm" color="#666666">Kegiatan:</Text>
                                                <Text fontSize="sm" fontWeight="medium" color="#444444">
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
