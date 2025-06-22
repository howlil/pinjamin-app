import React from 'react';
import { VStack, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS } from '../../utils/designTokens';

const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const HeroContent = () => {
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <MotionVStack
            spacing={6}
            textAlign="left"
            alignItems="flex-start"
            w="full"
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            {/* Main Title */}
            <MotionHeading
                size="xl"
                color={COLORS.black}
                fontWeight="bold"
                lineHeight="shorter"
                textAlign="left"
                variants={itemVariants}
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            >
                Temukan & Sewa Gedung
                <Text
                    as="span"
                    bgGradient={`linear(to-r, ${COLORS.primary}, ${COLORS.primaryDark})`}
                    bgClip="text"
                    display="inline-block"
                >
                    Ideal untuk Acara Anda
                </Text>
            </MotionHeading>

            {/* Subtitle */}
            <MotionText
                fontSize={{ base: "md", md: "lg" }}
                color={COLORS.gray[600]}
                textAlign="left"
                maxW="lg"
                variants={itemVariants}
                lineHeight="relaxed"
            >
                Mudah, Cepat, dan Praktis - Peminjaman Gedung Universitas Andalas
            </MotionText>
        </MotionVStack>
    );
};

export default HeroContent; 