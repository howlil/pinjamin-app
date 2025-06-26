import React from 'react';
import { Box, Container, VStack, Heading, Text } from '@chakra-ui/react';
import { COLORS } from '@utils/designTokens';

const HistoryBorrowerPage = () => {
    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg" color={COLORS.primary} mb={2}>
                        Riwayat Peminjam
                    </Heading>
                    <Text color="gray.600">
                        Lihat riwayat aktivitas peminjam
                    </Text>
                </Box>

                {/* TODO: Implement borrower history table */}
                <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                    <Text>Borrower history table will be implemented here</Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default HistoryBorrowerPage; 