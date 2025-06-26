import React from 'react';
import { Box } from '@chakra-ui/react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/api/useAuth';

const PrivateAdminLayout = ({ children, allowedRoles = ['ADMIN'] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Debug logging
    console.log('PrivateAdminLayout Debug:', {
        user,
        loading,
        allowedRoles,
        userRole: user?.role,
        pathname: location.pathname
    });

    // Tampilkan loading state tanpa navbar
    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100vh"
                bg="rgba(248, 250, 252, 0.8)"
            >
                <Box fontSize="lg" fontWeight="600">
                    Loading...
                </Box>
            </Box>
        );
    }

    // Redirect ke auth jika belum login
    if (!user) {
        console.log('Admin user not found, redirecting to auth');
        return (
            <Navigate
                to="/auth"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Check role admin
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('Access denied - admin role required:', {
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

    // Return children tanpa Layout wrapper (no navbar)
    return children;
};

export default PrivateAdminLayout; 