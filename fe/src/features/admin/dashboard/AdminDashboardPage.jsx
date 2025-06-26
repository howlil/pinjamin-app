import React from 'react';
import { Box, Container, VStack, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { COLORS } from '@utils/designTokens';

const AdminDashboardPage = () => {
    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg" color={COLORS.primary} mb={2}>
                        Dashboard Admin
                    </Heading>
                    <Text color="gray.600">
                        Kelola sistem peminjaman ruangan
                    </Text>
                </Box>

                {/* TODO: Implement dashboard widgets */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                        <Text fontWeight="bold" mb={2}>Total Gedung</Text>
                        <Text fontSize="2xl" color={COLORS.primary}>-</Text>
                    </Box>
                    <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                        <Text fontWeight="bold" mb={2}>Total Peminjaman</Text>
                        <Text fontSize="2xl" color={COLORS.primary}>-</Text>
                    </Box>
                    <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                        <Text fontWeight="bold" mb={2}>Pending Approval</Text>
                        <Text fontSize="2xl" color={COLORS.primary}>-</Text>
                    </Box>
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default AdminDashboardPage; 