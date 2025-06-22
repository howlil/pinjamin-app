import React from 'react';
import {
    Box,
    Flex,
    Text,
    VStack,
    InputRightElement,
    IconButton,
    Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../hooks/auth';
import { GlassInput, PrimaryButton } from '../../components/ui';
import { COLORS } from '../../utils/designTokens';
import gambarBg from '../../assets/gambar.svg';

const LoginPage = () => {
    const {
        formData,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility
    } = useLogin();

    return (
        <Flex minH="100vh" w="100%">
            {/* Left side - Form */}
            <Box
                w="50%"
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={8}
            >
                <Box w="100%" maxW="400px">
                    <VStack spacing={6} align="stretch">
                        {/* Header */}
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" color={COLORS.black}>
                                Masuk
                            </Text>
                            <Text fontSize="sm" color={COLORS.gray[500]}>
                                Masukkan email dan kata sandi Anda untuk masuk!
                            </Text>
                        </Box>

                        {/* Form */}
                        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                            <GlassInput
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="mail@simplelogin.com"
                                isRequired
                            />

                            <GlassInput
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                isRequired
                                rightElement={
                                    <InputRightElement>
                                        <IconButton
                                            variant="ghost"
                                            onClick={togglePasswordVisibility}
                                            icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            size="sm"
                                            color={COLORS.gray[400]}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        />
                                    </InputRightElement>
                                }
                            />

                            <Box w="100%" textAlign="right">
                                <Link
                                    color={COLORS.primary}
                                    fontSize="sm"
                                    _hover={{ textDecoration: 'none', color: COLORS.primaryDark }}
                                >
                                    Lupa password?
                                </Link>
                            </Box>

                            <PrimaryButton
                                type="submit"
                                size="lg"
                                width="full"
                                isLoading={isLoading}
                                loadingText="Memproses..."
                            >
                                Masuk
                            </PrimaryButton>
                        </VStack>

                        {/* Register Link */}
                        <Flex justify="center" align="center" mt={4}>
                            <Text fontSize="sm" color={COLORS.gray[600]}>
                                belum punya akun?{' '}
                                <Link
                                    as={RouterLink}
                                    to="/register"
                                    color={COLORS.primary}
                                    fontWeight="medium"
                                    _hover={{ textDecoration: 'none', color: COLORS.primaryDark }}
                                >
                                    daftar
                                </Link>
                            </Text>
                        </Flex>
                    </VStack>
                </Box>
            </Box>

            {/* Right side - Image */}
            <Box
                w="50%"
                bgImage={`url(${gambarBg})`}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
            />
        </Flex>
    );
};

export default LoginPage;
