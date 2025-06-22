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
    Heading,
    IconButton,
    Container,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

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

    // Responsive values
    const containerPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const headingSize = useBreakpointValue({ base: "md", md: "lg" });

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
        <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="20px"
                boxShadow="0 20px 60px rgba(239, 68, 68, 0.1)"
                overflow="hidden"
                position="relative"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={25}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#ef4444]/8 stroke-[#ef4444]/4"
                />

                {/* Header */}
                <Box
                    p={containerPadding}
                    borderBottom="1px solid rgba(255, 255, 255, 0.12)"
                    position="relative"
                    zIndex={1}
                >
                    <HStack spacing={3}>
                        <MotionBox
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            w={10}
                            h={10}
                            bg="rgba(239, 68, 68, 0.15)"
                            borderRadius="12px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid rgba(239, 68, 68, 0.2)"
                        >
                            <Shield size={20} color="#ef4444" />
                        </MotionBox>
                        <VStack align="start" spacing={0}>
                            <Heading size={headingSize} color="#444444">
                                Ubah Password
                            </Heading>
                            <Text fontSize={{ base: "xs", sm: "sm" }} color="#666666">
                                Perbarui password Anda untuk keamanan yang lebih baik
                            </Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Form Content */}
                <Box p={containerPadding} position="relative" zIndex={1}>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={6} align="stretch">
                            {/* Security Tips Alert */}
                            <MotionBox
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                bg="rgba(59, 130, 246, 0.08)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(59, 130, 246, 0.2)"
                                borderRadius="12px"
                                p={4}
                            >
                                <HStack spacing={3} align="start">
                                    <Box
                                        w={6}
                                        h={6}
                                        bg="rgba(59, 130, 246, 0.15)"
                                        borderRadius="6px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                        mt={0.5}
                                    >
                                        <AlertIcon color="#3b82f6" boxSize={3} />
                                    </Box>
                                    <VStack align="start" spacing={2}>
                                        <Text fontWeight="semibold" color="#1e40af" fontSize="sm">
                                            Tips Keamanan Password:
                                        </Text>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="xs" color="#3730a3">• Minimal 8 karakter</Text>
                                            <Text fontSize="xs" color="#3730a3">• Kombinasi huruf besar, huruf kecil, angka, dan simbol</Text>
                                            <Text fontSize="xs" color="#3730a3">• Jangan gunakan informasi pribadi yang mudah ditebak</Text>
                                        </VStack>
                                    </VStack>
                                </HStack>
                            </MotionBox>

                            {/* Form Fields */}
                            <VStack spacing={5} align="stretch">
                                {/* Current Password */}
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    <FormControl isRequired isInvalid={errors.currentPassword}>
                                        <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                            <HStack spacing={2}>
                                                <Lock size={14} color={COLORS.primary} />
                                                <Text>Password Saat Ini</Text>
                                            </HStack>
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPasswords.current ? 'text' : 'password'}
                                                value={formData.currentPassword}
                                                onChange={(e) => handleChange('currentPassword', e.target.value)}
                                                placeholder="Masukkan password saat ini"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                pr="3rem"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    onClick={() => togglePasswordVisibility('current')}
                                                    aria-label={showPasswords.current ? 'Sembunyikan password' : 'Tampilkan password'}
                                                    color="#666666"
                                                    _hover={{ color: COLORS.primary }}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        {errors.currentPassword && (
                                            <Text color="#ef4444" fontSize="xs" mt={1}>
                                                {errors.currentPassword}
                                            </Text>
                                        )}
                                    </FormControl>
                                </MotionBox>

                                {/* New Password */}
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                >
                                    <FormControl isRequired isInvalid={errors.newPassword}>
                                        <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                            <HStack spacing={2}>
                                                <Lock size={14} color={COLORS.primary} />
                                                <Text>Password Baru</Text>
                                            </HStack>
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPasswords.new ? 'text' : 'password'}
                                                value={formData.newPassword}
                                                onChange={(e) => handleChange('newPassword', e.target.value)}
                                                placeholder="Masukkan password baru"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                pr="3rem"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                                minLength={8}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    onClick={() => togglePasswordVisibility('new')}
                                                    aria-label={showPasswords.new ? 'Sembunyikan password' : 'Tampilkan password'}
                                                    color="#666666"
                                                    _hover={{ color: COLORS.primary }}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        {errors.newPassword && (
                                            <Text color="#ef4444" fontSize="xs" mt={1}>
                                                {errors.newPassword}
                                            </Text>
                                        )}
                                    </FormControl>
                                </MotionBox>

                                {/* Confirm Password */}
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                >
                                    <FormControl isRequired isInvalid={errors.confirmPassword}>
                                        <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                            <HStack spacing={2}>
                                                <Lock size={14} color={COLORS.primary} />
                                                <Text>Konfirmasi Password Baru</Text>
                                            </HStack>
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPasswords.confirm ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                                placeholder="Ulangi password baru"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                pr="3rem"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                    aria-label={showPasswords.confirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                                    color="#666666"
                                                    _hover={{ color: COLORS.primary }}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        {errors.confirmPassword && (
                                            <Text color="#ef4444" fontSize="xs" mt={1}>
                                                {errors.confirmPassword}
                                            </Text>
                                        )}
                                    </FormControl>
                                </MotionBox>
                            </VStack>

                            {/* Action Buttons */}
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.7 }}
                            >
                                <HStack spacing={3} justify="flex-end" flexWrap="wrap">
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        isDisabled={!hasData || changingPassword}
                                        bg="rgba(255, 255, 255, 0.1)"
                                        backdropFilter="blur(8px)"
                                        border="1px solid rgba(255, 255, 255, 0.15)"
                                        borderRadius="10px"
                                        color="#666666"
                                        _hover={{
                                            bg: "rgba(107, 114, 128, 0.15)",
                                            borderColor: "rgba(107, 114, 128, 0.3)",
                                            color: "#6b7280"
                                        }}
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        isLoading={changingPassword}
                                        loadingText="Mengubah..."
                                        isDisabled={!hasData}
                                        bg="rgba(239, 68, 68, 0.15)"
                                        color="#ef4444"
                                        border="1px solid rgba(239, 68, 68, 0.3)"
                                        borderRadius="10px"
                                        _hover={{
                                            bg: "rgba(239, 68, 68, 0.2)",
                                            borderColor: "rgba(239, 68, 68, 0.4)"
                                        }}
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        Ubah Password
                                    </Button>
                                </HStack>
                            </MotionBox>
                        </VStack>
                    </form>
                </Box>
            </MotionBox>
        </Container>
    );
};

export default ChangePasswordForm; 