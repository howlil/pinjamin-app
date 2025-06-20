import { useState, useRef } from 'react';
import { useToast } from '@chakra-ui/react';

export const useBookingForm = (onClose) => {
    const [formData, setFormData] = useState({
        activityName: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        applicationLetter: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);
    const toast = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                applicationLetter: file
            }));
            setFileName(file.name);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const validateForm = () => {
        // Required fields validation
        if (!formData.activityName) {
            throw new Error('Nama kegiatan harus diisi');
        }
        if (!formData.startDate) {
            throw new Error('Tanggal mulai harus diisi');
        }
        if (!formData.startTime) {
            throw new Error('Jam mulai harus diisi');
        }
        if (!formData.endTime) {
            throw new Error('Jam selesai harus diisi');
        }
        if (!formData.applicationLetter) {
            throw new Error('Surat pengajuan harus diunggah');
        }

        // Date and time validation
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        if (isNaN(startDateTime.getTime())) {
            throw new Error('Tanggal atau jam mulai tidak valid');
        }

        const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
        if (isNaN(endDateTime.getTime())) {
            throw new Error('Tanggal atau jam selesai tidak valid');
        }

        if (endDateTime <= startDateTime) {
            throw new Error('Jam selesai harus setelah jam mulai');
        }

        // If endDate is provided, validate it
        if (formData.endDate) {
            const endDate = new Date(formData.endDate);
            const startDate = new Date(formData.startDate);

            if (endDate < startDate) {
                throw new Error('Tanggal selesai harus setelah tanggal mulai');
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate form
            validateForm();

            // In a real app, this would be an API call
            // const formDataToSend = new FormData();
            // Object.entries(formData).forEach(([key, value]) => {
            //   formDataToSend.append(key, value);
            // });
            // await apiService.post('/bookings', formDataToSend);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Pengajuan Berhasil",
                description: "Pengajuan peminjaman ruangan sedang diproses",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onClose && onClose();
            resetForm();
        } catch (error) {
            toast({
                title: "Pengajuan Gagal",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            activityName: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            applicationLetter: null
        });
        setFileName('');
    };

    return {
        formData,
        fileName,
        fileInputRef,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        triggerFileInput,
        handleSubmit,
        resetForm
    };
}; 