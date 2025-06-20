import React from 'react';
import { VStack, Heading, Text } from '@chakra-ui/react';
import { COLORS } from '@/utils/designTokens';

const HeroContent = () => {
    return (
        <VStack spacing={8} textAlign="left" alignItems="start">
            <Heading
                size="2xl"
                color={COLORS.black}
                fontWeight="bold"
                lineHeight="shorter"
            >
                Temukan & Sewa Gedung
                <Text as="span" color={COLORS.primary}> Ideal untuk Acara Anda</Text>
            </Heading>

            <Text fontSize="lg" color={COLORS.black} opacity={0.8}>
                Mudah, Cepat, dan Praktis – Peminjaman Gedung Universitas Andalas
            </Text>
        </VStack>
    );
};

export default HeroContent; 