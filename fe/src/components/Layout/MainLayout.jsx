import React from 'react';
import { Box, Container, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS } from '../../utils/designTokens';
import { Navbar } from '../navigation';


const MainLayout = ({
    children,
    withNavbar = true,
    withFooter = false,
    containerProps = {},
    bgGradient = `linear(135deg, ${COLORS.primaryLighter} 0%, rgba(255, 255, 255, 0.8) 50%, ${COLORS.primaryLighter} 100%)`,
    ...rest
}) => {
    return (
        <Box
            as={motion.div}
            minH="100vh"
            position="relative"
            bgGradient={bgGradient}
            overflow="hidden"
            {...ANIMATIONS.default}
            {...rest}
        >
            {withNavbar && <Navbar />}

            <Container
                as={motion.div}
                maxW="7xl"
                py={10}
                px={{ base: 4, md: 6 }}
                {...ANIMATIONS.default}
                {...containerProps}
            >
                <VStack spacing={10} align="stretch">
                    {children}
                </VStack>
            </Container>

            {withFooter && (
                <Box
                    as="footer"
                    py={6}
                    bg={`${COLORS.primary}20`} // 20 = 12% opacity
                    textAlign="center"
                    color={COLORS.black}
                    fontSize="sm"
                    mt="auto"
                >
                    &copy; {new Date().getFullYear()} Universitas Andalas. All rights reserved.
                </Box>
            )}
        </Box>
    );
};

export default MainLayout; 