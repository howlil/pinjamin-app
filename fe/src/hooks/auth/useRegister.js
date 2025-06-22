import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { authApi } from '@/services/auth/authService';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        borrowerType: '',
        phoneNumber: '',
        bankName: '',
        bankNumber: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Format specific inputs
        let formattedValue = value;

        if (name === 'phoneNumber') {
            // Format phone number - only allow numbers and +
            formattedValue = value.replace(/[^\d+]/g, '');
            // Ensure it starts with +62 if user types 0
            if (formattedValue.startsWith('0')) {
                formattedValue = '+62' + formattedValue.substring(1);
            }
        } else if (name === 'bankNumber') {
            // Format bank number - only allow numbers
            formattedValue = value.replace(/\D/g, '');
        } else if (name === 'fullName') {
            // Format name - capitalize each word and remove extra spaces
            formattedValue = value.replace(/\s+/g, ' ');
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        // Required fields validation - sesuai dengan schema RegisterRequest
        if (!formData.fullName.trim()) {
            throw new Error('Nama lengkap harus diisi');
        }
        if (formData.fullName.trim().length < 3 || formData.fullName.trim().length > 100) {
            throw new Error('Nama lengkap harus 3-100 karakter');
        }

        if (!formData.email.trim()) {
            throw new Error('Email harus diisi');
        }

        if (!formData.password) {
            throw new Error('Password harus diisi');
        }

        if (!formData.borrowerType) {
            throw new Error('Tipe peminjam harus dipilih');
        }

        if (!formData.phoneNumber.trim()) {
            throw new Error('Nomor telepon harus diisi');
        }

        if (!formData.bankName) {
            throw new Error('Bank harus dipilih');
        }

        if (!formData.bankNumber.trim()) {
            throw new Error('Nomor rekening harus diisi');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Format email tidak valid');
        }

        // Password validation - sesuai dengan swagger (minimal 8 karakter)
        if (formData.password.length < 8) {
            throw new Error('Password harus minimal 8 karakter');
        }

        // BorrowerType validation - sesuai dengan enum di swagger
        const validBorrowerTypes = ['INTERNAL_UNAND', 'EXTERNAL_UNAND'];
        if (!validBorrowerTypes.includes(formData.borrowerType)) {
            throw new Error('Tipe peminjam tidak valid');
        }

        // Phone number validation
        const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;
        if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
            throw new Error('Format nomor telepon tidak valid (contoh: +62812345678)');
        }

        // Bank account validation - sesuai dengan swagger (8-20 digit)
        const bankNumberRegex = /^[0-9]{8,20}$/;
        if (!bankNumberRegex.test(formData.bankNumber)) {
            throw new Error('Nomor rekening harus berupa angka 8-20 digit');
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate form
            validateForm();

            // Prepare data for API - sesuai dengan RegisterRequest schema
            const registrationData = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                borrowerType: formData.borrowerType,
                phoneNumber: formData.phoneNumber.trim(),
                bankName: formData.bankName,
                bankNumber: formData.bankNumber.trim()
            };

            console.log('Sending registration data:', registrationData);

            // Call the registration API
            const response = await authApi.register(registrationData);

            // Check response status
            if (response.status === 'success') {
                toast({
                    title: "Pendaftaran berhasil!",
                    description: response.message || "Akun Anda telah dibuat. Silakan login.",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                });

                // Redirect to login
                navigate('/login');
            } else {
                throw new Error(response.message || 'Pendaftaran gagal');
            }
        } catch (error) {
            // Handle different types of errors
            let errorMessage = "Terjadi kesalahan saat mendaftar";

            if (error.status === 400) {
                errorMessage = error.data?.message || "Data yang dikirim tidak valid";
            } else if (error.status === 409) {
                errorMessage = "Email sudah terdaftar. Silakan gunakan email lain.";
            } else if (error.message) {
                errorMessage = error.message;
            }

            console.error('Registration error:', error);

            toast({
                title: "Pendaftaran gagal",
                description: errorMessage,
                status: "error",
                duration: 4000,
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