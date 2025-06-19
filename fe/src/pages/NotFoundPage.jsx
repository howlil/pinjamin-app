import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
            <Container maxW="md">
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
                    >
                        Kembali ke Beranda
                    </Button>
                </VStack>
            </Container>
        </Box>
    );
};

export default NotFoundPage; 