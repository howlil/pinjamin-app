import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth/api/useAuth';
import Layout from './Layout';

const PrivateLayout = ({ children, allowedRoles = ['BORROWER'] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Debug logging
    console.log('PrivateLayout Debug:', {
        user,
        loading,
        allowedRoles,
        userRole: user?.role,
        pathname: location.pathname
    });

    // Tampilkan loading state
    if (loading) {
        return (
            <Layout>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="calc(100vh - 70px)"
                >
                    Loading...
                </Box>
            </Layout>
        );
    }

    // Redirect ke auth jika belum login
    if (!user) {
        console.log('User not found, redirecting to auth');
        return (
            <Navigate
                to="/auth"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Check role jika diperlukan
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('Access denied - user role not allowed:', {
            userRole: user.role,
            allowedRoles
        });
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <Layout>
            {children}
        </Layout>
    );
};

export default PrivateLayout; 