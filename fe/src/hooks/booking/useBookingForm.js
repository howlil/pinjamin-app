import { useState, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { bookingApi } from '@/services/booking/bookingService';

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
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: 'Error',
                    description: 'File terlalu besar. Maksimal 5MB.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
                return;
            }

            // Check file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: 'Error',
                    description: 'Format file tidak didukung. Gunakan PDF, DOC, atau DOCX.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
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
        // Check if buildingId is available
        if (!buildingId) {
            throw new Error('Building ID tidak ditemukan. Silakan refresh halaman dan coba lagi.');
        }

        // Validate required fields
        if (!formData.activityName.trim()) {
            throw new Error('Nama kegiatan harus diisi');
        }

        if (!formData.startDate) {
            throw new Error('Tanggal mulai kegiatan harus diisi');
        }

        if (!formData.startTime) {
            throw new Error('Jam mulai kegiatan harus diisi');
        }

        if (!formData.endTime) {
            throw new Error('Jam selesai kegiatan harus diisi');
        }

        if (!formData.proposalLetter) {
            throw new Error('Surat pengajuan harus diupload');
        }

        // Validate date logic
        const startDate = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            throw new Error('Tanggal mulai tidak boleh di masa lalu');
        }

        // Validate end date if provided
        if (formData.endDate) {
            const endDate = new Date(formData.endDate);
            if (endDate < startDate) {
                throw new Error('Tanggal selesai tidak boleh lebih awal dari tanggal mulai');
            }
        }

        // Validate time logic
        const [startHour, startMinute] = formData.startTime.split(':').map(Number);
        const [endHour, endMinute] = formData.endTime.split(':').map(Number);

        const startTimeMinutes = startHour * 60 + startMinute;
        const endTimeMinutes = endHour * 60 + endMinute;

        if (endTimeMinutes <= startTimeMinutes) {
            throw new Error('Jam selesai harus lebih lambat dari jam mulai');
        }

        return true;
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
        setIsSubmitting(false);
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

        // Early return if no buildingId
        if (!buildingId) {
            toast({
                title: 'Error',
                description: 'Building ID tidak ditemukan. Silakan refresh halaman dan coba lagi.',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
            return;
        }

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

            console.log('Submitting booking data:', {
                ...bookingData,
                proposalLetter: bookingData.proposalLetter ? `File: ${bookingData.proposalLetter.name}` : null
            });

            // Call API to create booking
            const response = await bookingApi.createBooking(bookingData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil!',
                    description: 'Peminjaman berhasil diajukan. Silakan lakukan pembayaran.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });

                // Reset form
                resetForm();

                // Close modal
                if (onClose) {
                    onClose();
                }

                // Optional: Redirect to payment if URL is provided
                if (response.data?.payment?.paymentUrl) {
                    window.open(response.data.payment.paymentUrl, '_blank');
                }
            } else {
                throw new Error(response.message || 'Gagal mengajukan peminjaman');
            }

        } catch (error) {
            console.error('Error submitting booking:', error);

            let errorMessage = 'Gagal mengajukan peminjaman';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        } finally {
            setIsSubmitting(false);
        }
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
        resetForm,
        // Expose buildingId validation status
        hasBuildingId: Boolean(buildingId)
    };
}; 