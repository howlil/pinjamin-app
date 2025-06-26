import React from 'react';
import { Box, Container, VStack, Heading, Text, Button, HStack } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { COLORS } from '@utils/designTokens';

const ManageBuildingPage = () => {
    return (
        <Container maxW="6xl" py={8}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                    <Box>
                        <Heading size="lg" color={COLORS.primary} mb={2}>
                            Kelola Gedung
                        </Heading>
                        <Text color="gray.600">
                            Manajemen data gedung dan ruangan
                        </Text>
                    </Box>
                    <Button
                        leftIcon={<Plus size={20} />}
                        colorScheme="green"
                        size="lg"
                    >
                        Tambah Gedung
                    </Button>
                </HStack>

                {/* TODO: Implement building management table */}
                <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
                    <Text>Building management table will be implemented here</Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default ManageBuildingPage; 