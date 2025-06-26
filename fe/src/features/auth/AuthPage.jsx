import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toast = useToast();

    const handleToggle = () => {
        // Dismiss semua toast yang aktif
        toast.closeAll();

        // Toggle form
        setIsLogin(!isLogin);
    };

    // Clear toast ketika component mount
    useEffect(() => {
        toast.closeAll();
    }, [toast]);

    if (isLogin) {
        return <LoginForm onToggle={handleToggle} />;
    } else {
        return <RegisterForm onToggle={handleToggle} />;
    }
};

export default AuthPage; 