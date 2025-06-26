import React from 'react';
import {
    Box,
    Flex,
    VStack,
    Text,
    Image,
} from '@chakra-ui/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useResetPassword } from '../api/useAuth';
import { validateResetPassword } from '../api/authValidation';
import gambarBackground from '@assets/gambar.svg';
import { PrimaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormField from '@shared/components/FormField';
import { COLORS } from '@utils/designTokens';
import AnimatedGridPattern from '@shared/components/AnimatedGridPattern';

const ResetPasswordForm = () => {
    const {
        formData,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility
    } = useResetPassword();

    const handleValidatedSubmit = (e) => {
        e.preventDefault();
        const validation = validateResetPassword(formData);
        if (!validation.isValid) {
            return;
        }
        handleSubmit(e);
    };

    const handleBackToLogin = () => {
        window.location.href = '/auth';
    };

    return (
        <Flex h="100vh" w="100%" position="relative" bg={COLORS.background}>
            <AnimatedGridPattern />

            <Box
                w="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={8}
                position="relative"
                zIndex={2}
            >
                <Box
                    w="100%"
                    maxW="420px"
                    p={8}
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(10px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    position="relative"
                >
                    <VStack spacing={6} as="form" onSubmit={handleValidatedSubmit}>
                        <VStack spacing={2} textAlign="center">
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={COLORS.text}
                                textAlign="center"
                            >
                                Reset Password
                            </Text>
                            <Text
                                fontSize="sm"
                                color="#71717A"
                                textAlign="center"
                                px={4}
                            >
                                Masukkan password baru untuk akun Anda
                            </Text>
                        </VStack>

                        <FormField
                            label="Token Reset"
                            isRequired
                        >
                            <Input
                                name="token"
                                type="text"
                                variant="glassmorphism"
                                placeholder="Token dari email"
                                value={formData.token}
                                onChange={handleChange}
                            />
                        </FormField>

                        <FormField
                            label="Password Baru"
                            isRequired
                        >
                            <Input
                                name="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                variant="glassmorphism"
                                placeholder="••••••••"
                                value={formData.newPassword}
                                onChange={handleChange}
                                rightElement={
                                    <Box
                                        as="button"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        p={2}
                                        color="#A0AEC0"
                                        _hover={{ color: COLORS.primary }}
                                        cursor="pointer"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </Box>
                                }
                            />
                        </FormField>

                        <FormField
                            label="Konfirmasi Password"
                            isRequired
                        >
                            <Input
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                variant="glassmorphism"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                rightElement={
                                    <Box
                                        as="button"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        p={2}
                                        color="#A0AEC0"
                                        _hover={{ color: COLORS.primary }}
                                        cursor="pointer"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </Box>
                                }
                            />
                        </FormField>

                        <PrimaryButton
                            type="submit"
                            w="100%"
                            h="48px"
                            fontSize="sm"
                            fontWeight="medium"
                            isLoading={isLoading}
                            loadingText="Mereset..."
                        >
                            Reset Password
                        </PrimaryButton>

                        <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            color={COLORS.primary}
                            cursor="pointer"
                            fontWeight="medium"
                            fontSize="sm"
                            _hover={{ textDecoration: 'underline' }}
                            onClick={handleBackToLogin}
                        >
                            <ArrowLeft size={16} />
                            <Text>Kembali ke login</Text>
                        </Box>
                    </VStack>
                </Box>
            </Box>

            <Box
                w="50%"
                position="relative"
                overflow="hidden"
            >
                <Image
                    src={gambarBackground}
                    alt="Mountain landscape background"
                    w="100%"
                    h="100vh"
                    objectFit="cover"
                    objectPosition="center"
                />

                <Box
                    position="absolute"
                    top={4}
                    right={4}
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(10px)"
                    borderRadius="full"
                    px={4}
                    py={2}
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    display="flex"
                    alignItems="center"
                    gap={2}
                >
                    <Box
                        w={2}
                        h={2}
                        bg={COLORS.primary}
                        borderRadius="full"
                    />
                    <Text fontSize="sm" color={COLORS.text} fontWeight="medium">
                        Reset password
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
};

export default ResetPasswordForm; 