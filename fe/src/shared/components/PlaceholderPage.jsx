import React from 'react';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Button,
    Icon,
    useColorModeValue
} from '@chakra-ui/react';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { COLORS } from '../utils/designTokens';

const PlaceholderPage = ({
    title = "Halaman Dalam Pengembangan",
    description = "Halaman ini sedang dalam tahap pengembangan dan akan segera tersedia.",
    backTo = "/",
    backLabel = "Kembali ke Beranda"
}) => {
    const bgGradient = useColorModeValue(
        'linear(to-br, gray.50, gray.100)',
        'linear(to-br, gray.800, gray.900)'
    );

    return (
        <Container maxW="2xl" py={16}>
            <VStack spacing={8} textAlign="center">
                {/* Icon */}
                <Box
                    w={20}
                    h={20}
                    bg={`${COLORS.primary}20`}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={Construction} boxSize={10} color={COLORS.primary} />
                </Box>

                {/* Content */}
                <VStack spacing={4}>
                    <Heading
                        size="xl"
                        color={COLORS.text}
                        fontWeight="bold"
                    >
                        {title}
                    </Heading>

                    <Text
                        fontSize="lg"
                        color="gray.600"
                        maxW="400px"
                        lineHeight="1.6"
                    >
                        {description}
                    </Text>
                </VStack>

                {/* Features Coming Soon */}
                <VStack
                    spacing={3}
                    bg="white"
                    p={6}
                    borderRadius="12px"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                    w="full"
                    maxW="400px"
                >
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                        Fitur yang akan datang:
                    </Text>
                    <VStack spacing={2} align="start" w="full">
                        <Text fontSize="sm" color="gray.600">• Interface yang user-friendly</Text>
                        <Text fontSize="sm" color="gray.600">• Real-time data updates</Text>
                        <Text fontSize="sm" color="gray.600">• Notifikasi otomatis</Text>
                        <Text fontSize="sm" color="gray.600">• Export & import data</Text>
                    </VStack>
                </VStack>

                {/* Back Button */}
                <Button
                    as={RouterLink}
                    to={backTo}
                    leftIcon={<ArrowLeft size={16} />}
                    bg={COLORS.primary}
                    color="white"
                    size="lg"
                    borderRadius="12px"
                    px={8}
                    _hover={{
                        bg: COLORS.primary,
                        opacity: 0.9,
                        transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s ease"
                >
                    {backLabel}
                </Button>
            </VStack>
        </Container>
    );
};

export default PlaceholderPage; 