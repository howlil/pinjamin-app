import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Text,
    Divider,
    Alert,
    AlertIcon,
    Heading,
    Badge,
    Container,
    useBreakpointValue,
    SimpleGrid
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, CreditCard } from 'lucide-react';
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const ProfileForm = ({ profile, onUpdate, updating }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        borrowerType: '',
        bankName: '',
        bankNumber: ''
    });

    const [hasChanges, setHasChanges] = useState(false);

    // Responsive values
    const containerPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const headingSize = useBreakpointValue({ base: "md", md: "lg" });
    const gridColumns = useBreakpointValue({ base: 1, md: 2 });

    // Initialize form data when profile changes
    useEffect(() => {
        if (profile) {
            const newFormData = {
                fullName: profile.fullName || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                borrowerType: profile.borrowerType || '',
                bankName: profile.bankName || '',
                bankNumber: profile.bankNumber || ''
            };
            setFormData(newFormData);
            setHasChanges(false);
        }
    }, [profile]);

    // Handle input change
    const handleChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Check if there are changes
            if (profile) {
                const hasChanged = Object.keys(newData).some(key =>
                    newData[key] !== (profile[key] || '')
                );
                setHasChanges(hasChanged);
            }

            return newData;
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hasChanges) {
            return;
        }

        // Only send fields that have changed
        const changedFields = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] !== (profile[key] || '')) {
                changedFields[key] = formData[key];
            }
        });

        if (Object.keys(changedFields).length > 0) {
            await onUpdate(changedFields);
        }
    };

    // Reset form
    const handleReset = () => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                borrowerType: profile.borrowerType || '',
                bankName: profile.bankName || '',
                bankNumber: profile.bankNumber || ''
            });
            setHasChanges(false);
        }
    };

    const borrowerTypeOptions = [
        { value: 'INTERNAL_UNAND', label: 'Internal Unand' },
        { value: 'EXTERNAL_UNAND', label: 'External Unand' }
    ];

    // Badge configuration for account status
    const statusBadges = [
        {
            label: `Role: ${profile?.role || 'User'}`,
            color: 'blue',
            bg: 'rgba(59, 130, 246, 0.15)',
            textColor: '#3b82f6'
        },
        {
            label: 'Status: Aktif',
            color: 'green',
            bg: 'rgba(16, 185, 129, 0.15)',
            textColor: '#10b981'
        }
    ];

    if (profile?.createdAt) {
        statusBadges.push({
            label: `Bergabung: ${new Date(profile.createdAt).toLocaleDateString('id-ID')}`,
            color: 'gray',
            bg: 'rgba(107, 114, 128, 0.15)',
            textColor: '#6b7280'
        });
    }

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
                boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                overflow="hidden"
                position="relative"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
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
                            bg="rgba(116, 156, 115, 0.15)"
                            borderRadius="12px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                        >
                            <User size={20} color={COLORS.primary} />
                        </MotionBox>
                        <VStack align="start" spacing={0}>
                            <Heading size={headingSize} color="#444444">
                                Informasi Profil
                            </Heading>
                            <Text fontSize={{ base: "xs", sm: "sm" }} color="#666666">
                                Kelola informasi akun dan data personal Anda
                            </Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Form Content */}
                <Box p={containerPadding} position="relative" zIndex={1}>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={8} align="stretch">
                            {/* Basic Information Section */}
                            <MotionBox
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                bg="rgba(255, 255, 255, 0.05)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(255, 255, 255, 0.1)"
                                borderRadius="16px"
                                p={6}
                            >
                                <VStack spacing={5} align="stretch">
                                    <HStack spacing={2} mb={2}>
                                        <User size={16} color={COLORS.primary} />
                                        <Text fontSize="lg" fontWeight="semibold" color="#444444">
                                            Informasi Dasar
                                        </Text>
                                    </HStack>

                                    <SimpleGrid columns={gridColumns} spacing={5}>
                                        {/* Full Name */}
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                                <HStack spacing={2}>
                                                    <User size={14} color="#999999" />
                                                    <Text>Nama Lengkap</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => handleChange('fullName', e.target.value)}
                                                placeholder="Masukkan nama lengkap"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                                minLength={2}
                                                maxLength={100}
                                            />
                                        </FormControl>

                                        {/* Email */}
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                                <HStack spacing={2}>
                                                    <Mail size={14} color="#999999" />
                                                    <Text>Email</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                placeholder="Masukkan email"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                            />
                                        </FormControl>

                                        {/* Phone Number */}
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                                <HStack spacing={2}>
                                                    <Phone size={14} color="#999999" />
                                                    <Text>Nomor Telepon</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                                placeholder="Masukkan nomor telepon"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                                minLength={10}
                                                maxLength={20}
                                            />
                                        </FormControl>

                                        {/* Borrower Type */}
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                                <HStack spacing={2}>
                                                    <Building size={14} color="#999999" />
                                                    <Text>Tipe Peminjam</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Select
                                                value={formData.borrowerType}
                                                onChange={(e) => handleChange('borrowerType', e.target.value)}
                                                placeholder="Pilih tipe peminjam"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                color="#444444"
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                            >
                                                {borrowerTypeOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </SimpleGrid>
                                </VStack>
                            </MotionBox>

                            {/* Bank Information Section */}
                            <MotionBox
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                bg="rgba(255, 255, 255, 0.05)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(255, 255, 255, 0.1)"
                                borderRadius="16px"
                                p={6}
                            >
                                <VStack spacing={5} align="stretch">
                                    <HStack spacing={2} mb={2}>
                                        <CreditCard size={16} color={COLORS.primary} />
                                        <Text fontSize="lg" fontWeight="semibold" color="#444444">
                                            Informasi Bank
                                        </Text>
                                    </HStack>

                                    <SimpleGrid columns={gridColumns} spacing={5}>
                                        {/* Bank Name */}
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                                <HStack spacing={2}>
                                                    <CreditCard size={14} color="#999999" />
                                                    <Text>Nama Bank</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                value={formData.bankName}
                                                onChange={(e) => handleChange('bankName', e.target.value)}
                                                placeholder="Masukkan nama bank"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                                minLength={2}
                                                maxLength={50}
                                            />
                                        </FormControl>

                                        {/* Bank Number */}
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm" color="#444444" fontWeight="semibold">
                                                <HStack spacing={2}>
                                                    <CreditCard size={14} color="#999999" />
                                                    <Text>Nomor Rekening</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                value={formData.bankNumber}
                                                onChange={(e) => handleChange('bankNumber', e.target.value)}
                                                placeholder="Masukkan nomor rekening"
                                                bg="rgba(255, 255, 255, 0.1)"
                                                backdropFilter="blur(8px)"
                                                border="1px solid rgba(255, 255, 255, 0.15)"
                                                borderRadius="12px"
                                                color="#444444"
                                                _placeholder={{ color: "#999999" }}
                                                _focus={{
                                                    borderColor: COLORS.primary,
                                                    boxShadow: `0 0 0 2px rgba(116, 156, 115, 0.2)`
                                                }}
                                                minLength={8}
                                                maxLength={20}
                                                pattern="[0-9]+"
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                </VStack>
                            </MotionBox>

                            {/* Account Status Section */}
                            {profile && (
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    bg="rgba(255, 255, 255, 0.05)"
                                    backdropFilter="blur(8px)"
                                    border="1px solid rgba(255, 255, 255, 0.1)"
                                    borderRadius="16px"
                                    p={6}
                                >
                                    <VStack spacing={4} align="stretch">
                                        <Text fontSize="lg" fontWeight="semibold" color="#444444">
                                            Status Akun
                                        </Text>

                                        <HStack spacing={3} wrap="wrap">
                                            {statusBadges.map((badge, index) => (
                                                <MotionBox
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                                >
                                                    <Badge
                                                        bg={badge.bg}
                                                        color={badge.textColor}
                                                        border="1px solid rgba(255, 255, 255, 0.1)"
                                                        borderRadius="8px"
                                                        px={3}
                                                        py={1}
                                                        fontSize="xs"
                                                        fontWeight="semibold"
                                                    >
                                                        {badge.label}
                                                    </Badge>
                                                </MotionBox>
                                            ))}
                                        </HStack>
                                    </VStack>
                                </MotionBox>
                            )}

                            {/* Changes Alert */}
                            {hasChanges && (
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    bg="rgba(59, 130, 246, 0.08)"
                                    backdropFilter="blur(8px)"
                                    border="1px solid rgba(59, 130, 246, 0.2)"
                                    borderRadius="12px"
                                    p={4}
                                >
                                    <HStack spacing={3}>
                                        <AlertIcon color="#3b82f6" boxSize={4} />
                                        <Text fontSize="sm" color="#1e40af">
                                            Ada perubahan yang belum disimpan. Klik "Simpan Perubahan" untuk menyimpan.
                                        </Text>
                                    </HStack>
                                </MotionBox>
                            )}

                            {/* Action Buttons */}
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                            >
                                <HStack spacing={3} justify="flex-end" flexWrap="wrap">
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        isDisabled={!hasChanges || updating}
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
                                        isLoading={updating}
                                        loadingText="Menyimpan..."
                                        isDisabled={!hasChanges}
                                        bg="rgba(116, 156, 115, 0.15)"
                                        color={COLORS.primary}
                                        border={`1px solid rgba(116, 156, 115, 0.3)`}
                                        borderRadius="10px"
                                        _hover={{
                                            bg: "rgba(116, 156, 115, 0.2)",
                                            borderColor: "rgba(116, 156, 115, 0.4)"
                                        }}
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        Simpan Perubahan
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

export default ProfileForm; 