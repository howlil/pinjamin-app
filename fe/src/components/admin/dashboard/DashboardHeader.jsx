import React from 'react';
import {
    Box,
    Heading,
    Text,
    Flex
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS } from '@/utils/designTokens';

const DashboardHeader = ({
    title = "Dashboard",
    description = "Selamat datang kembali! Berikut ringkasan aktivitas terbaru.",
    children
}) => {
    return (
        <Box
            as={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            mb={8}
        >
            <Flex
                justify="space-between"
                align={{ base: 'start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                gap={4}
                mb={6}
            >
                <Box>
                    <Heading
                        size="xl"
                        color={COLORS.black}
                        fontWeight="bold"
                        mb={2}
                    >
                        {title}
                    </Heading>
                    <Text color={COLORS.gray[600]} fontSize="md">
                        {description}
                    </Text>
                </Box>

                {/* Filter Controls or other header content */}
                {children}
            </Flex>
        </Box>
    );
};

export default DashboardHeader; 