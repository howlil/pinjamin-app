import React from 'react';
import {
    Box,
    Flex,
    Text,
    Input,
    Button,
    VStack,
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    IconButton,
    Link,
    Select
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../../hooks/auth';
import { GlassInput, PrimaryButton } from '../../components/ui';
import { COLORS, GLASS_EFFECT, RADII } from '../../utils/designTokens';
import gambarBg from '../../assets/gambar.svg';

const RegisterPage = () => {
    const {
        formData,
        showPassword,
        isLoading,
        handleInputChange,
        togglePasswordVisibility,
        handleSubmit
    } = useRegister();

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
                overflowY="auto"
            >
                <Box w="100%" maxW="400px">
                    <VStack spacing={6} align="stretch">
                        {/* Header */}
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" color={COLORS.black}>
                                Daftar
                            </Text>
                            <Text fontSize="sm" color={COLORS.gray[500]}>
                                Masukkan data pribadi Anda untuk mendaftar!
                            </Text>
                        </Box>

                        {/* Form */}
                        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                            <GlassInput
                                name="fullName"
                                label="Nama Lengkap"
                                type="text"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                isRequired
                            />

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                    Tipe Peminjam<Text as="span" color={COLORS.primary}>*</Text>
                                </FormLabel>
                                <Select
                                    name="borrowerType"
                                    value={formData.borrowerType}
                                    onChange={handleInputChange}
                                    placeholder="Civitas Akademika Unand"
                                    bg={GLASS_EFFECT.bg}
                                    backdropFilter={GLASS_EFFECT.backdropFilter}
                                    border={GLASS_EFFECT.border}
                                    borderRadius={RADII.buttonAndInput}
                                    color={COLORS.black}
                                    fontSize="sm"
                                    py={6}
                                    _placeholder={{ color: COLORS.black, opacity: 0.6 }}
                                    _focus={{
                                        borderColor: COLORS.primary,
                                        boxShadow: `0 0 0 1px ${COLORS.primary}`
                                    }}
                                    _hover={{
                                        borderColor: "rgba(116, 156, 115, 0.5)"
                                    }}
                                >
                                    <option value="INTERNAL_UNAND">Civitas Akademika Unand</option>
                                    <option value="EXTERNAL_UNAND">Eksternal Unand</option>
                                </Select>
                            </FormControl>

                            <GlassInput
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="mail.doe@example.com"
                                isRequired
                            />

                            <GlassInput
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
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

                            <GlassInput
                                name="phoneNumber"
                                label="Nomor Telepon"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="+62812345678"
                                isRequired
                            />

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                    Bank<Text as="span" color={COLORS.primary}>*</Text>
                                </FormLabel>
                                <Select
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    placeholder="Pilih bank"
                                    bg={GLASS_EFFECT.bg}
                                    backdropFilter={GLASS_EFFECT.backdropFilter}
                                    border={GLASS_EFFECT.border}
                                    borderRadius={RADII.buttonAndInput}
                                    color={COLORS.black}
                                    fontSize="sm"
                                    py={6}
                                    _placeholder={{ color: COLORS.black, opacity: 0.6 }}
                                    _focus={{
                                        borderColor: COLORS.primary,
                                        boxShadow: `0 0 0 1px ${COLORS.primary}`
                                    }}
                                    _hover={{
                                        borderColor: "rgba(116, 156, 115, 0.5)"
                                    }}
                                >
                                    <option value="Bank BCA">Bank BCA</option>
                                    <option value="Bank BRI">Bank BRI</option>
                                    <option value="Bank BNI">Bank BNI</option>
                                    <option value="Bank Mandiri">Bank Mandiri</option>
                                    <option value="Bank BTN">Bank BTN</option>
                                    <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
                                    <option value="Bank Danamon">Bank Danamon</option>
                                    <option value="Bank Permata">Bank Permata</option>
                                    <option value="Bank Maybank">Bank Maybank</option>
                                    <option value="Bank OCBC NISP">Bank OCBC NISP</option>
                                    <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                                    <option value="Bank Muamalat">Bank Muamalat</option>
                                </Select>
                            </FormControl>

                            <GlassInput
                                name="bankNumber"
                                label="Nomor Rekening"
                                type="text"
                                value={formData.bankNumber}
                                onChange={handleInputChange}
                                placeholder="1234567890"
                                isRequired
                            />

                            <PrimaryButton
                                type="submit"
                                size="lg"
                                width="full"
                                isLoading={isLoading}
                                loadingText="Mendaftar..."
                            >
                                Daftar
                            </PrimaryButton>
                        </VStack>

                        {/* Login Link */}
                        <Flex justify="center" align="center" mt={4}>
                            <Text fontSize="sm" color={COLORS.gray[600]}>
                                sudah punya akun?{' '}
                                <Link
                                    as={RouterLink}
                                    to="/login"
                                    color={COLORS.primary}
                                    fontWeight="medium"
                                    _hover={{ textDecoration: 'none', color: COLORS.primaryDark }}
                                >
                                    masuk
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

export default RegisterPage; 