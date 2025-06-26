import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { COLORS } from '../utils/designTokens';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const bgColor = COLORS.background;

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Navbar */}
            <Navbar />

            <Box pt="70px" minH="calc(100vh - 70px)">
                {children}
            </Box>
        </Box>
    );
};

export default Layout; 