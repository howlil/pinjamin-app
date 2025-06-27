import { Box } from '@chakra-ui/react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/api/useAuth';

const PrivateAdminLayout = ({ children, allowedRoles = ['ADMIN'] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();



    // Tampilkan loading state
    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100vh"
                bg="rgba(248, 250, 252, 0.8)"
            >
                <Box fontSize="lg" fontWeight="600" fontFamily="Inter, sans-serif">
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

    // Return children only (authentication wrapper)
    return children;
};

export default PrivateAdminLayout; 