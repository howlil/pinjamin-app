import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const WelcomeHeader = ({ userName }) => {
    return (
        <Box>
            <Heading size="lg" mb={2}>
                Selamat datang, {userName || 'User'}!
            </Heading>
            <Text color="gray.600">
                Berikut adalah ringkasan aktivitas perpustakaan Anda
            </Text>
        </Box>
    );
};

export default WelcomeHeader; 