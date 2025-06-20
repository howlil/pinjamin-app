import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        userType: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        // Required fields validation
        if (!formData.fullName) {
            throw new Error('Nama lengkap harus diisi');
        }
        if (!formData.userType) {
            throw new Error('Tipe pengguna harus dipilih');
        }
        if (!formData.email) {
            throw new Error('Email harus diisi');
        }
        if (!formData.password) {
            throw new Error('Password harus diisi');
        }

        // Password validation
        if (formData.password.length < 8) {
            throw new Error('Password harus minimal 8 karakter');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Format email tidak valid');
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate form
            validateForm();

            // In a real app, this would be an API call
            // const response = await apiService.post('/auth/register', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Pendaftaran berhasil!",
                description: "Akun Anda telah dibuat. Silakan login.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Redirect to login
            navigate('/login');
        } catch (error) {
            toast({
                title: "Pendaftaran gagal",
                description: error.message || "Terjadi kesalahan saat mendaftar",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        showPassword,
        isLoading,
        handleInputChange,
        togglePasswordVisibility,
        handleSubmit
    };
}; 