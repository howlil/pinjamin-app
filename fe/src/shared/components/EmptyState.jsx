import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { Search, Building, Calendar, FileX } from 'lucide-react';
import Card from './Card';
import { H2, Subtitle } from './Typography';
import { COLORS } from '@utils/designTokens';

// CSS Animations using style objects
const animations = {
    float: {
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '25%': { transform: 'translateY(-10px) rotate(2deg)' },
            '50%': { transform: 'translateY(-20px) rotate(0deg)' },
            '75%': { transform: 'translateY(-10px) rotate(-2deg)' }
        }
    },
    pulse: {
        animation: 'pulse 3s ease-in-out infinite',
        '@keyframes pulse': {
            '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.05)' }
        }
    },
    bounce: {
        animation: 'bounce 2s ease-in-out infinite',
        '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
            '40%': { transform: 'translateY(-10px)' },
            '60%': { transform: 'translateY(-5px)' }
        }
    }
};

const EmptyState = ({
    title,
    message,
    variant = 'noData',
    showAnimation = true,
    icon: CustomIcon,
    ...props
}) => {
    const getVariantConfig = () => {
        switch (variant) {
            case 'buildings':
                return {
                    icon: Building,
                    title: "Belum Ada Gedung",
                    message: "Belum ada gedung yang tersedia untuk disewa saat ini. Silakan coba lagi nanti.",
                    animation: 'float 3s ease-in-out infinite',
                    iconColor: COLORS.primary
                };
            case 'search':
                return {
                    icon: Search,
                    title: "Tidak Ada Hasil",
                    message: "Tidak ada gedung yang sesuai dengan kriteria pencarian Anda. Coba ubah kata kunci atau filter.",
                    animation: 'bounce 2s ease-in-out infinite',
                    iconColor: "gray.400"
                };
            case 'bookings':
                return {
                    icon: Calendar,
                    title: "Belum Ada Peminjaman",
                    message: "Belum ada peminjaman gedung untuk hari ini.",
                    animation: 'pulse 3s ease-in-out infinite',
                    iconColor: "orange.400"
                };
            case 'noData':
            default:
                return {
                    icon: FileX,
                    title: title || "Data Tidak Tersedia",
                    message: message || "Belum ada data untuk ditampilkan saat ini.",
                    animation: 'float 3s ease-in-out infinite',
                    iconColor: "gray.400"
                };
        }
    };

    const config = getVariantConfig();
    const IconComponent = CustomIcon || config.icon;

    return (
        <Card
            variant="transparent"
            textAlign="center"
            py={16}
            px={8}
            {...props}
        >
            <VStack spacing={6}>
                {/* Animated Icon */}
                <Box
                    as={IconComponent}
                    boxSize="80px"
                    color={config.iconColor}
                    animation={showAnimation ? config.animation : 'none'}
                    opacity={0.8}
                    sx={{
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                            '25%': { transform: 'translateY(-10px) rotate(2deg)' },
                            '50%': { transform: 'translateY(-20px) rotate(0deg)' },
                            '75%': { transform: 'translateY(-10px) rotate(-2deg)' }
                        },
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.05)' }
                        },
                        '@keyframes bounce': {
                            '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                            '40%': { transform: 'translateY(-10px)' },
                            '60%': { transform: 'translateY(-5px)' }
                        }
                    }}
                />

                {/* Floating circles decoration */}
                {showAnimation && (
                    <Box position="relative" w="100%" h="0">
                        <Box
                            position="absolute"
                            left="20%"
                            top="-40px"
                            w="8px"
                            h="8px"
                            bg={`${config.iconColor}40`}
                            borderRadius="full"
                            animation="pulse 2s ease-in-out infinite"
                        />
                        <Box
                            position="absolute"
                            right="25%"
                            top="-60px"
                            w="12px"
                            h="12px"
                            bg={`${config.iconColor}30`}
                            borderRadius="full"
                            animation="bounce 2.5s ease-in-out infinite"
                        />
                        <Box
                            position="absolute"
                            left="60%"
                            top="-20px"
                            w="6px"
                            h="6px"
                            bg={`${config.iconColor}50`}
                            borderRadius="full"
                            animation="float 3.5s ease-in-out infinite"
                        />
                    </Box>
                )}

                {/* Text Content */}
                <VStack spacing={3} mt={4}>
                    <H2 color={COLORS.text} fontSize="xl" fontWeight="600">
                        {config.title}
                    </H2>

                    <Subtitle
                        color="gray.600"
                        maxW="400px"
                        lineHeight="1.6"
                        fontSize="md"
                    >
                        {config.message}
                    </Subtitle>
                </VStack>

                {/* Subtle glow effect */}
                {showAnimation && (
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="200px"
                        h="200px"
                        bg={`radial-gradient(circle, ${config.iconColor}10 0%, transparent 70%)`}
                        borderRadius="full"
                        zIndex={-1}
                        animation="pulse 4s ease-in-out infinite"
                    />
                )}
            </VStack>
        </Card>
    );
};

// Variant exports untuk kemudahan penggunaan
export const BuildingsEmptyState = (props) => (
    <EmptyState variant="buildings" {...props} />
);

export const SearchEmptyState = (props) => (
    <EmptyState variant="search" {...props} />
);

export const BookingsEmptyState = (props) => (
    <EmptyState variant="bookings" {...props} />
);

export const NoDataEmptyState = (props) => (
    <EmptyState variant="noData" {...props} />
);

export default EmptyState; 