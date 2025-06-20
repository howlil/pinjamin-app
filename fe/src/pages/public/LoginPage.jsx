import React from 'react';
import AuthLayout from '@/components/Layout/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterLink from '@/components/auth/RegisterLink';
import { useLogin } from '@/hooks/useLogin';

const LoginPage = () => {
    const {
        formData,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility
    } = useLogin();

    return (
        <AuthLayout
            title="Universitas Andalas"
            subtitle="Sistem Peminjaman Ruangan"
            footer={<RegisterLink />}
        >
            <LoginForm
                formData={formData}
                showPassword={showPassword}
                isLoading={isLoading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                togglePasswordVisibility={togglePasswordVisibility}
            />
        </AuthLayout>
    );
};

export default LoginPage;
