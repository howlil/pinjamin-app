import React from 'react';
import { Box, VStack, HStack, Skeleton, SkeletonText } from '@chakra-ui/react';
import { CORNER_RADIUS } from '@utils/designTokens';

const LoadingSkeleton = ({
    variant = 'default',
    count = 3,
    height = '80px',
    ...props
}) => {
    const skeletonStyles = {
        background: "rgba(255, 255, 255, 0.5)",
        borderRadius: `${CORNER_RADIUS.components.cards}px`,
        opacity: 0.6,
    };

    const variants = {
        default: () => (
            <VStack spacing={3} {...props}>
                {Array.from({ length: count }).map((_, i) => (
                    <Box
                        key={i}
                        h={height}
                        w="100%"
                        {...skeletonStyles}
                    />
                ))}
            </VStack>
        ),

        card: () => (
            <VStack spacing={3} {...props}>
                {Array.from({ length: count }).map((_, i) => (
                    <Box
                        key={i}
                        w="100%"
                        p={4}
                        {...skeletonStyles}
                    >
                        <VStack spacing={3} align="start">
                            <Skeleton height="20px" width="60%" />
                            <SkeletonText mt="2" noOfLines={2} spacing="2" />
                            <HStack spacing={2}>
                                <Skeleton height="16px" width="40px" />
                                <Skeleton height="16px" width="60px" />
                            </HStack>
                        </VStack>
                    </Box>
                ))}
            </VStack>
        ),

        list: () => (
            <VStack spacing={2} {...props}>
                {Array.from({ length: count }).map((_, i) => (
                    <HStack key={i} w="100%" spacing={3}>
                        <Skeleton height="40px" width="40px" borderRadius="full" />
                        <VStack spacing={1} align="start" flex={1}>
                            <Skeleton height="16px" width="70%" />
                            <Skeleton height="12px" width="50%" />
                        </VStack>
                    </HStack>
                ))}
            </VStack>
        ),

        form: () => (
            <VStack spacing={4} {...props}>
                {Array.from({ length: count }).map((_, i) => (
                    <VStack key={i} w="100%" spacing={2} align="start">
                        <Skeleton height="14px" width="30%" />
                        <Skeleton height="48px" width="100%" borderRadius={`${CORNER_RADIUS.components.input}px`} />
                    </VStack>
                ))}
            </VStack>
        ),

        grid: () => (
            <VStack spacing={3} {...props}>
                {Array.from({ length: Math.ceil(count / 2) }).map((_, rowIndex) => (
                    <HStack key={rowIndex} spacing={3} w="100%">
                        {Array.from({ length: 2 }).map((_, colIndex) => {
                            const itemIndex = rowIndex * 2 + colIndex;
                            if (itemIndex >= count) return null;

                            return (
                                <Box
                                    key={colIndex}
                                    h={height}
                                    flex={1}
                                    {...skeletonStyles}
                                />
                            );
                        })}
                    </HStack>
                ))}
            </VStack>
        )
    };

    return variants[variant]();
};

export const CardSkeleton = (props) => <LoadingSkeleton variant="card" {...props} />;
export const ListSkeleton = (props) => <LoadingSkeleton variant="list" {...props} />;
export const FormSkeleton = (props) => <LoadingSkeleton variant="form" {...props} />;
export const GridSkeleton = (props) => <LoadingSkeleton variant="grid" {...props} />;

export default LoadingSkeleton; 