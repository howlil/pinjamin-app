import React from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    Image,
    Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, #EDFFF4 0%, #C8FFDB 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Container maxW="md">
                <Box
                    bg="rgba(255, 255, 255, 0.5)"
                    backdropFilter="blur(10px)"
                    borderRadius="24px"
                    border="1px solid #D7D7D7FF"
                    boxShadow="0 8px 32px rgba(215, 215, 215, 0.5)"
                    p={8}
                    textAlign="center"
                >
                    <VStack spacing={6}>
                        {/* 404 Illustration */}
                        <Box
                            bg="rgba(33, 209, 121, 0.1)"
                            borderRadius="50%"
                            p={8}
                            display="inline-flex"
                        >
                            <Search size={80} color="#21D179" />
                        </Box>

                        {/* 404 Text */}
                        <VStack spacing={3}>
                            <Text
                                fontSize="6xl"
                                fontWeight="800"
                                color="#21D179"
                                fontFamily="Inter, sans-serif"
                                lineHeight="1"
                            >
                                404
                            </Text>
                            <Text
                                fontSize="2xl"
                                fontWeight="700"
                                color="#2A2A2A"
                                fontFamily="Inter, sans-serif"
                            >
                                Halaman Tidak Ditemukan
                            </Text>
                            <Text
                                fontSize="md"
                                color="#666"
                                fontFamily="Inter, sans-serif"
                                maxW="400px"
                                lineHeight="1.6"
                            >
                                Maaf, halaman yang Anda cari tidak dapat ditemukan.
                                Mungkin halaman telah dipindahkan atau URL salah.
                            </Text>
                        </VStack>

                        {/* Action Buttons */}
                        <VStack spacing={3} w="full">
                            <Button
                                leftIcon={<Home size={20} />}
                                bg="#21D179"
                                color="white"
                                size="lg"
                                borderRadius="9999px"
                                fontFamily="Inter, sans-serif"
                                fontWeight="600"
                                w="full"
                                h="48px"
                                _hover={{
                                    bg: "#1BAE66",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(33, 209, 121, 0.3)"
                                }}
                                _active={{
                                    transform: "translateY(0)"
                                }}
                                transition="all 0.2s ease"
                                onClick={handleGoHome}
                            >
                                Kembali ke Beranda
                            </Button>

                            <Button
                                leftIcon={<ArrowLeft size={20} />}
                                bg="rgba(215, 215, 215, 0.5)"
                                backdropFilter="blur(10px)"
                                color="#2A2A2A"
                                size="lg"
                                borderRadius="9999px"
                                fontFamily="Inter, sans-serif"
                                fontWeight="600"
                                w="full"
                                h="48px"
                                border="1px solid #D7D7D7FF"
                                _hover={{
                                    bg: "rgba(215, 215, 215, 0.8)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                                }}
                                _active={{
                                    transform: "translateY(0)"
                                }}
                                transition="all 0.2s ease"
                                onClick={handleGoBack}
                            >
                                Kembali ke Halaman Sebelumnya
                            </Button>
                        </VStack>

                        {/* Helper Text */}
                        <Text
                            fontSize="sm"
                            color="#999"
                            fontFamily="Inter, sans-serif"
                            mt={4}
                        >
                            Jika masalah berlanjut, silakan hubungi administrator
                        </Text>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
};

export default NotFoundPage; 