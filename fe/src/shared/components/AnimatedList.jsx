"use client";;
import React from 'react';
import { Box, VStack, HStack, Text, Icon, Avatar } from '@chakra-ui/react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { COLORS, GLASSMORPHISM, CORNER_RADIUS } from '../utils/designTokens';

// Fallback import untuk framer-motion
let motion, AnimatePresence;
try {
    const framerMotion = require('framer-motion');
    motion = framerMotion.motion;
    AnimatePresence = framerMotion.AnimatePresence;
} catch (error) {
    // Fallback jika framer-motion tidak tersedia
    motion = {
        div: ({ children, initial, animate, transition, ...props }) => (
            <div {...props}>{children}</div>
        )
    };
    AnimatePresence = ({ children }) => <>{children}</>;
}

const AnimatedList = ({ children, delay = 1000, className = '', ...props }) => {
    return (
        <VStack spacing={3} align="stretch" className={className} {...props}>
            <AnimatePresence>
                {React.Children.map(children, (child, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                            duration: 0.5,
                            delay: index * (delay / 1000),
                            ease: "easeOut"
                        }}
                    >
                        {child}
                    </motion.div>
                ))}
            </AnimatePresence>
        </VStack>
    );
};

// Komponen Card untuk Booking Item dengan Glassmorphism
export const BookingCard = ({ booking, index = 0 }) => {
    // Debug logging
    console.log('BookingCard received booking:', booking);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
            }}
        >
            <Box
                // Glassmorphism card styling sesuai context.json
                background="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(215, 215, 215, 0.5)"
                borderRadius={`${CORNER_RADIUS.components.cards}px`} // 24px sesuai rules
                p={4}
                _hover={{
                    background: "rgba(255, 255, 255, 0.9)",
                    borderColor: COLORS.primary,
                    transform: "translateY(-2px)",
                }}
                transition="all 0.3s ease"
                cursor="pointer"
            >
                <HStack spacing={3} align="start">
                    {/* Icon/Avatar dengan glassmorphism */}
                    <Box
                        w={10}
                        h={10}
                        background={`${COLORS.primary}20`}
                        borderRadius={`${CORNER_RADIUS.components.cards}px`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        border="1px solid rgba(215, 215, 215, 0.3)"
                    >
                        <Icon as={Calendar} color={COLORS.primary} size={20} />
                    </Box>

                    {/* Content */}
                    <VStack spacing={1} align="start" flex={1}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color={COLORS.text}
                            lineHeight="1.3"
                        >
                            {booking?.buildingName || 'Gedung Seminar E'}
                        </Text>

                        <Text
                            fontSize="xs"
                            color="gray.600"
                            lineHeight="1.3"
                        >
                            {booking?.description || 'Kegiatan peminjaman gedung'}
                        </Text>

                        <HStack spacing={4} mt={1}>
                            <HStack spacing={1}>
                                <Icon as={Clock} size={12} color="gray.500" />
                                <Text fontSize="xs" color="gray.500">
                                    {booking?.startTime || '12:00'} - {booking?.endTime || '16:00'}
                                </Text>
                            </HStack>

                            <HStack spacing={1}>
                                <Icon as={MapPin} size={12} color="gray.500" />
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                    {booking?.status || 'PENDING'}
                                </Text>
                            </HStack>
                        </HStack>
                    </VStack>

                    {/* Status indicator */}
                    <Box
                        w={2}
                        h={2}
                        bg={COLORS.primary}
                        borderRadius="full"
                        flexShrink={0}
                        mt={1}
                    />
                </HStack>
            </Box>
        </motion.div>
    );
};

// Komponen Empty State dengan Glassmorphism
export const EmptyBookingState = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <VStack spacing={4} py={8} textAlign="center">
                {/* Placeholder dengan glassmorphism */}
                <Box
                    w={24}
                    h={24}
                    background="rgba(255, 255, 255, 0.6)"
                    backdropFilter="blur(10px)"
                    border="2px dashed rgba(215, 215, 215, 0.5)"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={Calendar} size={32} color="gray.400" />
                </Box>

                <VStack spacing={2}>
                    <Text
                        fontSize="lg"
                        fontWeight="600"
                        color={COLORS.text}
                    >
                        Peminjaman Hari Ini Belum Ada
                    </Text>
                    <Text
                        fontSize="sm"
                        color="gray.500"
                        maxW="200px"
                        textAlign="center"
                        lineHeight="1.5"
                    >
                        Saat ini semua ruangan sedang kosong. Silakan lakukan peminjaman.
                    </Text>
                </VStack>
            </VStack>
        </motion.div>
    );
};

export default AnimatedList;
