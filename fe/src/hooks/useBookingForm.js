import { useState, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { bookingApi } from '@/services/apiService';

export const useBookingForm = (onClose, buildingId) => {
    const [formData, setFormData] = useState({
        activityName: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        proposalLetter: null
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

            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "File Tidak Valid",
                    description: "Hanya file PDF, DOC, dan DOCX yang diperbolehkan",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast({
                    title: "File Terlalu Besar",
                    description: "Ukuran file tidak boleh melebihi 5MB",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            setFormData(prev => ({
                ...prev,
                proposalLetter: file
            }));
            setFileName(file.name);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const validateForm = () => {
        // Required fields validation
        if (!buildingId) {
            throw new Error('Building ID tidak ditemukan');
        }
        if (!formData.activityName || formData.activityName.trim().length < 3) {
            throw new Error('Nama kegiatan harus diisi minimal 3 karakter');
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
        if (!formData.proposalLetter) {
            throw new Error('Surat pengajuan harus diunggah');
        }

        // Date and time validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(formData.startDate);
        if (startDate < today) {
            throw new Error('Tanggal mulai tidak boleh di masa lalu');
        }

        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            throw new Error('Format tanggal atau jam tidak valid');
        }

        if (endDateTime <= startDateTime) {
            throw new Error('Jam selesai harus setelah jam mulai');
        }

        // If endDate is provided, validate it
        if (formData.endDate) {
            const endDate = new Date(formData.endDate);
            const startDateOnly = new Date(formData.startDate);

            if (endDate < startDateOnly) {
                throw new Error('Tanggal selesai harus setelah tanggal mulai');
            }
        }

        return true;
    };

    const formatDateForAPI = (dateString) => {
        // Convert from YYYY-MM-DD to DD-MM-YYYY format required by API
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate form
            validateForm();

            // Prepare booking data
            const bookingData = {
                buildingId: buildingId,
                activityName: formData.activityName.trim(),
                startDate: formatDateForAPI(formData.startDate),
                startTime: formData.startTime,
                endTime: formData.endTime,
                proposalLetter: formData.proposalLetter
            };

            // Add endDate if provided
            if (formData.endDate) {
                bookingData.endDate = formatDateForAPI(formData.endDate);
            }

            console.log('Submitting booking data:', bookingData);

            // Call API to create booking
            const response = await bookingApi.createBooking(bookingData);

            if (response.status === 'success') {
                toast({
                    title: "Booking Berhasil Dibuat",
                    description: "Anda akan diarahkan ke halaman pembayaran",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // Close modal first
                onClose && onClose();
                resetForm();

                // Redirect to payment URL if available
                if (response.data?.payment?.paymentUrl) {
                    // Small delay to let toast show
                    setTimeout(() => {
                        window.open(response.data.payment.paymentUrl, '_blank');
                    }, 1000);
                } else {
                    console.warn('Payment URL not found in response:', response.data);
                    toast({
                        title: "Booking Berhasil",
                        description: "Booking berhasil dibuat, silakan cek riwayat peminjaman untuk melakukan pembayaran",
                        status: "info",
                        duration: 7000,
                        isClosable: true,
                    });
                }
            } else {
                throw new Error(response.message || 'Gagal membuat booking');
            }

        } catch (error) {
            console.error('Booking submission error:', error);

            let errorMessage = 'Terjadi kesalahan saat membuat booking';

            if (error.message) {
                errorMessage = error.message;
            } else if (error.data?.message) {
                if (Array.isArray(error.data.message)) {
                    errorMessage = error.data.message.join(', ');
                } else {
                    errorMessage = error.data.message;
                }
            }

            toast({
                title: "Booking Gagal",
                description: errorMessage,
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
            proposalLetter: null
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