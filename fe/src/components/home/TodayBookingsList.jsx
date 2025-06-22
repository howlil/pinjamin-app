import React from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    HStack,
    Icon,
    Badge
} from '@chakra-ui/react';
import { Building, Clock, User, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedList } from '../magicui/animated-list';
import { useTodayBookings } from '../../hooks/booking';
import { COLORS, GLASS_EFFECT, RADII } from '../../utils/designTokens';

const MotionBox = motion(Box);

// Simple Lottie-like animation component for empty state
const EmptyStateAnimation = () => {
    return (
        <MotionBox
            w="200px"
            h="200px"
            mx="auto"
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {/* Animated circles */}
            <MotionBox
                position="absolute"
                w="120px"
                h="120px"
                border="3px solid"
                borderColor={`${COLORS.primary}20`}
                borderRadius="full"
                animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
            />

            <MotionBox
                position="absolute"
                w="80px"
                h="80px"
                border="3px solid"
                borderColor={`${COLORS.primary}30`}
                borderRadius="full"
                animate={{
                    rotate: -360,
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                }}
            />

            {/* Calendar icon in center */}
            <MotionBox
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.7, 1, 0.7]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Icon
                    as={Calendar}
                    w={12}
                    h={12}
                    color={COLORS.primary}
                />
            </MotionBox>
        </MotionBox>
    );
};

const BookingItem = ({ booking, index }) => {
    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            bg={GLASS_EFFECT.bg}
            backdropFilter={GLASS_EFFECT.backdropFilter}
            border={GLASS_EFFECT.border}
            borderRadius={GLASS_EFFECT.borderRadius}
            boxShadow={GLASS_EFFECT.boxShadow}
            p={5}
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(116, 156, 115, 0.25)",
                borderColor: `${COLORS.primary}40`
            }}
            style={{
                transition: "all 0.3s ease"
            }}
            cursor="pointer"
            w="full"
            position="relative"
        >
            <HStack spacing={4} align="start">
                <Box
                    bg={`${COLORS.primary}20`}
                    p={3}
                    borderRadius={RADII.default}
                    color={COLORS.primary}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={Building} w={6} h={6} />
                </Box>

                <VStack align="start" spacing={3} flex={1}>
                    <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={1}>
                            <Text
                                fontWeight="semibold"
                                color={COLORS.black}
                                fontSize="lg"
                                noOfLines={1}
                            >
                                {booking.buildingName}
                            </Text>
                            <Text
                                fontSize="md"
                                color={COLORS.gray[600]}
                                noOfLines={1}
                            >
                                {booking.activityName}
                            </Text>
                        </VStack>

                        <Badge
                            bg="rgba(255, 165, 0, 0.15)"
                            color="orange.600"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="medium"
                            border="1px solid"
                            borderColor="rgba(255, 165, 0, 0.3)"
                        >
                            Sedang Berlangsung
                        </Badge>
                    </HStack>

                    <VStack align="start" spacing={2} w="full">
                        <HStack spacing={2} color={COLORS.gray[600]}>
                            <Icon as={Clock} w={4} h={4} color={COLORS.gray[400]} />
                            <Text fontSize="sm" fontWeight="medium">
                                {booking.startTime} - {booking.endTime}
                            </Text>
                        </HStack>
                        <HStack spacing={2} color={COLORS.gray[600]}>
                            <Icon as={User} w={4} h={4} color={COLORS.gray[400]} />
                            <Text fontSize="sm" noOfLines={1}>
                                {booking.borrowerName}
                            </Text>
                        </HStack>
                        {booking.location && (
                            <HStack spacing={2} color={COLORS.gray[600]}>
                                <Icon as={MapPin} w={4} h={4} color={COLORS.gray[400]} />
                                <Text fontSize="sm">
                                    {booking.location}
                                </Text>
                            </HStack>
                        )}
                    </VStack>
                </VStack>
            </HStack>
        </MotionBox>
    );
};

const EmptyState = () => (
    <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        textAlign="center"
        py={12}
    >
        <EmptyStateAnimation />

        <VStack spacing={4} mt={6}>
            <VStack spacing={2}>
                <Heading size="md" color={COLORS.black} fontWeight="semibold">
                    Belum Ada Peminjaman Hari Ini
                </Heading>
                <Text color={COLORS.gray[600]} fontSize="sm" maxW="350px">
                    Tidak ada jadwal peminjaman gedung untuk hari ini.
                    Periksa kembali nanti atau buat peminjaman baru.
                </Text>
            </VStack>
        </VStack>
    </MotionBox>
);

const TodayBookingsList = () => {
    const { bookings, isLoading, error, isEmpty } = useTodayBookings();

    // Get current date for display
    const getCurrentDate = () => {
        const today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return today.toLocaleDateString('id-ID', options);
    };

    return (
        <VStack spacing={6} align="stretch" w="full">
            {/* Header */}
            <VStack spacing={2} align="start">
                <VStack align="start" spacing={1}>
                    <Heading size="lg" color={COLORS.black} fontWeight="bold">
                        Peminjaman Hari Ini
                    </Heading>
                    <Text fontSize="sm" color={COLORS.primary}>
                        {getCurrentDate()}
                    </Text>
                </VStack>

                {/* Count indicator */}
                {!isLoading && !isEmpty && (
                    <Text fontSize="md" color={COLORS.gray[600]}>
                        {bookings.length} peminjaman aktif hari ini
                    </Text>
                )}
            </VStack>

            {/* Content */}
            <Box
                bg={GLASS_EFFECT.bg}
                backdropFilter={GLASS_EFFECT.backdropFilter}
                border={GLASS_EFFECT.border}
                borderRadius={GLASS_EFFECT.borderRadius}
                boxShadow={GLASS_EFFECT.boxShadow}
                p={6}
                w="full"
                minH="400px"
                maxH="600px"
                overflowY="auto"
                position="relative"
                css={{
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: `${COLORS.primary}40`,
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: `${COLORS.primary}60`,
                    },
                }}
            >
                {isLoading ? (
                    <VStack spacing={4}>
                        {[1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                w="full"
                                h="120px"
                                bg={GLASS_EFFECT.bg}
                                borderRadius={GLASS_EFFECT.borderRadius}
                                border={GLASS_EFFECT.border}
                                position="relative"
                                overflow="hidden"
                            >
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="-100%"
                                    w="100%"
                                    h="100%"
                                    bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
                                    animation="shimmer 1.5s infinite"
                                />
                            </Box>
                        ))}
                    </VStack>
                ) : isEmpty ? (
                    <EmptyState />
                ) : (
                    <VStack spacing={3} align="stretch">
                        {bookings.map((booking, index) => (
                            <BookingItem
                                key={booking.bookingId || index}
                                booking={booking}
                                index={index}
                            />
                        ))}
                    </VStack>
                )}
            </Box>
        </VStack>
    );
};

export default TodayBookingsList; 