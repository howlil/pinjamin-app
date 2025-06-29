import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { useChangePassword } from '../api/useAuth';
import { validateChangePassword } from '../api/authValidation';
import { PrimaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormField from '@shared/components/FormField';
import { COLORS } from '@utils/designTokens';

const ChangePasswordForm = () => {
    const {
        formData,
        showPasswords,
        loading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        resetForm
    } = useChangePassword();

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        const validation = validateChangePassword(formData);
        setErrors(validation.errors);

        if (!validation.isValid) {
            return;
        }

        try {
            await handleSubmit(e);
            setShowSuccess(true);
            setErrors({});

            // Hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Change password error:', error);
        }
    };

    const handleReset = () => {
        resetForm();
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
                        <Shield size={20} color="#21D179" />
                    </Box>
                    <Text
                        fontSize="xl"
                        fontWeight="700"
                        color={COLORS.text}
                        fontFamily="Inter, sans-serif"
                    >
                        Ubah Password
                    </Text>
                </HStack>
                <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="Inter, sans-serif"
                    lineHeight="1.6"
                >
                    Untuk keamanan akun, pastikan password baru Anda kuat dan mudah diingat
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
                            Password berhasil diubah!
                        </AlertTitle>
                        <AlertDescription fontSize="xs" mt={1}>
                            Password Anda telah berhasil diperbarui. Gunakan password baru untuk login selanjutnya.
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
                <VStack spacing={5} align="stretch">
                    {/* Current Password */}
                    <FormField
                        label="Password Saat Ini"
                        isRequired
                        error={errors.currentPassword}
                    >
                        <Box position="relative">
                            <Input
                                name="currentPassword"
                                type={showPasswords.current ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                bg="rgba(255, 255, 255, 0.8)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                borderRadius="9999px"
                                fontFamily="Inter, sans-serif"
                                fontSize="sm"
                                h="48px"
                                px={4}
                                pr={12}
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
                            <Box
                                as="button"
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                p={2}
                                color="#A0AEC0"
                                _hover={{ color: COLORS.primary }}
                                cursor="pointer"
                                position="absolute"
                                right={3}
                                top="50%"
                                transform="translateY(-50%)"
                                transition="all 0.2s ease"
                            >
                                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Box>
                        </Box>
                    </FormField>

                    {/* New Password */}
                    <FormField
                        label="Password Baru"
                        isRequired
                        error={errors.newPassword}
                    >
                        <Box position="relative">
                            <Input
                                name="newPassword"
                                type={showPasswords.new ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.newPassword}
                                onChange={handleChange}
                                bg="rgba(255, 255, 255, 0.8)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                borderRadius="9999px"
                                fontFamily="Inter, sans-serif"
                                fontSize="sm"
                                h="48px"
                                px={4}
                                pr={12}
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
                            <Box
                                as="button"
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                p={2}
                                color="#A0AEC0"
                                _hover={{ color: COLORS.primary }}
                                cursor="pointer"
                                position="absolute"
                                right={3}
                                top="50%"
                                transform="translateY(-50%)"
                                transition="all 0.2s ease"
                            >
                                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Box>
                        </Box>
                    </FormField>

                    {/* Confirm Password */}
                    <FormField
                        label="Konfirmasi Password Baru"
                        isRequired
                        error={errors.confirmPassword}
                    >
                        <Box position="relative">
                            <Input
                                name="confirmPassword"
                                type={showPasswords.confirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                bg="rgba(255, 255, 255, 0.8)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                borderRadius="9999px"
                                fontFamily="Inter, sans-serif"
                                fontSize="sm"
                                h="48px"
                                px={4}
                                pr={12}
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
                            <Box
                                as="button"
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                p={2}
                                color="#A0AEC0"
                                _hover={{ color: COLORS.primary }}
                                cursor="pointer"
                                position="absolute"
                                right={3}
                                top="50%"
                                transform="translateY(-50%)"
                                transition="all 0.2s ease"
                            >
                                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Box>
                        </Box>
                    </FormField>

                    {/* Password Requirements */}
                    <Box
                        bg="rgba(59, 130, 246, 0.05)"
                        borderRadius="16px"
                        p={4}
                        border="1px solid rgba(59, 130, 246, 0.2)"
                    >
                        <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="#3B82F6"
                            fontFamily="Inter, sans-serif"
                            mb={2}
                        >
                            Persyaratan Password:
                        </Text>
                        <VStack spacing={1} align="start">
                            <Text fontSize="xs" color="#3B82F6" fontFamily="Inter, sans-serif">
                                • Minimal 6 karakter
                            </Text>
                            <Text fontSize="xs" color="#3B82F6" fontFamily="Inter, sans-serif">
                                • Mengandung huruf dan angka
                            </Text>
                            <Text fontSize="xs" color="#3B82F6" fontFamily="Inter, sans-serif">
                                • Hindari menggunakan informasi pribadi
                            </Text>
                        </VStack>
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
                            isLoading={loading}
                            loadingText="Mengubah..."
                            h="48px"
                            px={6}
                            bg="#21D179"
                            color="white"
                            borderRadius="9999px"
                            fontFamily="Inter, sans-serif"
                            fontWeight="600"
                            fontSize="sm"
                            isDisabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
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
                            Ubah Password
                        </PrimaryButton>
                    </HStack>
                </VStack>
            </Box>
        </VStack>
    );
};

export default ChangePasswordForm; 