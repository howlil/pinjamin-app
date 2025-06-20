import React from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    Alert,
    AlertIcon,
    Code,
    Divider
} from '@chakra-ui/react';
import RegisterForm from './RegisterForm';
import { useRegister } from '../../hooks/useRegister';

const RegisterDemo = () => {
    const registerHook = useRegister();

    return (
        <Container maxW="2xl" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="#749C73" mb={2}>
                        Register Form Demo
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Updated form sesuai dengan API specification
                    </Text>
                </Box>

                {/* API Info */}
                <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={2} w="full">
                        <Text fontWeight="semibold">API Endpoint:</Text>
                        <Code fontSize="sm">POST /api/v1/auth/register</Code>
                        <Text fontSize="sm">
                            Form ini akan mengirim data ke endpoint register dengan field yang sesuai dengan API requirement.
                        </Text>
                    </VStack>
                </Alert>

                {/* Required Fields Info */}
                <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={2} w="full">
                        <Text fontWeight="semibold">Required Fields:</Text>
                        <VStack align="start" spacing={1} fontSize="sm">
                            <Text>• <strong>fullName:</strong> Nama lengkap user</Text>
                            <Text>• <strong>email:</strong> Email user (format valid)</Text>
                            <Text>• <strong>password:</strong> Password minimal 6 karakter</Text>
                            <Text>• <strong>borrowerType:</strong> Tipe peminjam (INTERNAL_UNAND, EXTERNAL_UNAND, dll)</Text>
                            <Text>• <strong>phoneNumber:</strong> Nomor telepon (format Indonesia)</Text>
                            <Text>• <strong>bankName:</strong> Nama bank</Text>
                            <Text>• <strong>bankNumber:</strong> Nomor rekening (6-20 digit)</Text>
                        </VStack>
                    </VStack>
                </Alert>

                <Divider />

                {/* Register Form */}
                <Box
                    bg="white"
                    p={8}
                    borderRadius="20px"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="0 8px 32px rgba(116, 156, 115, 0.15)"
                >
                    <RegisterForm {...registerHook} />
                </Box>

                {/* Example Request Body */}
                <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={2} w="full">
                        <Text fontWeight="semibold">Example Request Body:</Text>
                        <Code fontSize="xs" p={3} borderRadius="md" w="full" whiteSpace="pre-wrap">
                            {`{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "borrowerType": "EXTERNAL_UNAND",
  "phoneNumber": "+62812345678",
  "bankName": "Bank BCA",
  "bankNumber": "1234567890"
}`}
                        </Code>
                    </VStack>
                </Alert>

                {/* Expected Response */}
                <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={2} w="full">
                        <Text fontWeight="semibold">Expected Response (201):</Text>
                        <Code fontSize="xs" p={3} borderRadius="md" w="full" whiteSpace="pre-wrap">
                            {`{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "571589ec-5b9f-41ce-afde-2c81dcab07eb",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "BORROWER"
  }
}`}
                        </Code>
                    </VStack>
                </Alert>

                {/* Validation Features */}
                <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={2} w="full">
                        <Text fontWeight="semibold">Validation Features:</Text>
                        <VStack align="start" spacing={1} fontSize="sm">
                            <Text>✅ Real-time input formatting (phone number, bank number)</Text>
                            <Text>✅ Email format validation</Text>
                            <Text>✅ Phone number format validation (Indonesian)</Text>
                            <Text>✅ Bank account number validation (6-20 digits)</Text>
                            <Text>✅ Password strength validation (min 6 chars)</Text>
                            <Text>✅ Required field validation</Text>
                            <Text>✅ API error handling (400, 409, 500)</Text>
                        </VStack>
                    </VStack>
                </Alert>
            </VStack>
        </Container>
    );
};

export default RegisterDemo; 