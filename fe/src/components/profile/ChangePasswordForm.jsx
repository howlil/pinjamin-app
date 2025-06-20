import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Text,
    Alert,
    AlertIcon,
    Card,
    CardHeader,
    CardBody,
    Heading,
    IconButton
} from '@chakra-ui/react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

const ChangePasswordForm = ({ onChangePassword, changingPassword }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear field-specific error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Password saat ini harus diisi';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Password baru harus diisi';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password baru minimal 8 karakter';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password harus diisi';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
        }

        if (formData.currentPassword && formData.newPassword &&
            formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'Password baru harus berbeda dari password saat ini';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const success = await onChangePassword(formData);

        if (success) {
            // Reset form on success
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({});
        }
    };

    // Reset form
    const handleReset = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
        setShowPasswords({
            current: false,
            new: false,
            confirm: false
        });
    };

    // Check if form has data
    const hasData = Object.values(formData).some(value => value.trim() !== '');

    return (
        <Card>
            <CardHeader>
                <HStack spacing={3}>
                    <Shield size={24} color="var(--chakra-colors-orange-500)" />
                    <Heading size="md" color="gray.800">Ubah Password</Heading>
                </HStack>
            </CardHeader>

            <CardBody>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        <Alert status="info" borderRadius="lg">
                            <AlertIcon />
                            <Box>
                                <Text fontWeight="semibold">Tips Keamanan Password:</Text>
                                <Text fontSize="sm" mt={1}>
                                    • Minimal 8 karakter<br />
                                    • Kombinasi huruf besar, huruf kecil, angka, dan simbol<br />
                                    • Jangan gunakan informasi pribadi yang mudah ditebak
                                </Text>
                            </Box>
                        </Alert>

                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired isInvalid={errors.currentPassword}>
                                <FormLabel fontSize="sm" color="gray.600">
                                    <HStack spacing={2}>
                                        <Lock size={16} />
                                        <Text>Password Saat Ini</Text>
                                    </HStack>
                                </FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={formData.currentPassword}
                                        onChange={(e) => handleChange('currentPassword', e.target.value)}
                                        placeholder="Masukkan password saat ini"
                                        bg="white"
                                        borderRadius="full"
                                        pr="3rem"
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            variant="ghost"
                                            size="sm"
                                            icon={showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                            onClick={() => togglePasswordVisibility('current')}
                                            aria-label={showPasswords.current ? 'Sembunyikan password' : 'Tampilkan password'}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {errors.currentPassword && (
                                    <Text color="red.500" fontSize="sm" mt={1}>
                                        {errors.currentPassword}
                                    </Text>
                                )}
                            </FormControl>

                            <FormControl isRequired isInvalid={errors.newPassword}>
                                <FormLabel fontSize="sm" color="gray.600">
                                    <HStack spacing={2}>
                                        <Lock size={16} />
                                        <Text>Password Baru</Text>
                                    </HStack>
                                </FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={formData.newPassword}
                                        onChange={(e) => handleChange('newPassword', e.target.value)}
                                        placeholder="Masukkan password baru"
                                        bg="white"
                                        borderRadius="full"
                                        pr="3rem"
                                        minLength={8}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            variant="ghost"
                                            size="sm"
                                            icon={showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                            onClick={() => togglePasswordVisibility('new')}
                                            aria-label={showPasswords.new ? 'Sembunyikan password' : 'Tampilkan password'}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {errors.newPassword && (
                                    <Text color="red.500" fontSize="sm" mt={1}>
                                        {errors.newPassword}
                                    </Text>
                                )}
                            </FormControl>

                            <FormControl isRequired isInvalid={errors.confirmPassword}>
                                <FormLabel fontSize="sm" color="gray.600">
                                    <HStack spacing={2}>
                                        <Lock size={16} />
                                        <Text>Konfirmasi Password Baru</Text>
                                    </HStack>
                                </FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        placeholder="Ulangi password baru"
                                        bg="white"
                                        borderRadius="full"
                                        pr="3rem"
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            variant="ghost"
                                            size="sm"
                                            icon={showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            aria-label={showPasswords.confirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {errors.confirmPassword && (
                                    <Text color="red.500" fontSize="sm" mt={1}>
                                        {errors.confirmPassword}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>

                        {/* Action Buttons */}
                        <HStack spacing={4} justify="flex-end">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                isDisabled={!hasData || changingPassword}
                                borderRadius="full"
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                colorScheme="orange"
                                isLoading={changingPassword}
                                loadingText="Mengubah Password..."
                                isDisabled={!hasData}
                                borderRadius="full"
                            >
                                Ubah Password
                            </Button>
                        </HStack>
                    </VStack>
                </form>
            </CardBody>
        </Card>
    );
};

export default ChangePasswordForm; 