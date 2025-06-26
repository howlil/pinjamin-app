import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/shared/store/authStore';
import { authAPI } from './authAPI';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
        login: storeLogin,
        logout: storeLogout,
        setLoading: setAuthLoading,
        updateUser,
        user,
        isAuthenticated,
        hasRole,
        hasAnyRole,
        isAdmin,
        isBorrower,
        checkAuth
    } = useAuthStore();

    const navigate = useNavigate();

    const login = async (credentials) => {
        setLoading(true);
        setAuthLoading(true);
        setError(null);

        try {
            if (!credentials.email || !credentials.password) {
                throw new Error('Mohon lengkapi semua field');
            }

            const response = await authAPI.login(credentials);

            if (response.status === 'success') {
                const { user, token } = response.data;

                // Set auth state
                storeLogin(user, token);

                // Navigate based on user role
                const redirectPath = user.role === 'ADMIN' ? '/admin' : '/';

                toast.success(`Selamat datang, ${user.fullName}!`);
                navigate(redirectPath);

                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal');
            throw err;
        } finally {
            setLoading(false);
            setAuthLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setAuthLoading(true);
        setError(null);

        try {
            if (!userData.fullName || !userData.email || !userData.password) {
                throw new Error('Mohon lengkapi semua field yang wajib diisi');
            }

            if (userData.password.length < 8) {
                throw new Error('Password harus minimal 8 karakter');
            }

            const response = await authAPI.register(userData);

            if (response.status === 'success') {
                toast.success('Registrasi berhasil! Silakan login.');
                navigate('/login');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal');
            throw err;
        } finally {
            setLoading(false);
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        }

        storeLogout();
        toast.success('Berhasil logout');
        navigate('/login');
    };

    const getProfile = async () => {
        try {
            setLoading(true);
            const response = await authAPI.getProfile();

            if (response.status === 'success') {
                updateUser(response.data);
                return response.data;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat memuat profile');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.updateProfile(profileData);

            if (response.status === 'success') {
                // Update auth state with new user data
                updateUser(response.data);
                toast.success('Profil berhasil diperbarui');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui profil');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (passwordData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.changePassword(passwordData);

            if (response.status === 'success') {
                toast.success('Password berhasil diubah');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengubah password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.forgotPassword(email);

            if (response.status === 'success') {
                toast.success('Email reset password telah dikirim. Silakan cek email Anda.');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim email reset password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (resetData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.resetPassword(resetData);

            if (response.status === 'success') {
                toast.success('Password berhasil direset. Silakan login.');
                navigate('/login');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal reset password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const canAccess = (resource, action = 'read') => {
        if (!isAuthenticated || !user) return false;

        const permissions = {
            ADMIN: ['*'],
            BORROWER: ['bookings:create', 'bookings:read', 'buildings:read'],
        };

        const userPermissions = permissions[user.role] || [];
        return userPermissions.includes('*') || userPermissions.includes(`${resource}:${action}`);
    };

    const redirectToDashboard = () => {
        const redirectPath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
        navigate(redirectPath);
    };

    return {
        login,
        register,
        logout,
        getProfile,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        loading,
        error,
        user,
        isAuthenticated,
        hasRole,
        hasAnyRole,
        isAdmin,
        isBorrower,
        canAccess,
        redirectToDashboard,
        checkAuth
    };
};

export const useRole = () => {
    const { user, isAuthenticated, hasRole, hasAnyRole, isAdmin, isBorrower } = useAuthStore();

    const isUser = () => hasRole('BORROWER');
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

export const useLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: ''
        });
        setShowPassword(false);
    };

    // Reset form ketika component mount
    useEffect(() => {
        resetForm();
    }, []);

    return {
        formData,
        showPassword,
        loading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        resetForm
    };
};

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
    const { register, loading } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            password: '',
            borrowerType: '',
            phoneNumber: '',
            bankName: '',
            bankNumber: ''
        });
        setShowPassword(false);
    };

    // Reset form ketika component mount
    useEffect(() => {
        resetForm();
    }, []);

    return {
        formData,
        showPassword,
        loading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        resetForm
    };
};

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
    };

    return {
        email,
        setEmail,
        loading,
        handleSubmit
    };
};

export const useResetPassword = () => {
    const [formData, setFormData] = useState({
        token: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { resetPassword, loading } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Konfirmasi password harus sama dengan password baru');
            return;
        }
        await resetPassword(formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return {
        formData,
        showPassword,
        loading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility
    };
};

export const useChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const { changePassword, loading } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Konfirmasi password harus sama dengan password baru');
            return;
        }
        await changePassword(formData);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return {
        formData,
        showPasswords,
        loading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility
    };
};

export const useUpdateProfile = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        borrowerType: '',
        bankName: '',
        bankNumber: ''
    });
    const { updateProfile, getProfile, loading, user } = useAuth();

    const loadProfile = async () => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                borrowerType: user.borrowerType || '',
                bankName: user.bankName || '',
                bankNumber: user.bankNumber || ''
            });
        } else {
            await getProfile();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(formData);
    };

    return {
        formData,
        loading,
        handleChange,
        handleSubmit,
        loadProfile
    };
}; 