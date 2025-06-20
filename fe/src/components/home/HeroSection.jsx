import React from 'react';
import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { COLORS } from '@/utils/designTokens';

const HeroSection = ({ children }) => {
    return (
        <Box
            position="relative"
            bgGradient={`linear(135deg, ${COLORS.primaryLighter} 0%, rgba(255, 255, 255, 0.8) 50%, ${COLORS.primaryLighter} 100%)`}
            pt={20}
            pb={16}
            overflow="hidden"
            backdropFilter="blur(10px)"
        >
            {/* Animated Grid Pattern Background */}
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.08}
                duration={3}
                repeatDelay={1}
                className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            />

            <Container maxW="7xl" position="relative" zIndex={1}>
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="start">
                    {Array.isArray(children) ? children.map((child, index) => (
                        <GridItem key={index}>{child}</GridItem>
                    )) : children}
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection; 