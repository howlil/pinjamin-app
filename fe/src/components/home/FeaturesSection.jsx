import React from 'react';
import { Box, Container, VStack, Heading, Text, SimpleGrid, Icon } from '@chakra-ui/react';
import { Building, Calendar, Clock, Wifi } from 'lucide-react';
import { COLORS, GLASS_EFFECT } from '@/utils/designTokens';

const features = [
    {
        icon: Building,
        title: 'Ruang Berkualitas',
        description: 'Akses ruang pertemuan dengan fasilitas lengkap'
    },
    {
        icon: Calendar,
        title: 'Peminjaman Online',
        description: 'Pesan ruangan dengan mudah secara online'
    },
    {
        icon: Clock,
        title: 'Fleksibel 24/7',
        description: 'Ketersediaan ruangan sepanjang waktu'
    },
    {
        icon: Wifi,
        title: 'Fasilitas Lengkap',
        description: 'WiFi, AC, proyektor, dan fasilitas modern'
    }
];

const FeatureCard = ({ feature }) => {
    return (
        <Box
            bg={GLASS_EFFECT.bg}
            backdropFilter={GLASS_EFFECT.backdropFilter}
            border={GLASS_EFFECT.border}
            borderRadius={GLASS_EFFECT.borderRadius}
            boxShadow={GLASS_EFFECT.boxShadow}
            p={6}
            transition="all 0.3s ease"
            _hover={{
                transform: "translateY(-5px)",
                boxShadow: "0 12px 40px rgba(116, 156, 115, 0.25)"
            }}
            position="relative"
            _before={{
                ...GLASS_EFFECT.beforeProps,
                borderRadius: GLASS_EFFECT.borderRadius
            }}
        >
            <VStack spacing={4}>
                <Icon
                    as={feature.icon}
                    w={12}
                    h={12}
                    color={COLORS.primary}
                />
                <Text fontWeight="bold" fontSize="lg" color={COLORS.black}>
                    {feature.title}
                </Text>
                <Text color={COLORS.black} textAlign="center" opacity={0.8}>
                    {feature.description}
                </Text>
            </VStack>
        </Box>
    );
};

const FeaturesSection = ({ customFeatures }) => {
    const displayFeatures = customFeatures || features;

    return (
        <Box py={16} position="relative">
            <Container maxW="7xl">
                <VStack spacing={12}>
                    <VStack spacing={4} textAlign="center">
                        <Heading size="xl" color={COLORS.black} fontWeight="bold">
                            Keunggulan Layanan Kami
                        </Heading>
                        <Text color={COLORS.black} fontSize="lg" opacity={0.8}>
                            Nikmati kemudahan peminjaman ruangan dengan fasilitas terbaik
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
                        {displayFeatures.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};

export default FeaturesSection; 