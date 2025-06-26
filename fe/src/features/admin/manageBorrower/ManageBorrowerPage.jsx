import React from 'react';
import { Box, Container, VStack, Heading, Text, Button, HStack } from '@chakra-ui/react';
import { COLORS } from '@utils/designTokens';

const ManageBorrowerPage = () => {
    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg" color={COLORS.primary} mb={2}>
                        Kelola Peminjam
                    </Heading>
                    <Text color="gray.600">
                        Manajemen data peminjam
                    </Text>
                </Box>

                {/* TODO: Implement borrower management table */}
                <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                    <Text>Borrower management table will be implemented here</Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default ManageBorrowerPage; 