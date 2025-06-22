import { useState } from 'react';
import { useAuth } from './useAuth';

export const useLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return {
        formData,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility
    };
}; 