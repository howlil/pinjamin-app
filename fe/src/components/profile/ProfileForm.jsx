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
    Card,
    CardHeader,
    CardBody,
    Heading,
    Badge
} from '@chakra-ui/react';
import { User, Mail, Phone, Building, CreditCard } from 'lucide-react';

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

    return (
        <Card>
            <CardHeader>
                <HStack spacing={3}>
                    <User size={24} color="var(--chakra-colors-primary-500)" />
                    <Heading size="md" color="gray.800">Informasi Profil</Heading>
                </HStack>
            </CardHeader>

            <CardBody>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        {/* Basic Information */}
                        <Box>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
                                Informasi Dasar
                            </Text>

                            <VStack spacing={4} align="stretch">
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color="gray.600">
                                        <HStack spacing={2}>
                                            <User size={16} />
                                            <Text>Nama Lengkap</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                        bg="white"
                                        borderRadius="full"
                                        minLength={2}
                                        maxLength={100}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color="gray.600">
                                        <HStack spacing={2}>
                                            <Mail size={16} />
                                            <Text>Email</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="Masukkan email"
                                        bg="white"
                                        borderRadius="full"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color="gray.600">
                                        <HStack spacing={2}>
                                            <Phone size={16} />
                                            <Text>Nomor Telepon</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                        placeholder="Masukkan nomor telepon"
                                        bg="white"
                                        borderRadius="full"
                                        minLength={10}
                                        maxLength={20}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color="gray.600">
                                        <HStack spacing={2}>
                                            <Building size={16} />
                                            <Text>Tipe Peminjam</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Select
                                        value={formData.borrowerType}
                                        onChange={(e) => handleChange('borrowerType', e.target.value)}
                                        placeholder="Pilih tipe peminjam"
                                        bg="white"
                                        borderRadius="full"
                                    >
                                        {borrowerTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </VStack>
                        </Box>

                        <Divider />

                        {/* Bank Information */}
                        <Box>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
                                Informasi Bank
                            </Text>

                            <VStack spacing={4} align="stretch">
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color="gray.600">
                                        <HStack spacing={2}>
                                            <CreditCard size={16} />
                                            <Text>Nama Bank</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        value={formData.bankName}
                                        onChange={(e) => handleChange('bankName', e.target.value)}
                                        placeholder="Masukkan nama bank"
                                        bg="white"
                                        borderRadius="full"
                                        minLength={2}
                                        maxLength={50}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color="gray.600">
                                        <HStack spacing={2}>
                                            <CreditCard size={16} />
                                            <Text>Nomor Rekening</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Input
                                        value={formData.bankNumber}
                                        onChange={(e) => handleChange('bankNumber', e.target.value)}
                                        placeholder="Masukkan nomor rekening"
                                        bg="white"
                                        borderRadius="full"
                                        minLength={8}
                                        maxLength={20}
                                        pattern="[0-9]+"
                                    />
                                </FormControl>
                            </VStack>
                        </Box>

                        {/* Profile Status */}
                        {profile && (
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
                                    Status Akun
                                </Text>

                                <HStack spacing={4} wrap="wrap">
                                    <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                                        Role: {profile.role}
                                    </Badge>
                                    <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                                        Status: Aktif
                                    </Badge>
                                    {profile.createdAt && (
                                        <Badge colorScheme="gray" variant="subtle" px={3} py={1}>
                                            Bergabung: {new Date(profile.createdAt).toLocaleDateString('id-ID')}
                                        </Badge>
                                    )}
                                </HStack>
                            </Box>
                        )}

                        {/* Action Buttons */}
                        <HStack spacing={4} justify="flex-end">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                isDisabled={!hasChanges || updating}
                                borderRadius="full"
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                colorScheme="primary"
                                isLoading={updating}
                                loadingText="Menyimpan..."
                                isDisabled={!hasChanges}
                                borderRadius="full"
                            >
                                Simpan Perubahan
                            </Button>
                        </HStack>

                        {hasChanges && (
                            <Alert status="info" borderRadius="lg">
                                <AlertIcon />
                                Ada perubahan yang belum disimpan. Klik "Simpan Perubahan" untuk menyimpan.
                            </Alert>
                        )}
                    </VStack>
                </form>
            </CardBody>
        </Card>
    );
};

export default ProfileForm; 