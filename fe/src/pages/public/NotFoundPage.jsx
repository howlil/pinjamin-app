import React from 'react';
import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { COLORS } from '@/utils/designTokens';

// NotFoundContent component (inline since it's simple)
const NotFoundContent = () => {
    return (
        <VStack spacing={6} textAlign="center">
            <Heading size="2xl" color="gray.800">404</Heading>
            <Heading size="lg" color="gray.600">Halaman Tidak Ditemukan</Heading>
            <Text color="gray.500">
                Maaf, halaman yang Anda cari tidak ditemukan.
            </Text>
            <Button
                as={RouterLink}
                to="/"
                colorScheme="green"
                bg={COLORS.primary}
                _hover={{ bg: COLORS.primaryDark }}
            >
                Kembali ke Beranda
            </Button>
        </VStack>
    );
};

const NotFoundPage = () => {
    return (
        <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
            <Container maxW="md">
                <NotFoundContent />
            </Container>
        </Box>
    );
};

export default NotFoundPage; 