import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { authAPI } from './authAPI';
import { useAuthStore } from '@/shared/store/authStore';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        login: storeLogin,
        logout: storeLogout,
        setLoading,
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
    const toast = useToast();

    const login = async (credentials) => {
        setIsLoading(true);
        setLoading(true);

        try {
            if (!credentials.email || !credentials.password) {
                throw new Error('Mohon lengkapi semua field');
            }

            const response = await authAPI.login(credentials);

            if (response.status !== 'success') {
                throw new Error(response.message || 'Login gagal');
            }

            const { token, user } = response.data;
            storeLogin(user, token);

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
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        setLoading(true);

        try {
            if (!userData.fullName || !userData.email || !userData.password) {
                throw new Error('Mohon lengkapi semua field yang wajib diisi');
            }

            if (userData.password.length < 8) {
                throw new Error('Password harus minimal 8 karakter');
            }

            const response = await authAPI.register(userData);

            if (response.status !== 'success') {
                throw new Error(response.message || 'Registrasi gagal');
            }

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
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        }

        storeLogout();
        toast({
            title: "Logout Berhasil",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
        navigate('/login');
    };

    const getProfile = async () => {
        try {
            setIsLoading(true);
            const response = await authAPI.getProfile();

            if (response.status === 'success') {
                updateUser(response.data);
                return response.data;
            }
        } catch (error) {
            toast({
                title: "Gagal Memuat Profile",
                description: error.message || 'Terjadi kesalahan saat memuat profile',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setIsLoading(true);
            const response = await authAPI.updateProfile(profileData);

            if (response.status === 'success') {
                updateUser(response.data);
                toast({
                    title: "Profile Berhasil Diperbarui",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                return true;
            }
        } catch (error) {
            toast({
                title: "Gagal Memperbarui Profile",
                description: error.message || 'Terjadi kesalahan saat memperbarui profile',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (passwordData) => {
        try {
            setIsLoading(true);
            const response = await authAPI.changePassword(passwordData);

            if (response.status === 'success') {
                toast({
                    title: "Password Berhasil Diubah",
                    description: "Password Anda telah berhasil diperbarui",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                return true;
            }
        } catch (error) {
            toast({
                title: "Gagal Mengubah Password",
                description: error.message || 'Terjadi kesalahan saat mengubah password',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        try {
            setIsLoading(true);
            const response = await authAPI.forgotPassword(email);

            if (response.status === 'success') {
                toast({
                    title: "Email Reset Password Terkirim",
                    description: "Silakan cek email Anda untuk instruksi reset password",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                return true;
            }
        } catch (error) {
            toast({
                title: "Gagal Mengirim Email Reset",
                description: error.message || 'Terjadi kesalahan saat mengirim email reset',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (resetData) => {
        try {
            setIsLoading(true);
            const response = await authAPI.resetPassword(resetData);

            if (response.status === 'success') {
                toast({
                    title: "Password Berhasil Direset",
                    description: "Silakan login dengan password baru Anda",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/login');
                return true;
            }
        } catch (error) {
            toast({
                title: "Gagal Reset Password",
                description: error.message || 'Terjadi kesalahan saat reset password',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        } finally {
            setIsLoading(false);
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
        isLoading,
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
    const { login, isLoading } = useAuth();
    const toast = useToast();

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
        toast.closeAll();
    };

    // Reset form ketika component mount
    useEffect(() => {
        resetForm();
    }, []);

    return {
        formData,
        showPassword,
        isLoading,
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
    const { register, isLoading } = useAuth();
    const toast = useToast();

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
        toast.closeAll();
    };

    // Reset form ketika component mount
    useEffect(() => {
        resetForm();
    }, []);

    return {
        formData,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        resetForm
    };
};

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword, isLoading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
    };

    return {
        email,
        setEmail,
        isLoading,
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
    const { resetPassword, isLoading } = useAuth();
    const toast = useToast();

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
            toast({
                title: "Password Tidak Cocok",
                description: "Konfirmasi password harus sama dengan password baru",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
        isLoading,
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
    const { changePassword, isLoading } = useAuth();
    const toast = useToast();

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
            toast({
                title: "Password Tidak Cocok",
                description: "Konfirmasi password harus sama dengan password baru",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
        isLoading,
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
    const { updateProfile, getProfile, isLoading, user } = useAuth();

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
        isLoading,
        handleChange,
        handleSubmit,
        loadProfile
    };
}; 