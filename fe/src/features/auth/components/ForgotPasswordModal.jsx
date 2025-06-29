import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    VStack,
    Text,
    Box,
    HStack,
    Icon
} from '@chakra-ui/react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useForgotPassword } from '../api/useAuth';
import { validateForgotPassword } from '../api/authValidation';
import { PrimaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormField from '@shared/components/FormField';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const { email, setEmail, loading, handleSubmit, resetForm } = useForgotPassword();
    const [errors, setErrors] = useState({});

    const handleModalClose = () => {
        resetForm();
        setErrors({});
        onClose();
    };

    const handleValidatedSubmit = async (e) => {
        e.preventDefault();

        const validation = validateForgotPassword(email);
        setErrors(validation.errors);

        if (validation.isValid) {
            try {
                await handleSubmit(e);
                // Close modal after successful submission
                handleModalClose();
            } catch (error) {
                // Error is handled by the useAuth hook
                console.error('Forgot password error:', error);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleModalClose} size="md" isCentered>
            <ModalOverlay
                bg="rgba(215, 215, 215, 0.5)"
                backdropFilter="blur(10px)"
            />
            <ModalContent
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                fontFamily="Inter, sans-serif"
                mx={4}
            >
                <ModalHeader pb={2} pt={6}>
                    <HStack spacing={3} align="center">
                        <Box
                            p={2}
                            borderRadius="12px"
                            bg="rgba(33, 209, 121, 0.1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={Mail} size={20} color="#21D179" />
                        </Box>
                        <Text
                            fontSize="xl"
                            fontWeight="700"
                            color="#2A2A2A"
                            fontFamily="Inter, sans-serif"
                        >
                            Lupa Password
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={4}>
                    <VStack spacing={6} align="stretch">
                        {/* Description */}
                        <Box
                            bg="rgba(33, 209, 121, 0.05)"
                            borderRadius="16px"
                            p={4}
                            border="1px solid rgba(33, 209, 121, 0.1)"
                        >
                            <Text
                                fontSize="sm"
                                color="#2A2A2A"
                                lineHeight="1.6"
                                fontFamily="Inter, sans-serif"
                                textAlign="center"
                            >
                                Masukkan alamat email Anda dan kami akan mengirimkan link untuk reset password ke email tersebut.
                            </Text>
                        </Box>

                        {/* Form */}
                        <Box as="form" onSubmit={handleValidatedSubmit}>
                            <VStack spacing={5} align="stretch">
                                <FormField
                                    label="Email"
                                    isRequired
                                    error={errors.email}
                                >
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="ul@unand.id"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            // Clear errors when user starts typing
                                            if (errors.email) {
                                                setErrors({});
                                            }
                                        }}
                                        bg="rgba(255, 255, 255, 0.8)"
                                        backdropFilter="blur(10px)"
                                        border="1px solid rgba(215, 215, 215, 0.5)"
                                        borderRadius="24px"
                                        fontFamily="Inter, sans-serif"
                                        fontSize="sm"
                                        h="48px"
                                        px={4}
                                        _placeholder={{
                                            color: "#999",
                                            opacity: 0.8
                                        }}
                                        _focus={{
                                            borderColor: "#21D179",
                                            boxShadow: "0 0 0 1px #21D179",
                                            bg: "rgba(255, 255, 255, 0.95)",
                                            outline: "none"
                                        }}
                                        _hover={{
                                            borderColor: "rgba(33, 209, 121, 0.6)"
                                        }}
                                        _invalid={{
                                            borderColor: "#EF4444",
                                            boxShadow: "0 0 0 1px #EF4444"
                                        }}
                                    />
                                </FormField>
                            </VStack>
                        </Box>

                        {/* Info Box */}
                        <Box
                            bg="rgba(59, 130, 246, 0.05)"
                            borderRadius="12px"
                            p={3}
                            border="1px solid rgba(59, 130, 246, 0.2)"
                        >
                            <Text
                                fontSize="xs"
                                color="#3B82F6"
                                fontFamily="Inter, sans-serif"
                                textAlign="center"
                                lineHeight="1.4"
                            >
                                💡 Pastikan email yang Anda masukkan sudah terdaftar di sistem
                            </Text>
                        </Box>
                    </VStack>
                </ModalBody>

                <ModalFooter
                    justifyContent="space-between"
                    gap={3}
                    pt={2}
                    pb={6}
                >
                    <HStack
                        spacing={2}
                        color="#666"
                        cursor="pointer"
                        fontWeight="500"
                        fontSize="sm"
                        fontFamily="Inter, sans-serif"
                        _hover={{
                            color: "#21D179",
                            textDecoration: "none"
                        }}
                        onClick={handleModalClose}
                        flex={1}
                        justify="flex-start"
                    >
                        <Icon as={ArrowLeft} size={16} />
                        <Text>Kembali ke login</Text>
                    </HStack>

                    <PrimaryButton
                        onClick={handleValidatedSubmit}
                        isLoading={loading}
                        loadingText="Mengirim..."
                        bg="#21D179"
                        color="white"
                        borderRadius="9999px"
                        fontFamily="Inter, sans-serif"
                        fontWeight="600"
                        h="48px"
                        px={8}
                        fontSize="sm"
                        isDisabled={!email.trim() || !!errors.email}
                        _hover={{
                            bg: "#1BAE66",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(33, 209, 121, 0.3)"
                        }}
                        _active={{
                            transform: "translateY(0)"
                        }}
                        _disabled={{
                            bg: "#D1D5DB",
                            color: "#9CA3AF",
                            cursor: "not-allowed",
                            transform: "none",
                            boxShadow: "none"
                        }}
                        transition="all 0.2s ease"
                    >
                        Kirim Link Reset
                    </PrimaryButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ForgotPasswordModal; 