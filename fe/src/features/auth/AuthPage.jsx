import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleToggle = () => {
        // Dismiss semua toast yang aktif
        toast.dismiss();

        // Toggle form
        setIsLogin(!isLogin);
    };

    // Clear toast ketika component mount
    useEffect(() => {
        toast.dismiss();
    }, []);

    if (isLogin) {
        return <LoginForm onToggle={handleToggle} />;
    } else {
        return <RegisterForm onToggle={handleToggle} />;
    }
};

export default AuthPage; 