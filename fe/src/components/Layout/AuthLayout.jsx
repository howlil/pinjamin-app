import React from 'react';
import { Box, Container, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS, GLASS } from '@/utils/designTokens';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import AuthHeader from '@/components/auth/AuthHeader';
import { GlassCard } from '@/components/ui';

const AuthLayout = ({
    children,
    title,
    subtitle,
    footer
}) => {
    return (
        <Box
            minH="100vh"
            position="relative"
            bgGradient={`linear(135deg, ${COLORS.primaryLighter} 0%, rgba(255, 255, 255, 0.8) 50%, ${COLORS.primaryLighter} 100%)`}
            py={12}
            overflow="hidden"
        >
            {/* Animated Background Pattern */}
            <Box position="absolute" inset="0" zIndex="0">
                <AnimatedGridPattern
                    numSquares={20}
                    maxOpacity={0.08}
                    duration={3}
                    repeatDelay={1}
                    className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-0 h-full"
                />
            </Box>

            {/* Container */}
            <Container maxW="md" position="relative" zIndex="1">
                <VStack spacing={6} align="stretch">
                    {/* Header */}
                    <AuthHeader
                        title={title}
                        subtitle={subtitle}
                    />

                    {/* Content */}
                    <GlassCard
                        p={8}
                        as={motion.div}
                        {...ANIMATIONS.card}
                    >
                        {children}
                    </GlassCard>

                    {/* Footer (optional) */}
                    {footer}
                </VStack>
            </Container>
        </Box>
    );
};

export default AuthLayout; 