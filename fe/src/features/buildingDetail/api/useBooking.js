import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from './bookingAPI';
import { useAuthStore } from '@/shared/store/authStore';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';

export const useBooking = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const [formData, setFormData] = useState({
        buildingId: '',
        activityName: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        proposalLetter: null
    });

    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setFormData({
            buildingId: '',
            activityName: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            proposalLetter: null
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'proposalLetter') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0] || null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.activityName.trim()) {
            newErrors.activityName = 'Nama kegiatan wajib diisi';
        } else if (formData.activityName.length < 3) {
            newErrors.activityName = 'Nama kegiatan minimal 3 karakter';
        } else if (formData.activityName.length > 200) {
            newErrors.activityName = 'Nama kegiatan maksimal 200 karakter';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Tanggal mulai wajib diisi';
        } else {
            const selectedDate = new Date(formData.startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.startDate = 'Tanggal mulai tidak boleh di masa lalu';
            }
        }

        if (!formData.startTime) {
            newErrors.startTime = 'Waktu mulai wajib diisi';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'Waktu selesai wajib diisi';
        }

        if (formData.startTime && formData.endTime) {
            const startTime = new Date(`2024-01-01 ${formData.startTime}`);
            const endTime = new Date(`2024-01-01 ${formData.endTime}`);

            if (endTime <= startTime) {
                newErrors.endTime = 'Waktu selesai harus setelah waktu mulai';
            } else {
                const diffInMinutes = (endTime - startTime) / (1000 * 60);
                if (diffInMinutes < 30) {
                    newErrors.endTime = 'Durasi peminjaman minimal 30 menit';
                }
                if (diffInMinutes > 14 * 60) { // 14 hours
                    newErrors.endTime = 'Durasi peminjaman maksimal 14 jam per hari';
                }
            }
        }

        if (formData.endDate && formData.startDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            if (endDate < startDate) {
                newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
            }
        }

        if (!formData.proposalLetter) {
            newErrors.proposalLetter = 'Surat proposal wajib diunggah';
        } else if (formData.proposalLetter.type !== 'application/pdf') {
            newErrors.proposalLetter = 'File proposal harus berformat PDF';
        } else if (formData.proposalLetter.size > 5 * 1024 * 1024) { // 5MB
            newErrors.proposalLetter = 'Ukuran file proposal maksimal 5MB';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkAuthAndRedirect = () => {
        if (!isAuthenticated || !user) {
            toast.error('Silakan login terlebih dahulu untuk mengajukan peminjaman');
            navigate('/auth');
            return false;
        }

        if (user.role === 'ADMIN') {
            toast.error('Admin tidak dapat mengajukan peminjaman');
            return false;
        }

        return true;
    };

    const formatDateForAPI = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const prepareFormDataForSubmission = () => {
        return {
            ...formData,
            startDate: formatDateForAPI(formData.startDate),
            endDate: formData.endDate ? formatDateForAPI(formData.endDate) : undefined
        };
    };

    const submitBooking = async (submissionData) => {
        if (!checkAuthAndRedirect()) {
            return false;
        }

        if (!validateForm()) {
            toast.error('Mohon perbaiki data yang tidak valid');
            return false;
        }

        setIsLoading(true);

        try {
            const response = await bookingAPI.createBooking(submissionData);

            if (response.status === 'success') {
                toast.success('Peminjaman berhasil diajukan. Anda akan diarahkan ke halaman pembayaran.');

                resetForm();

                // Tunggu 2 detik agar user sempat membaca pesan
                setTimeout(() => {
                    // Redirect to payment if payment URL is provided
                    if (response.data.payment?.paymentUrl) {
                        window.open(response.data.payment.paymentUrl, '_blank');
                    }

                    // Navigate to booking history
                    navigate('/user/history');
                }, 2000);

                return true;
            }
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Gagal mengajukan peminjaman');
            toast.error(errorMessage);

            // Set field errors jika ada error validation dari API
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const apiErrors = {};
                error.response.data.errors.forEach(err => {
                    if (err.field && err.message) {
                        apiErrors[err.field] = err.message;
                    }
                });
                setErrors(prev => ({ ...prev, ...apiErrors }));
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const initializeForm = (buildingId, selectedDate = null, requestedTime = null) => {
        setFormData(prev => ({
            ...prev,
            buildingId,
            startDate: selectedDate ? formatDateForInput(selectedDate) : '',
            endDate: selectedDate ? formatDateForInput(selectedDate) : '',
            startTime: requestedTime || ''
        }));
    };

    const formatDateForInput = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data with correct date format
        const submissionData = prepareFormDataForSubmission();

        const success = await submitBooking(submissionData);

        return success;
    };

    return {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
        submitBooking,
        resetForm,
        validateForm,
        initializeForm,
        checkAuthAndRedirect,
        isAuthenticated,
        user
    };
};

export const useBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchBookingHistory = async (params = {}) => {
        setLoading(true);

        try {
            const response = await bookingAPI.getBookingHistory(params);

            if (response.status === 'success') {
                setBookings(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            }
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Gagal memuat riwayat peminjaman');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        bookings,
        loading,
        pagination,
        fetchBookingHistory
    };
};

export const useCreateBooking = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const createBooking = async (bookingData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await bookingAPI.createBooking(bookingData);

            if (response.status === 'success') {
                toast.success('Booking berhasil dibuat');
                navigate('/schedule');
                return response.data;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err, 'Gagal membuat booking');
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createBooking,
        loading,
        error
    };
};

export const useBookingRefund = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const processRefund = async (bookingId, refundData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await bookingAPI.processRefund(bookingId, refundData);

            if (response.status === 'success') {
                toast.success('Refund berhasil diproses');
                return response.data;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err, 'Gagal memproses refund');
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        processRefund,
        loading,
        error
    };
}; 