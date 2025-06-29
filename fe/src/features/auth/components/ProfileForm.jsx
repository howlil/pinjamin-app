import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Select, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { User, CheckCircle, UserCircle } from 'lucide-react';
import Input from '@shared/components/Input';
import Button, { PrimaryButton } from '@shared/components/Button';
import FormField from '@shared/components/FormField';
import { useUpdateProfile } from '../api/useAuth';
import { validateUpdateProfile } from '../api/authValidation';
import { COLORS } from '@utils/designTokens';

export const ProfileForm = () => {
    const { formData, isLoading, handleChange, handleSubmit, loadProfile } = useUpdateProfile();
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        const validation = validateUpdateProfile(formData);
        setErrors(validation.errors);

        if (validation.isValid) {
            try {
                await handleSubmit(e);
                setShowSuccess(true);
                setErrors({});

                // Hide success message after 5 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 5000);
            } catch (error) {
                console.error('Update profile error:', error);
            }
        }
    };

    const handleReset = () => {
        loadProfile();
        setErrors({});
        setShowSuccess(false);
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <VStack spacing={3} align="start">
                <HStack spacing={3} align="center">
                    <Box
                        p={2}
                        borderRadius="12px"
                        bg="rgba(33, 209, 121, 0.1)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <UserCircle size={20} color="#21D179" />
                    </Box>
                    <Text
                        fontSize="xl"
                        fontWeight="700"
                        color={COLORS.text}
                        fontFamily="Inter, sans-serif"
                    >
                        Informasi Profile
                    </Text>
                </HStack>
                <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="Inter, sans-serif"
                    lineHeight="1.6"
                >
                    Kelola informasi personal dan data bank untuk kemudahan transaksi
                </Text>
            </VStack>

            {/* Success Alert */}
            {showSuccess && (
                <Alert
                    status="success"
                    borderRadius="16px"
                    bg="rgba(16, 185, 129, 0.1)"
                    border="1px solid rgba(16, 185, 129, 0.2)"
                    color="#059669"
                >
                    <AlertIcon as={CheckCircle} color="#059669" />
                    <Box fontFamily="Inter, sans-serif">
                        <AlertTitle fontSize="sm" fontWeight="600">
                            Profile berhasil diperbarui!
                        </AlertTitle>
                        <AlertDescription fontSize="xs" mt={1}>
                            Informasi profile Anda telah berhasil disimpan.
                        </AlertDescription>
                    </Box>
                </Alert>
            )}

            {/* Form */}
            <Box
                as="form"
                onSubmit={onSubmit}
                bg="rgba(248, 250, 252, 0.6)"
                backdropFilter="blur(10px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.3)"
                p={8}
            >
                <VStack spacing={6} align="stretch">
                    {/* Personal Information Section */}
                    <Box>
                        <Text
                            fontSize="md"
                            fontWeight="600"
                            color={COLORS.text}
                            fontFamily="Inter, sans-serif"
                            mb={4}
                            pb={2}
                            borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                        >
                            Informasi Personal
                        </Text>
                        <VStack spacing={4} align="stretch">
                            <FormField
                                label="Nama Lengkap"
                                isRequired
                                error={errors.fullName}
                            >
                                <Input
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
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
                                />
                            </FormField>

                            <FormField
                                label="Email"
                                isRequired
                                error={errors.email}
                            >
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
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
                                />
                            </FormField>

                            <FormField
                                label="Nomor Telepon"
                                isRequired
                                error={errors.phoneNumber}
                            >
                                <Input
                                    type="tel"
                                    placeholder="+62812345678"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
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
                                />
                            </FormField>

                            <FormField
                                label="Tipe Peminjam"
                                isRequired
                                error={errors.borrowerType}
                            >
                                <Select
                                    name="borrowerType"
                                    value={formData.borrowerType}
                                    onChange={handleChange}
                                    placeholder="Pilih tipe peminjam"
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
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
                                >
                                    <option value="INTERNAL_UNAND">Internal UNAND</option>
                                    <option value="EXTERNAL_UNAND">External UNAND</option>
                                </Select>
                            </FormField>
                        </VStack>
                    </Box>

                    {/* Banking Information Section */}
                    <Box>
                        <Text
                            fontSize="md"
                            fontWeight="600"
                            color={COLORS.text}
                            fontFamily="Inter, sans-serif"
                            mb={4}
                            pb={2}
                            borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                        >
                            Informasi Bank
                        </Text>
                        <VStack spacing={4} align="stretch">
                            <FormField
                                label="Nama Bank"
                                isRequired
                                error={errors.bankName}
                            >
                                <Input
                                    type="text"
                                    placeholder="Contoh: Bank BCA"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
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
                                />
                            </FormField>

                            <FormField
                                label="Nomor Rekening"
                                isRequired
                                error={errors.bankNumber}
                            >
                                <Input
                                    type="text"
                                    placeholder="1234567890"
                                    name="bankNumber"
                                    value={formData.bankNumber}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
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
                                />
                            </FormField>
                        </VStack>
                    </Box>

                    {/* Info Box */}
                    <Box
                        bg="rgba(59, 130, 246, 0.05)"
                        borderRadius="16px"
                        p={4}
                        border="1px solid rgba(59, 130, 246, 0.2)"
                    >
                        <Text
                            fontSize="xs"
                            color="#3B82F6"
                            fontFamily="Inter, sans-serif"
                            textAlign="center"
                            lineHeight="1.4"
                        >
                            💡 Pastikan informasi bank benar untuk kemudahan proses refund
                        </Text>
                    </Box>

                    {/* Buttons */}
                    <HStack spacing={3} justify="flex-end" pt={4}>
                        <Box
                            as="button"
                            type="button"
                            onClick={handleReset}
                            px={6}
                            py={3}
                            borderRadius="9999px"
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            bg="rgba(255, 255, 255, 0.8)"
                            backdropFilter="blur(10px)"
                            color="#666"
                            fontSize="sm"
                            fontWeight="600"
                            fontFamily="Inter, sans-serif"
                            cursor="pointer"
                            transition="all 0.2s ease"
                            _hover={{
                                bg: "rgba(248, 250, 252, 0.9)",
                                borderColor: "rgba(33, 209, 121, 0.3)",
                                color: COLORS.primary,
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                        >
                            Reset
                        </Box>
                        <PrimaryButton
                            type="submit"
                            isLoading={isLoading}
                            loadingText="Menyimpan..."
                            h="48px"
                            px={6}
                            bg="#21D179"
                            color="white"
                            borderRadius="9999px"
                            fontFamily="Inter, sans-serif"
                            fontWeight="600"
                            fontSize="sm"
                            _hover={{
                                bg: "#1BAE66",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(33, 209, 121, 0.3)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all 0.2s ease"
                        >
                            Simpan Perubahan
                        </PrimaryButton>
                    </HStack>
                </VStack>
            </Box>
        </VStack>
    );
}; 