import React from 'react';
import { 
    Box, 
    VStack, 
    Heading, 
    Text, 
    HStack, 
    Icon
} from '@chakra-ui/react';
import { Building, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedList } from '@/components/magicui/animated-list';
import { COLORS, GLASS_EFFECT } from '@/utils/designTokens';
import { useTodayBookings } from '@/hooks/useTodayBookings';
import { BookingSkeleton, ListSkeleton } from '@/components/ui/SkeletonLoading';

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
                border="4px solid"
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
                border="4px solid"
                borderColor={`${COLORS.primary}40`}
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
                    as={Building} 
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            bg={GLASS_EFFECT.bg}
            backdropFilter={GLASS_EFFECT.backdropFilter}
            border={GLASS_EFFECT.border}
            p={4}
            borderRadius={GLASS_EFFECT.borderRadius}
            boxShadow={GLASS_EFFECT.boxShadow}
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(116, 156, 115, 0.25)"
            }}
            transition="all 0.3s ease"
            cursor="pointer"
            w="full"
        >
            <HStack spacing={4}>
                <Box
                    bg={COLORS.primary}
                    p={3}
                    borderRadius="12px"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={Building} w={5} h={5} />
                </Box>
                
                <VStack align="start" spacing={1} flex={1}>
                    <HStack justify="space-between" w="full" align="start">
                        <VStack align="start" spacing={1} flex={1}>
                            <Text 
                                fontWeight="bold" 
                                color={COLORS.black} 
                                fontSize="md"
                                noOfLines={1}
                            >
                                {booking.buildingName}
                            </Text>
                            <Text 
                                fontSize="sm" 
                                color={COLORS.black} 
                                opacity={0.8}
                                noOfLines={1}
                            >
                                {booking.activityName}
                            </Text>
                        </VStack>
                        
                        <VStack align="end" spacing={1} minW="120px">
                            <HStack spacing={1}>
                                <Icon as={Clock} w={3} h={3} color={COLORS.primary} />
                                <Text 
                                    fontSize="sm" 
                                    color={COLORS.primary} 
                                    fontWeight="medium"
                                >
                                    {booking.startTime} - {booking.endTime}
                                </Text>
                            </HStack>
                            <HStack spacing={1}>
                                <Icon as={User} w={3} h={3} color={COLORS.gray[500]} />
                                <Text 
                                    fontSize="xs" 
                                    color={COLORS.gray[600]}
                                    noOfLines={1}
                                >
                                    {booking.borrowerName}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
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
        py={8}
    >
        <EmptyStateAnimation />
        
        <VStack spacing={4} mt={4}>
            <VStack spacing={2}>
                <Heading size="md" color={COLORS.black} fontWeight="600">
                    Belum Ada Peminjaman Hari Ini
                </Heading>
                <Text color={COLORS.black} opacity={0.7} fontSize="sm" maxW="300px">
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
        <VStack spacing={4} align="stretch">
            {/* Header */}
            <VStack spacing={2} align="start">
                <VStack align="start" spacing={1}>
                    <Heading size="md" color={COLORS.black} fontWeight="600">
                        Peminjaman Hari Ini
                    </Heading>
                    <Text fontSize="xs" color={COLORS.primary} opacity={0.8}>
                        {getCurrentDate()}
                    </Text>
                </VStack>

                {/* Count indicator */}
                {!isLoading && !isEmpty && (
                    <Text fontSize="xs" color={COLORS.primary} opacity={0.7}>
                        {bookings.length} peminjaman aktif
                    </Text>
                )}
            </VStack>

            {/* Content */}
            <Box w="full" minH="300px">
                {isLoading ? (
                    <ListSkeleton 
                        count={3} 
                        ItemSkeleton={BookingSkeleton}
                        spacing={3}
                    />
                ) : isEmpty ? (
                    <EmptyState />
                ) : (
                    <AnimatedList delay={2000} showItemsCount={3} initialDelay={300}>
                        {bookings.map((booking, index) => (
                            <BookingItem 
                                key={booking.bookingId} 
                                booking={booking} 
                                index={index}
                            />
                        ))}
                    </AnimatedList>
                )}
            </Box>
        </VStack>
    );
};

export default TodayBookingsList; 