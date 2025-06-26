import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Select } from '@chakra-ui/react';
import Input from '@shared/components/Input';
import Button, { PrimaryButton } from '@shared/components/Button';
import { H3, Text as CustomText } from '@shared/components/Typography';
import Card from '@shared/components/Card';
import FormField from '@shared/components/FormField';
import { useUpdateProfile } from '../api/useAuth';
import { validateUpdateProfile } from '../api/authValidation';
import { COLORS } from '@utils/designTokens';

export const ProfileForm = () => {
    const { formData, isLoading, handleChange, handleSubmit, loadProfile } = useUpdateProfile();
    const [errors, setErrors] = useState({});

    // Create SecondaryButton alias
    const SecondaryButton = (props) => <Button variant="outline" {...props} />;

    useEffect(() => {
        loadProfile();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const validation = validateUpdateProfile(formData);
        setErrors(validation.errors);

        if (validation.isValid) {
            handleSubmit(e);
        }
    };

    const handleReset = () => {
        loadProfile();
        setErrors({});
    };

    return (
        <Card variant="glassmorphism" padding={8}>
            <VStack spacing={6} align="stretch">
                <VStack spacing={2} align="start">
                    <H3 color={COLORS.text} fontSize="xl" fontWeight="700">
                        Profile Saya
                    </H3>
                    <CustomText color={COLORS.text} fontSize="sm" opacity={0.7}>
                        Kelola informasi profile dan data bank Anda
                    </CustomText>
                </VStack>

                <VStack as="form" onSubmit={onSubmit} spacing={5} align="stretch">
                    <FormField
                        label="Nama Lengkap"
                        isRequired
                        error={errors.fullName}
                    >
                        <Input
                            type="text"
                            variant="glassmorphism"
                            placeholder="Nama lengkap"
                            name="fullName"
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
                            type="email"
                            variant="glassmorphism"
                            placeholder="ul@unand.id"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </FormField>

                    <FormField
                        label="Nomor Telepon"
                        isRequired
                        error={errors.phoneNumber}
                    >
                        <Input
                            type="tel"
                            variant="glassmorphism"
                            placeholder="+62812345678"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </FormField>

                    <FormField
                        label="Tipe Peminjam"
                        isRequired
                        error={errors.borrowerType}
                    >
                        <Select
                            name="borrowerType"
                            value={formData.borrowerType}
                            onChange={handleChange}
                            placeholder="Pilih tipe peminjam"
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
                        label="Nama Bank"
                        isRequired
                        error={errors.bankName}
                    >
                        <Input
                            type="text"
                            variant="glassmorphism"
                            placeholder="Bank BCA"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                        />
                    </FormField>

                    <FormField
                        label="Nomor Rekening"
                        isRequired
                        error={errors.bankNumber}
                    >
                        <Input
                            type="text"
                            variant="glassmorphism"
                            placeholder="1234567890"
                            name="bankNumber"
                            value={formData.bankNumber}
                            onChange={handleChange}
                        />
                    </FormField>

                    <HStack spacing={3} justify="flex-end" pt={4}>
                        <SecondaryButton
                            type="button"
                            onClick={handleReset}
                            h="48px"
                            px={6}
                        >
                            Reset
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            isLoading={isLoading}
                            loadingText="Menyimpan..."
                            h="48px"
                            px={6}
                            disabled={Object.keys(errors).length > 0}
                        >
                            Simpan Perubahan
                        </PrimaryButton>
                    </HStack>
                </VStack>
            </VStack>
        </Card>
    );
}; 