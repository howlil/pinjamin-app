import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    VStack,
    Text,
    Image,
} from '@chakra-ui/react';
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './api/useAuth';
import { validateResetPassword } from './api/authValidation';
import gambarBackground from '@assets/gambar.svg';
import { PrimaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormField from '@shared/components/FormField';
import { COLORS } from '@utils/designTokens';
import AnimatedGridPattern from '@shared/components/AnimatedGridPattern';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { resetPassword, loading } = useAuth();

    const [formData, setFormData] = useState({
        token: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Extract token from URL on component mount
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setFormData(prev => ({
                ...prev,
                token: tokenFromUrl
            }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleValidatedSubmit = async (e) => {
        e.preventDefault();

        const validation = validateResetPassword(formData);
        setErrors(validation.errors);

        if (!validation.isValid) {
            // Show first error
            const firstError = Object.values(validation.errors)[0];
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        try {
            await resetPassword(formData);
            // Success handling is done in the useAuth hook (navigate to login)
        } catch (error) {
            console.error('Reset password error:', error);
        }
    };

    const handleBackToLogin = () => {
        navigate('/auth');
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
                    bg="rgba(255, 255, 255, 0.95)"
                    backdropFilter="blur(15px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                    position="relative"
                    fontFamily="Inter, sans-serif"
                >
                    <VStack spacing={6} as="form" onSubmit={handleValidatedSubmit}>
                        {/* Header */}
                        <VStack spacing={3} textAlign="center">
                            <Box
                                p={3}
                                borderRadius="16px"
                                bg="rgba(33, 209, 121, 0.1)"
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Shield size={32} color="#21D179" />
                            </Box>
                            <Text
                                fontSize="2xl"
                                fontWeight="700"
                                color={COLORS.text}
                                textAlign="center"
                                fontFamily="Inter, sans-serif"
                            >
                                Reset Password
                            </Text>
                            <Text
                                fontSize="sm"
                                color="#666"
                                textAlign="center"
                                px={4}
                                lineHeight="1.6"
                                fontFamily="Inter, sans-serif"
                            >
                                Masukkan password baru untuk akun Anda. Pastikan password kuat dan mudah diingat.
                            </Text>
                        </VStack>

                        {/* Token Field (Hidden but accessible for debugging) */}
                        {!formData.token && (
                            <Box
                                bg="rgba(239, 68, 68, 0.05)"
                                borderRadius="12px"
                                p={3}
                                border="1px solid rgba(239, 68, 68, 0.2)"
                            >
                                <Text
                                    fontSize="xs"
                                    color="#EF4444"
                                    fontFamily="Inter, sans-serif"
                                    textAlign="center"
                                >
                                    ⚠️ Token reset password tidak ditemukan. Pastikan Anda mengakses link dari email.
                                </Text>
                            </Box>
                        )}

                        {/* Password Fields */}
                        <FormField
                            label="Password Baru"
                            isRequired
                            error={errors.newPassword}
                        >
                            <Box position="relative">
                                <Input
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="24px"
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
                                    _invalid={{
                                        borderColor: "#EF4444",
                                        boxShadow: "0 0 0 1px #EF4444"
                                    }}
                                />
                                <Box
                                    as="button"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    p={2}
                                    color="#A0AEC0"
                                    _hover={{ color: COLORS.primary }}
                                    cursor="pointer"
                                    position="absolute"
                                    right={3}
                                    top="50%"
                                    transform="translateY(-50%)"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Box>
                            </Box>
                        </FormField>

                        <FormField
                            label="Konfirmasi Password"
                            isRequired
                            error={errors.confirmPassword}
                        >
                            <Box position="relative">
                                <Input
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="24px"
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
                                    _invalid={{
                                        borderColor: "#EF4444",
                                        boxShadow: "0 0 0 1px #EF4444"
                                    }}
                                />
                                <Box
                                    as="button"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    p={2}
                                    color="#A0AEC0"
                                    _hover={{ color: COLORS.primary }}
                                    cursor="pointer"
                                    position="absolute"
                                    right={3}
                                    top="50%"
                                    transform="translateY(-50%)"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Box>
                            </Box>
                        </FormField>

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
                                💡 Password harus minimal 6 karakter dan mengandung huruf serta angka
                            </Text>
                        </Box>

                        {/* Submit Button */}
                        <PrimaryButton
                            type="submit"
                            w="100%"
                            h="48px"
                            fontSize="sm"
                            fontWeight="600"
                            isLoading={loading}
                            loadingText="Mereset..."
                            bg="#21D179"
                            color="white"
                            borderRadius="9999px"
                            fontFamily="Inter, sans-serif"
                            isDisabled={!formData.token || !formData.newPassword || !formData.confirmPassword}
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
                            Reset Password
                        </PrimaryButton>

                        {/* Back to Login */}
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            color="#666"
                            cursor="pointer"
                            fontWeight="500"
                            fontSize="sm"
                            fontFamily="Inter, sans-serif"
                            _hover={{
                                color: "#21D179",
                                textDecoration: "none"
                            }}
                            onClick={handleBackToLogin}
                            transition="all 0.2s ease"
                        >
                            <ArrowLeft size={16} />
                            <Text>Kembali ke login</Text>
                        </Box>
                    </VStack>
                </Box>
            </Box>

            {/* Right Side - Image */}
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
                    borderRadius="9999px"
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
                    <Text fontSize="sm" color={COLORS.text} fontWeight="600" fontFamily="Inter, sans-serif">
                        Reset password
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
};

export default ResetPasswordPage; 