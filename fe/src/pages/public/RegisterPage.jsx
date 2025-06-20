import React from 'react';
import AuthLayout from '@/components/Layout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginLink from '@/components/auth/LoginLink';
import { useRegister } from '@/hooks/useRegister';

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
        <AuthLayout
            title="Daftar"
            subtitle="Masukkan data pribadi Anda untuk mendaftar!"
            footer={<LoginLink />}
        >
            <RegisterForm
                formData={formData}
                showPassword={showPassword}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                togglePasswordVisibility={togglePasswordVisibility}
                handleSubmit={handleSubmit}
            />
        </AuthLayout>
    );
};

export default RegisterPage; 