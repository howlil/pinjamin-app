import React from 'react';
import {
    VStack,
    Heading,
    InputRightElement,
    IconButton
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { GlassInput, PrimaryButton } from '@/components/ui';
import { COLORS } from '@/utils/designTokens';

const LoginForm = ({
    formData,
    showPassword,
    isLoading,
    handleChange,
    handleSubmit,
    togglePasswordVisibility
}) => {
    return (
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading size="lg" color={COLORS.black} alignSelf="start">
                Masuk
            </Heading>

            <GlassInput
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email anda"
                isRequired
            />

            <GlassInput
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password anda"
                isRequired
                rightElement={
                    <InputRightElement>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            onClick={togglePasswordVisibility}
                            icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            color="gray.500"
                            bg="transparent"
                        />
                    </InputRightElement>
                }
            />

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
    );
};

export default LoginForm; 