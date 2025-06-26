import React from 'react';
import { Box, VStack, Text, Icon, Button } from '@chakra-ui/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryEmptyState = () => {
    const navigate = useNavigate();

    return (
        <Box
            background="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(15px)"
            borderRadius="24px"
            border="1px solid rgba(215, 215, 215, 0.3)"
            p={8}
            textAlign="center"
        >
            <VStack spacing={6}>
                <Box
                    background="rgba(33, 209, 121, 0.1)"
                    borderRadius="full"
                    p={4}
                >
                    <Icon
                        as={Calendar}
                        boxSize={12}
                        color="#21D179"
                    />
                </Box>

                <VStack spacing={3}>
                    <Text
                        fontSize="xl"
                        fontWeight="600"
                        color="#2A2A2A"
                        fontFamily="Inter, sans-serif"
                    >
                        Belum Ada Riwayat Peminjaman
                    </Text>
                    <Text
                        fontSize="md"
                        color="#666"
                        fontFamily="Inter, sans-serif"
                        maxW="400px"
                        lineHeight="1.6"
                    >
                        Anda belum memiliki riwayat peminjaman ruangan. Mulai ajukan peminjaman ruangan untuk aktivitas Anda.
                    </Text>
                </VStack>

                <Button
                    onClick={() => navigate('/')}
                    background="#21D179"
                    color="white"
                    borderRadius="20px"
                    px={6}
                    py={3}
                    fontFamily="Inter, sans-serif"
                    fontWeight="500"
                    _hover={{
                        background: "#1BAE65",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(33, 209, 121, 0.3)"
                    }}
                    _active={{
                        transform: "translateY(0)"
                    }}
                    transition="all 0.3s ease"
                    rightIcon={<Icon as={ArrowRight} />}
                >
                    Mulai Peminjaman
                </Button>
            </VStack>
        </Box>
    );
};

export default HistoryEmptyState; 