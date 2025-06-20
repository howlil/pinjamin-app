import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

export const useSettings = () => {
    const toast = useToast();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        reminderDays: 2,
        autoRenew: false
    });

    const handleToggle = (field) => {
        setSettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = () => {
        // In a real app, this would be an API call
        // const response = await apiService.post('/user/settings', settings);

        toast({
            title: 'Pengaturan disimpan',
            description: 'Preferensi Anda telah berhasil disimpan.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleCancel = () => {
        // Reset to default values or fetch from API
        setSettings({
            emailNotifications: true,
            smsNotifications: false,
            reminderDays: 2,
            autoRenew: false
        });
    };

    return {
        settings,
        handleToggle,
        handleSave,
        handleCancel
    };
}; 