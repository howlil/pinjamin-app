import React from 'react';
import { Box, HStack, VStack, Skeleton, SkeletonText, SkeletonCircle } from '@chakra-ui/react';
import { GLASS_EFFECT } from '@/utils/designTokens';

// Skeleton untuk card item
export const CardSkeleton = ({ showAvatar = true, lines = 2 }) => (
    <Box
        bg={GLASS_EFFECT.bg}
        backdropFilter={GLASS_EFFECT.backdropFilter}
        border={GLASS_EFFECT.border}
        p={4}
        borderRadius={GLASS_EFFECT.borderRadius}
        w="full"
    >
        <HStack spacing={4}>
            {showAvatar && (
                <SkeletonCircle size="12" />
            )}
            <VStack align="start" spacing={2} flex={1}>
                <Skeleton height="20px" width="70%" />
                <SkeletonText
                    mt="2"
                    noOfLines={lines}
                    spacing="2"
                    skeletonHeight="2"
                    width="90%"
                />
            </VStack>
        </HStack>
    </Box>
);

// Skeleton untuk booking item
export const BookingSkeleton = () => (
    <Box
        bg={GLASS_EFFECT.bg}
        backdropFilter={GLASS_EFFECT.backdropFilter}
        border={GLASS_EFFECT.border}
        p={4}
        borderRadius={GLASS_EFFECT.borderRadius}
        w="full"
    >
        <HStack spacing={4}>
            <SkeletonCircle size="12" />
            <VStack align="start" spacing={1} flex={1}>
                <HStack justify="space-between" w="full">
                    <VStack align="start" spacing={1} flex={1}>
                        <Skeleton height="16px" width="60%" />
                        <Skeleton height="14px" width="80%" />
                    </VStack>
                    <VStack align="end" spacing={1} minW="120px">
                        <Skeleton height="14px" width="100px" />
                        <Skeleton height="12px" width="80px" />
                    </VStack>
                </HStack>
            </VStack>
        </HStack>
    </Box>
);

// Skeleton untuk table row
export const TableRowSkeleton = ({ columns = 4 }) => (
    <HStack spacing={4} w="full" p={4}>
        {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} height="20px" flex={1} />
        ))}
    </HStack>
);

// Skeleton untuk calendar day
export const CalendarDaySkeleton = () => (
    <Box
        minH="140px"
        p={2}
        border="1px solid rgba(255, 255, 255, 0.3)"
        borderRadius="md"
    >
        <VStack spacing={2} align="stretch">
            <Skeleton height="16px" width="20px" />
            <Skeleton height="32px" width="100%" />
            <Skeleton height="32px" width="100%" />
        </VStack>
    </Box>
);

// Skeleton untuk stat card
export const StatCardSkeleton = () => (
    <Box
        bg={GLASS_EFFECT.bg}
        backdropFilter={GLASS_EFFECT.backdropFilter}
        border={GLASS_EFFECT.border}
        p={6}
        borderRadius={GLASS_EFFECT.borderRadius}
        h="140px"
    >
        <HStack justify="space-between" align="start" mb={4}>
            <VStack align="start" spacing={2}>
                <Skeleton height="14px" width="80px" />
                <Skeleton height="24px" width="60px" />
            </VStack>
            <SkeletonCircle size="10" />
        </HStack>
        <Skeleton height="12px" width="50px" />
    </Box>
);

// Generic list skeleton
export const ListSkeleton = ({
    count = 5,
    ItemSkeleton = CardSkeleton,
    spacing = 4
}) => (
    <VStack spacing={spacing} align="stretch">
        {Array.from({ length: count }).map((_, index) => (
            <ItemSkeleton key={index} />
        ))}
    </VStack>
);

// Generic grid skeleton
export const GridSkeleton = ({
    count = 8,
    columns = { base: 1, md: 2, lg: 4 },
    ItemSkeleton = StatCardSkeleton
}) => (
    <Box>
        {Array.from({ length: Math.ceil(count / 4) }).map((_, rowIndex) => (
            <HStack
                key={rowIndex}
                spacing={4}
                mb={4}
                flexWrap="wrap"
            >
                {Array.from({
                    length: Math.min(4, count - rowIndex * 4)
                }).map((_, colIndex) => (
                    <Box key={colIndex} flex="1" minW="200px">
                        <ItemSkeleton />
                    </Box>
                ))}
            </HStack>
        ))}
    </Box>
); 