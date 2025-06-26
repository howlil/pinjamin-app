import React from 'react';
import { Box, Container, VStack, Heading, Text } from '@chakra-ui/react';
import { COLORS } from '@utils/designTokens';

const HistoryTransactionPage = () => {
    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg" color={COLORS.primary} mb={2}>
                        Riwayat Transaksi
                    </Heading>
                    <Text color="gray.600">
                        Lihat riwayat transaksi peminjaman
                    </Text>
                </Box>

                {/* TODO: Implement transaction history table */}
                <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                    <Text>Transaction history table will be implemented here</Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default HistoryTransactionPage; 