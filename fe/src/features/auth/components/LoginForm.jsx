import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    VStack,
    Text,
    Image,
    useDisclosure
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../api/useAuth';
import { validateLoginForm } from '../api/authValidation';
import gambarBackground from '@assets/gambar.svg';
import { PrimaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormField from '@shared/components/FormField';
import ForgotPasswordModal from './ForgotPasswordModal';
import { COLORS } from '@utils/designTokens';

const LoginForm = ({ onToggle }) => {
    const {
        formData,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        resetForm
    } = useLogin();

    const [errors, setErrors] = useState({});
    const { isOpen: isForgotPasswordOpen, onOpen: onForgotPasswordOpen, onClose: onForgotPasswordClose } = useDisclosure();

    // Reset errors ketika component mount
    useEffect(() => {
        setErrors({});
    }, []);

    const handleValidatedSubmit = (e) => {
        e.preventDefault();

        const validation = validateLoginForm(formData);
        setErrors(validation.errors);

        if (validation.isValid) {
            handleSubmit(e);
        }
    };

    return (
        <Flex h="100vh" w="100%" position="relative" bg={COLORS.background}>

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
                    position="relative"
                >
                    <VStack spacing={6} as="form" onSubmit={handleValidatedSubmit}>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={COLORS.text}
                            textAlign="center"
                            mb={2}
                        >
                            Masuk
                        </Text>

                        <FormField
                            label="Email"
                            isRequired
                            error={errors.email}
                        >
                            <Input
                                name="email"
                                type="email"
                                variant="glassmorphism"
                                placeholder="ul@unand.id"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormField>

                        <FormField
                            label="Password"
                            isRequired
                            error={errors.password}
                        >
                            <Input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                variant="glassmorphism"
                                placeholder="••••••••"
                                value={formData.password}
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
                            loadingText="Masuk..."
                            disabled={Object.keys(errors).length > 0}
                        >
                            Masuk
                        </PrimaryButton>

                        <Text
                            fontSize="sm"
                            color={COLORS.primary}
                            textAlign="center"
                            cursor="pointer"
                            fontWeight="medium"
                            _hover={{ textDecoration: 'underline' }}
                            onClick={onForgotPasswordOpen}
                        >
                            Lupa password?
                        </Text>

                        <Text fontSize="sm" color="#71717A" textAlign="center">
                            Belum punya akun?{' '}
                            <Text
                                as="span"
                                color={COLORS.primary}
                                cursor="pointer"
                                fontWeight="medium"
                                _hover={{ textDecoration: 'underline' }}
                                onClick={onToggle}
                            >
                                Daftar
                            </Text>
                        </Text>
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

            </Box>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={onForgotPasswordClose}
            />
        </Flex>
    );
};

export default LoginForm; 