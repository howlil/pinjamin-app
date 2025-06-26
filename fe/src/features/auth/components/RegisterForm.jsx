import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    VStack,
    Text,
    Select,
    Image,
    SimpleGrid,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../api/useAuth';
import { validateRegisterForm } from '../api/authValidation';
import gambarBackground from '@assets/gambar.svg';
import { PrimaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormField from '@shared/components/FormField';
import { COLORS } from '@utils/designTokens';


const RegisterForm = ({ onToggle }) => {
    const {
        formData,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
    } = useRegister();

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setErrors({});
    }, []);

    const handleValidatedSubmit = (e) => {
        e.preventDefault();

        const validation = validateRegisterForm(formData);
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
                overflowY="auto"
            >
                <Box
                    w="100%"
                    maxW="600px"
                    p={8}
                    bg="rgba(255, 255, 255, 0.9)"
                    backdropFilter="blur(10px)"
                    position="relative"
                    my={4}
                >
                    <VStack spacing={6} as="form" onSubmit={handleValidatedSubmit}>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={COLORS.text}
                            textAlign="center"
                            mb={2}
                        >
                            Daftar
                        </Text>

                        <SimpleGrid columns={2} spacing={4} w="100%">
                            <FormField
                                label="Nama Lengkap"
                                isRequired
                                error={errors.fullName}
                            >
                                <Input
                                    name="fullName"
                                    type="text"
                                    variant="glassmorphism"
                                    placeholder="Masukkan nama lengkap"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </FormField>

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

                            <FormField
                                label="Tipe Peminjam"
                                isRequired
                                error={errors.borrowerType}
                            >
                                <Select
                                    name="borrowerType"
                                    placeholder="Pilih tipe peminjam"
                                    value={formData.borrowerType || ''}
                                    onChange={handleChange}
                                    bg="rgba(255, 255, 255, 0.7)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="full"
                                    h="48px"
                                    fontSize="sm"
                                    _placeholder={{ color: "#A0AEC0" }}
                                    _focus={{
                                        borderColor: COLORS.primary,
                                        boxShadow: `0 0 0 1px ${COLORS.primary}`
                                    }}
                                >
                                    <option value="INTERNAL_UNAND">Internal UNAND</option>
                                    <option value="EXTERNAL_UNAND">External UNAND</option>
                                </Select>
                            </FormField>

                            <FormField
                                label="Nomor Telepon"
                                isRequired
                                error={errors.phoneNumber}
                            >
                                <Input
                                    name="phoneNumber"
                                    type="tel"
                                    variant="glassmorphism"
                                    placeholder="+62812345678"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </FormField>

                            <FormField
                                label="Nama Bank"
                                isRequired
                                error={errors.bankName}
                            >
                                <Input
                                    name="bankName"
                                    type="text"
                                    variant="glassmorphism"
                                    placeholder="Bank BCA"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                />
                            </FormField>
                        </SimpleGrid>

                        <FormField
                            label="Nomor Rekening"
                            isRequired
                            error={errors.bankNumber}
                        >
                            <Input
                                name="bankNumber"
                                type="text"
                                variant="glassmorphism"
                                placeholder="1234567890"
                                value={formData.bankNumber}
                                onChange={handleChange}
                            />
                        </FormField>

                        <PrimaryButton
                            type="submit"
                            w="100%"
                            h="48px"
                            fontSize="sm"
                            fontWeight="medium"
                            isLoading={isLoading}
                            loadingText="Mendaftar..."
                            disabled={Object.keys(errors).length > 0}
                        >
                            Daftar
                        </PrimaryButton>

                        <Text fontSize="sm" color="#71717A" textAlign="center">
                            Sudah punya akun?{' '}
                            <Text
                                as="span"
                                color={COLORS.primary}
                                cursor="pointer"
                                fontWeight="medium"
                                _hover={{ textDecoration: 'underline' }}
                                onClick={onToggle}
                            >
                                Masuk
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
        </Flex>
    );
};

export default RegisterForm; 