import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { buildingApi } from '@/services/building/buildingService';

export const useRoomDetail = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // State for building data
    const [buildingData, setBuildingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch building detail from API
    const fetchBuildingDetail = async () => {
        if (!roomId) {
            setError('Building ID tidak ditemukan');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log('Fetching building detail for ID:', roomId);
            const response = await buildingApi.getBuildingById(roomId);

            if (response.status === 'success' && response.data) {
                setBuildingData(response.data);
                console.log('Building data loaded:', response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch building details');
            }
        } catch (err) {
            console.error('Error fetching building details:', err);

            let errorMessage = 'Gagal memuat detail gedung';
            let shouldRedirect = false;

            // Handle specific error types
            if (err.response) {
                const status = err.response.status;
                const errorData = err.response.data;

                if (status === 404) {
                    errorMessage = 'Gedung tidak ditemukan';
                    shouldRedirect = true;
                } else if (status === 500) {
                    errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
                } else if (status === 403) {
                    errorMessage = 'Anda tidak memiliki akses ke gedung ini';
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = `Error ${status}: ${err.message}`;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true
            });

            // Redirect to home if building not found
            if (shouldRedirect) {
                setTimeout(() => navigate('/'), 3000);
            }
        } finally {
            setLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const [day, month, year] = dateString.split('-');
            if (!day || !month || !year) return dateString;

            return new Date(`${year}-${month}-${day}`).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            console.warn('Error formatting date:', dateString, error);
            return dateString;
        }
    };

    // Get booking status color
    const getBookingStatusColor = (status) => {
        if (!status) return 'gray';
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return 'green';
            case 'PENDING':
            case 'PROCESSING':
                return 'yellow';
            case 'REJECTED':
                return 'red';
            case 'CANCELLED':
                return 'gray';
            default:
                return 'gray';
        }
    };

    // Get booking status text
    const getBookingStatusText = (status) => {
        if (!status) return 'Unknown';
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return 'Disetujui';
            case 'PENDING':
                return 'Menunggu';
            case 'PROCESSING':
                return 'Diproses';
            case 'REJECTED':
                return 'Ditolak';
            case 'CANCELLED':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    // Get building type text
    const getBuildingTypeText = (type) => {
        if (!type) return 'Unknown';
        const types = {
            'CLASSROOM': 'Ruang Kelas',
            'LABORATORY': 'Laboratorium',
            'SEMINAR': 'Ruang Seminar',
            'PKM': 'PKM',
            'AUDITORIUM': 'Auditorium',
            'MEETING': 'Ruang Meeting',
            'MULTIFUNCTION': 'Multifungsi'
        };
        return types[type.toUpperCase()] || type;
    };

    // Transform booking schedule for calendar
    const getCalendarReservations = () => {
        if (!buildingData?.bookingSchedule || !Array.isArray(buildingData.bookingSchedule)) {
            return [];
        }

        return buildingData.bookingSchedule.map(booking => {
            try {
                // Add null checks for date strings
                if (!booking.startDate || !booking.endDate) {
                    console.warn('Booking with missing dates:', booking);
                    return [];
                }

                const [startDay, startMonth, startYear] = booking.startDate.split('-');
                const [endDay, endMonth, endYear] = booking.endDate.split('-');

                // Validate date parts
                if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) {
                    console.warn('Invalid date format in booking:', booking);
                    return [];
                }

                const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
                const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

                // Validate date objects
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.warn('Invalid dates in booking:', booking);
                    return [];
                }

                // Generate all dates between start and end
                const dates = [];
                const currentDate = new Date(startDate);

                while (currentDate <= endDate) {
                    dates.push({
                        date: currentDate.toISOString().split('T')[0],
                        status: booking.status ? booking.status.toLowerCase() : 'unknown',
                        booking: booking
                    });
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                return dates;
            } catch (error) {
                console.warn('Error processing booking:', booking, error);
                return [];
            }
        }).flat().filter(item => Array.isArray(item) ? item.length > 0 : item); // Filter out empty arrays
    };

    // Check if room is available for booking
    const isRoomAvailable = (selectedDate) => {
        try {
            const reservations = getCalendarReservations();
            const selectedDateStr = selectedDate.toISOString().split('T')[0];

            return !reservations.some(reservation =>
                reservation.date === selectedDateStr &&
                reservation.status === 'approved'
            );
        } catch (error) {
            console.warn('Error checking room availability:', error);
            return true; // Default to available if there's an error
        }
    };

    // Initial data fetch
    useEffect(() => {
        if (roomId) {
            fetchBuildingDetail();
        } else {
            setError('Building ID tidak ditemukan');
            setLoading(false);
        }
    }, [roomId]);

    return {
        buildingData,
        loading,
        error,
        isOpen,
        onOpen,
        onClose,
        formatCurrency,
        formatDate,
        getBookingStatusColor,
        getBookingStatusText,
        getBuildingTypeText,
        getCalendarReservations,
        isRoomAvailable,
        refetch: fetchBuildingDetail,

        // Legacy props for backward compatibility
        roomData: buildingData ? {
            id: buildingData.id,
            name: buildingData.buildingName || 'Unknown Building',
            description: buildingData.description || 'No description available',
            image: buildingData.buildingPhoto || null,
            building: buildingData.buildingName || 'Unknown Building',
            floor: 'Lantai 1', // API doesn't provide floor info
            capacity: buildingData.capacity ? `${buildingData.capacity} Orang` : 'Unknown capacity',
            price: buildingData.rentalPrice || 0,
            facilities: buildingData.facilities || [],
            managers: buildingData.buildingManagers || [],
            location: buildingData.location || 'Unknown location',
            buildingType: buildingData.buildingType || 'UNKNOWN'
        } : null,
        reservations: (() => {
            try {
                return loading || !buildingData ? [] : getCalendarReservations();
            } catch (error) {
                console.error('Error getting calendar reservations:', error);
                return [];
            }
        })()
    };
}; 