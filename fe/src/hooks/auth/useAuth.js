import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@/utils/store';
import { authApi } from '@/services/auth/authService';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login: storeLogin, logout: storeLogout, user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const toast = useToast();

    const login = async (credentials) => {
        setIsLoading(true);
        try {
            if (!credentials.email || !credentials.password) {
                throw new Error('Mohon lengkapi semua field');
            }

            // Call the actual API
            const response = await authApi.login(credentials);

            // Check if response is successful
            if (response.status !== 'success') {
                throw new Error(response.message || 'Login gagal');
            }

            // Extract user data and token from response
            const { token, user } = response.data;

            // Store user data and token
            storeLogin(user, token);

            // Determine redirect path based on role
            const redirectPath = user.role === 'ADMIN' ? '/admin' : '/';

            toast({
                title: "Login Berhasil",
                description: `Selamat datang, ${user.fullName}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            navigate(redirectPath);
            return true;
        } catch (error) {
            toast({
                title: "Login Gagal",
                description: error.message || 'Terjadi kesalahan saat login',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        try {
            // Validate required fields
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error('Mohon lengkapi semua field yang wajib diisi');
            }

            // Validate password
            if (userData.password.length < 6) {
                throw new Error('Password harus minimal 6 karakter');
            }

            // In a real app, this would be an API call
            // const response = await authApi.register(userData);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            toast({
                title: "Registrasi Berhasil",
                description: "Silakan login dengan akun yang telah dibuat",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            navigate('/login');
            return true;
        } catch (error) {
            toast({
                title: "Registrasi Gagal",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        storeLogout();
        toast({
            title: "Logout Berhasil",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
        navigate('/login');
    };

    // Role checking utilities
    const hasRole = (requiredRole) => {
        if (!isAuthenticated || !user) return false;
        return user.role === requiredRole;
    };

    const hasAnyRole = (requiredRoles = []) => {
        if (!isAuthenticated || !user) return false;
        return requiredRoles.includes(user.role);
    };

    const isAdmin = () => hasRole('ADMIN');
    const isBorrower = () => hasRole('BORROWER');
    const isUser = () => hasRole('BORROWER'); // Legacy alias untuk kompatibilitas

    // Permission checking
    const canAccess = (resource, action = 'read') => {
        if (!isAuthenticated || !user) return false;

        const role = user.role;

        // Define permissions based on role
        const permissions = {
            'ADMIN': {
                // Admin can access everything
                '*': ['*']
            },
            'BORROWER': {
                'profile': ['read', 'update'],
                'bookings': ['read', 'create', 'update'],
                'transactions': ['read'],
                'history': ['read'],
                'settings': ['read', 'update']
            }
        };

        const rolePermissions = permissions[role];
        if (!rolePermissions) return false;

        // Admin has access to everything
        if (rolePermissions['*'] && rolePermissions['*'].includes('*')) {
            return true;
        }

        // Check specific resource permissions
        const resourcePermissions = rolePermissions[resource];
        if (!resourcePermissions) return false;

        return resourcePermissions.includes(action) || resourcePermissions.includes('*');
    };

    // Redirect to appropriate dashboard based on role
    const redirectToDashboard = () => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        const redirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
        navigate(redirectPath);
    };

    return {
        login,
        register,
        logout,
        isLoading,
        user,
        isAuthenticated,
        // Role checking utilities
        hasRole,
        hasAnyRole,
        isAdmin,
        isBorrower,
        isUser,
        canAccess,
        redirectToDashboard
    };
};

// Separate hook specifically for role checking (can be used independently)
export const useRole = () => {
    const { user, isAuthenticated } = useAuthStore();

    const hasRole = (requiredRole) => {
        if (!isAuthenticated || !user) return false;
        return user.role === requiredRole;
    };

    const hasAnyRole = (requiredRoles = []) => {
        if (!isAuthenticated || !user) return false;
        return requiredRoles.includes(user.role);
    };

    const isAdmin = () => hasRole('ADMIN');
    const isBorrower = () => hasRole('BORROWER');
    const isUser = () => hasRole('BORROWER'); // Legacy alias

    const getUserRole = () => user?.role || null;

    return {
        hasRole,
        hasAnyRole,
        isAdmin,
        isBorrower,
        isUser,
        getUserRole,
        currentRole: user?.role
    };
}; 