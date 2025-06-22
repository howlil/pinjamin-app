import React from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Text,
    Select,
    HStack,
    Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { PrimaryButton } from '../ui';
import { COLORS } from '../../utils/designTokens';

const RegisterForm = ({
    formData,
    showPassword,
    isLoading,
    handleInputChange,
    togglePasswordVisibility,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Nama Lengkap<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <Input
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        bg="white"
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="full"
                        fontSize="sm"
                        py={6}
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                        _hover={{
                            borderColor: 'gray.300',
                        }}
                    />
                    <FormHelperText fontSize="xs" color="gray.500">
                        Nama lengkap 3-100 karakter
                    </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Email<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                        bg="white"
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="full"
                        fontSize="sm"
                        py={6}
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                        _hover={{
                            borderColor: 'gray.300',
                        }}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Password<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <InputGroup>
                        <Input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Min. 8 karakter"
                            bg="white"
                            border="1px"
                            borderColor="gray.200"
                            borderRadius="full"
                            fontSize="sm"
                            py={6}
                            _focus={{
                                borderColor: COLORS.primary,
                                boxShadow: `0 0 0 1px ${COLORS.primary}`
                            }}
                            _hover={{
                                borderColor: 'gray.300',
                            }}
                        />
                        <InputRightElement h="full" pr={2}>
                            <IconButton
                                variant="ghost"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                onClick={togglePasswordVisibility}
                                size="sm"
                                color="gray.400"
                                _hover={{ color: COLORS.primary }}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormHelperText fontSize="xs" color="gray.500">
                        Password minimal 8 karakter
                    </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Tipe Peminjam<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <Select
                        name="borrowerType"
                        value={formData.borrowerType}
                        onChange={handleInputChange}
                        placeholder="Pilih tipe peminjam"
                        bg="white"
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="full"
                        fontSize="sm"
                        h="50px"
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                        _hover={{
                            borderColor: 'gray.300',
                        }}
                    >
                        <option value="INTERNAL_UNAND">Civitas Akademika Unand</option>
                        <option value="EXTERNAL_UNAND">Eksternal Unand</option>
                    </Select>
                    <FormHelperText fontSize="xs" color="gray.500">
                        Pilih apakah Anda bagian dari civitas akademika Unand atau pihak eksternal
                    </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Nomor Telepon<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <Input
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+62812345678"
                        bg="white"
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="full"
                        fontSize="sm"
                        py={6}
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                        _hover={{
                            borderColor: 'gray.300',
                        }}
                    />
                    <FormHelperText fontSize="xs" color="gray.500">
                        Format: +62812345678 atau 0812345678
                    </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Bank<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <Select
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="Pilih bank"
                        bg="white"
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="full"
                        fontSize="sm"
                        h="50px"
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                        _hover={{
                            borderColor: 'gray.300',
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

                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Nomor Rekening<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <Input
                        name="bankNumber"
                        type="text"
                        value={formData.bankNumber}
                        onChange={handleInputChange}
                        placeholder="1234567890"
                        bg="white"
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="full"
                        fontSize="sm"
                        py={6}
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                        _hover={{
                            borderColor: 'gray.300',
                        }}
                    />
                    <FormHelperText fontSize="xs" color="gray.500">
                        Masukkan nomor rekening (angka 8-20 digit)
                    </FormHelperText>
                </FormControl>

                <PrimaryButton
                    type="submit"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Mendaftar..."
                    size="lg"
                    mt={2}
                >
                    Daftar
                </PrimaryButton>
            </VStack>

            {/* Login Link */}
            <HStack justify="center" mt={6}>
                <Text fontSize="sm" color="gray.600">
                    Sudah punya akun?
                </Text>
                <Link
                    as={RouterLink}
                    to="/login"
                    fontSize="sm"
                    color={COLORS.primary}
                    fontWeight="medium"
                    _hover={{ textDecoration: 'none', color: COLORS.primaryDark }}
                >
                    Masuk
                </Link>
            </HStack>
        </form>
    );
};

export default RegisterForm; 