import React from 'react';
import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';
import { motion } from 'framer-motion';
import { COLORS, GLASS_EFFECT } from '../../utils/designTokens';

const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

const HeroSection = ({ leftContent, rightContent }) => {
    return (
        <Box
            position="relative"
            bg="rgba(255, 255, 255, 0.02)"
            backdropFilter="blur(12px)"
            pt={24}
            pb={20}
            px={{ base: 4, md: 8, lg: 12 }}
            overflow="hidden"
            minH="100vh"
            display="flex"
            alignItems="center"
        >
            {/* Animated Grid Pattern Background - Same as BuildingCardGrid */}
            <AnimatedGridPattern
                numSquares={50}
                maxOpacity={0.06}
                duration={6}
                repeatDelay={2}
                className="absolute inset-0 h-full w-full fill-[#749c73]/12 stroke-[#749c73]/6"
            />

            {/* Decorative Elements */}
            <MotionBox
                position="absolute"
                top="10%"
                left="5%"
                width="120px"
                height="120px"
                borderRadius="full"
                bg={`linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.primary}08)`}
                filter="blur(40px)"
                animate={{
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <MotionBox
                position="absolute"
                bottom="20%"
                right="10%"
                width="180px"
                height="180px"
                borderRadius="full"
                bg={`linear-gradient(135deg, ${COLORS.primary}10, transparent)`}
                filter="blur(50px)"
                animate={{
                    y: [0, -20, 0],
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <Container maxW="6xl" position="relative" zIndex={1} w="full">
                <MotionGrid
                    templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                    gap={16}
                    alignItems="center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Left Grid - Text and Search Form */}
                    <GridItem>
                        <MotionBox
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            position="relative"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                top: '-20px',
                                left: '-20px',
                                width: '100px',
                                height: '100px',
                                bg: `radial-gradient(circle, ${COLORS.primary}20 0%, transparent 70%)`,
                                filter: 'blur(30px)',
                                borderRadius: 'full'
                            }}
                        >
                            {leftContent}
                        </MotionBox>
                    </GridItem>

                    {/* Right Grid - Available Rooms */}
                    <GridItem>
                        <MotionBox
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            position="relative"
                        >
                            {rightContent}
                        </MotionBox>
                    </GridItem>
                </MotionGrid>
            </Container>
        </Box>
    );
};

export default HeroSection; 