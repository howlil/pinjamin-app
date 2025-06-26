import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../shared/store/authStore';

const ProtectedRoute = ({ children, requiredRoles = [], redirectTo = '/login', allowedForAuthenticated = true }) => {
    const { isAuthenticated, token, user } = useAuthStore();
    const location = useLocation();
    const toast = useToast();

    if (!isAuthenticated || !token) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (!requiredRoles.length && allowedForAuthenticated) {
        return children;
    }

    // Check role authorization
    if (requiredRoles.length > 0) {
        const userRole = user?.role;
        const hasRequiredRole = requiredRoles.includes(userRole);

        if (!hasRequiredRole) {
            // Show unauthorized toast
            toast({
                title: "Akses Ditolak",
                description: "Anda tidak memiliki izin untuk mengakses halaman ini",
                status: "error",
                duration: 3000,
                isClosable: true,
            });

            // Redirect based on user role
            const defaultRedirect = userRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
            return <Navigate to={defaultRedirect} replace />;
        }
    }

    return children;
};

// Higher Order Component for specific role protection
export const withRoleProtection = (Component, requiredRoles = []) => {
    return (props) => (
        <ProtectedRoute requiredRoles={requiredRoles}>
            <Component {...props} />
        </ProtectedRoute>
    );
};

// Specific role-based route components
export const AdminProtectedRoute = ({ children }) => (
    <ProtectedRoute requiredRoles={['ADMIN']}>
        {children}
    </ProtectedRoute>
);

export const BorrowerProtectedRoute = ({ children }) => (
    <ProtectedRoute requiredRoles={['BORROWER']}>
        {children}
    </ProtectedRoute>
);

export const MultiRoleProtectedRoute = ({ children, roles = [] }) => (
    <ProtectedRoute requiredRoles={roles}>
        {children}
    </ProtectedRoute>
);

export default ProtectedRoute; 