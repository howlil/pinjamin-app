import React from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
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
import { PrimaryButton } from '@/components/ui';
import { COLORS } from '@/utils/designTokens';

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
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium">
                        Tipe Peninjam<Text as="span" color={COLORS.primary}>*</Text>
                    </FormLabel>
                    <Select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        placeholder="Civitas Akademika Unand"
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
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="dosen">Dosen</option>
                        <option value="staff">Staff</option>
                        <option value="masyarakat">Masyarakat Umum</option>
                    </Select>
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
                            placeholder="Min. 8 characters"
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
                </FormControl>

                <PrimaryButton
                    type="submit"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Daftar..."
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