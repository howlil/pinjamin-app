import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { userApi } from '@/services/apiService';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();

    // Get user profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await userApi.getProfile();
            console.log('Profile response:', response);

            if (response.status === 'success') {
                setProfile(response.data);
            } else {
                throw new Error(response.message || 'Gagal mengambil data profil');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Gagal mengambil data profil';
            setError(errorMessage);

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            setUpdating(true);
            setError(null);

            console.log('Updating profile with:', profileData);

            const response = await userApi.updateProfile(profileData);
            console.log('Update profile response:', response);

            if (response.status === 'success') {
                setProfile(response.data);

                toast({
                    title: 'Berhasil',
                    description: 'Profil berhasil diperbarui',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                return true;
            } else {
                throw new Error(response.message || 'Gagal memperbarui profil');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Gagal memperbarui profil';
            setError(errorMessage);

            // Handle validation errors
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');

                toast({
                    title: 'Validasi Error',
                    description: errorMessages,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error',
                    description: errorMessage,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }

            return false;
        } finally {
            setUpdating(false);
        }
    };

    // Change password
    const changePassword = async (passwordData) => {
        try {
            setChangingPassword(true);
            setError(null);

            console.log('Changing password');

            // Validate passwords match
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                throw new Error('Password baru dan konfirmasi password tidak cocok');
            }

            const payload = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            };

            const response = await userApi.changePassword(payload);
            console.log('Change password response:', response);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Password berhasil diubah',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                return true;
            } else {
                throw new Error(response.message || 'Gagal mengubah password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Gagal mengubah password';
            setError(errorMessage);

            // Handle validation errors
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');

                toast({
                    title: 'Validasi Error',
                    description: errorMessages,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error',
                    description: errorMessage,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }

            return false;
        } finally {
            setChangingPassword(false);
        }
    };

    // Reset error
    const clearError = () => {
        setError(null);
    };

    // Load profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        updating,
        changingPassword,
        error,
        fetchProfile,
        updateProfile,
        changePassword,
        clearError
    };
}; 