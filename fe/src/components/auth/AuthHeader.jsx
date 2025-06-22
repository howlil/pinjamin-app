import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS } from '../../utils/designTokens';

const AuthHeader = ({ title, subtitle }) => {
    return (
        <Box textAlign="center" as={motion.div} {...ANIMATIONS.header}>
            <Heading color={COLORS.primary} fontSize="3xl" fontWeight="bold" mb={2}>
                {title || 'Universitas Andalas'}
            </Heading>
            {subtitle && (
                <Text color={COLORS.black} opacity={0.8}>
                    {subtitle}
                </Text>
            )}
        </Box>
    );
};

export default AuthHeader; 