import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    Container,
    Heading,
    Badge
} from '@chakra-ui/react';
import { Building, Clock, MapPin, Calendar, Users, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedList } from '../magicui/animated-list';
import { COLORS, GLASS_EFFECT, RADII } from '../../utils/designTokens';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Animated empty state
const EmptyStateAnimation = ({ isSearchResult = false }) => {
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
                border="2px solid"
                borderColor={`${COLORS.primary}15`}
                borderRadius="full"
                animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1],
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
                border="2px solid"
                borderColor={`${COLORS.primary}20`}
                borderRadius="full"
                animate={{
                    rotate: -360,
                    scale: [1, 0.95, 1],
                }}
                transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                }}
            />

            {/* Icon in center */}
            <MotionBox
                animate={{
                    y: [0, -5, 0],
                    opacity: [0.6, 1, 0.6]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Icon
                    as={Calendar}
                    w={10}
                    h={10}
                    color={`${COLORS.primary}80`}
                />
            </MotionBox>
        </MotionBox>
    );
};

const RoomItem = ({ room, index }) => {
    return (
        <MotionBox
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            bg="rgba(255, 255, 255, 0.08)"
            backdropFilter="blur(8px)"
            border="1px solid rgba(255, 255, 255, 0.06)"
            borderRadius="16px"
            p={4}
            _hover={{
                bg: "rgba(255, 255, 255, 0.12)",
                transform: "translateY(-1px)",
                borderColor: `${COLORS.primary}20`
            }}
            style={{
                transition: "all 0.2s ease"
            }}
            cursor="pointer"
            w="full"
        >
            <HStack spacing={3} align="start">
                <Box
                    bg={`${COLORS.primary}15`}
                    p={2.5}
                    borderRadius="12px"
                    color={COLORS.primary}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={Building} w={5} h={5} />
                </Box>

                <VStack align="start" spacing={2} flex={1}>
                    <HStack justify="space-between" w="full">
                        <Text
                            fontWeight="medium"
                            color={COLORS.black}
                            fontSize="md"
                            noOfLines={1}
                        >
                            {room.name}
                        </Text>
                        <Badge
                            bg="rgba(255, 165, 0, 0.15)"
                            color="orange.600"
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="2xs"
                            fontWeight="medium"
                            border="1px solid"
                            borderColor="rgba(255, 165, 0, 0.3)"
                        >
                            Berlangsung
                        </Badge>
                    </HStack>

                    <VStack align="start" spacing={1} w="full">
                        <HStack spacing={2} color={COLORS.gray[600]}>
                            <Icon as={MapPin} w={3.5} h={3.5} color={COLORS.gray[400]} />
                            <Text fontSize="xs" noOfLines={1}>
                                {room.location || "Kampus Utama"}
                            </Text>
                        </HStack>
                        <HStack spacing={2} color={COLORS.gray[600]}>
                            <Icon as={Clock} w={3.5} h={3.5} color={COLORS.gray[400]} />
                            <Text fontSize="xs">
                                {room.time}
                            </Text>
                        </HStack>
                        {room.capacity && (
                            <HStack spacing={2} color={COLORS.gray[600]}>
                                <Icon as={Users} w={3.5} h={3.5} color={COLORS.gray[400]} />
                                <Text fontSize="xs">
                                    Kapasitas: {room.capacity} orang
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
        py={10}
    >
        <EmptyStateAnimation />

        
    </MotionBox>
);

const AvailableRoomsList = ({ rooms = [], loading = false }) => {
    const isEmpty = !loading && rooms.length === 0;

    return (
        <MotionVStack
            spacing={4}
            align="stretch"
            w="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
           

            {/* Content - Subtle glassmorphism container */}
            <Box
                bg="rgba(255, 255, 255, 0.03)"
                backdropFilter="blur(12px)"
                border="1px solid rgba(255, 255, 255, 0.05)"
                borderRadius="20px"
                p={5}
                w="full"
                minH="400px"
                maxH="600px"
                overflowY="auto"
                position="relative"
                css={{
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: `${COLORS.primary}30`,
                        borderRadius: '2px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: `${COLORS.primary}50`,
                    },
                }}
            >
                {loading ? (
                    <VStack spacing={3}>
                        {[1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                w="full"
                                h="80px"
                                bg="rgba(255, 255, 255, 0.05)"
                                borderRadius="16px"
                                border="1px solid rgba(255, 255, 255, 0.03)"
                                position="relative"
                                overflow="hidden"
                            >
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="-100%"
                                    w="100%"
                                    h="100%"
                                    bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                                    animation="shimmer 1.5s infinite"
                                />
                            </Box>
                        ))}
                    </VStack>
                ) : isEmpty ? (
                    <EmptyState />
                ) : (
                    <VStack spacing={2} align="stretch">
                        {rooms.map((room, index) => (
                            <RoomItem
                                key={room.id || index}
                                room={room}
                                index={index}
                            />
                        ))}
                    </VStack>
                )}
            </Box>
        </MotionVStack>
    );
};

export default AvailableRoomsList; 