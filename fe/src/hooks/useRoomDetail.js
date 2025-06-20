import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { buildingApi } from '@/services/apiService';

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
        try {
            setLoading(true);
            setError(null);

            const response = await buildingApi.getBuildingById(roomId);
            
            if (response.status === 'success') {
                setBuildingData(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch building details');
            }
        } catch (err) {
            console.error('Error fetching building details:', err);
            const errorMessage = err.message || 'Gagal memuat detail gedung';
            setError(errorMessage);
            
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true
            });

            // Redirect to home if building not found
            if (err.status === 404) {
                setTimeout(() => navigate('/'), 3000);
            }
        } finally {
            setLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Get booking status color
    const getBookingStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'green';
            case 'PENDING':
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
        switch (status) {
            case 'APPROVED':
                return 'Disetujui';
            case 'PENDING':
                return 'Menunggu';
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
        const types = {
            'CLASSROOM': 'Ruang Kelas',
            'LABORATORY': 'Laboratorium',
            'SEMINAR': 'Ruang Seminar',
            'PKM': 'PKM',
            'AUDITORIUM': 'Auditorium',
            'MEETING': 'Ruang Meeting'
        };
        return types[type] || type;
    };

    // Transform booking schedule for calendar
    const getCalendarReservations = () => {
        if (!buildingData?.bookingSchedule) return [];
        
        return buildingData.bookingSchedule.map(booking => {
            const [startDay, startMonth, startYear] = booking.startDate.split('-');
            const [endDay, endMonth, endYear] = booking.endDate.split('-');
            
            const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
            const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);
            
            // Generate all dates between start and end
            const dates = [];
            const currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                dates.push({
                    date: currentDate.toISOString().split('T')[0],
                    status: booking.status.toLowerCase(),
                    booking: booking
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            return dates;
        }).flat();
    };

    // Check if room is available for booking
    const isRoomAvailable = (selectedDate) => {
        const reservations = getCalendarReservations();
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        
        return !reservations.some(reservation => 
            reservation.date === selectedDateStr && 
            reservation.status === 'approved'
        );
    };

    // Initial data fetch
    useEffect(() => {
        if (roomId) {
            fetchBuildingDetail();
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
            name: buildingData.buildingName,
            description: buildingData.description,
            image: buildingData.buildingPhoto,
            building: buildingData.buildingName,
            floor: 'Lantai 1', // API doesn't provide floor info
            capacity: `${buildingData.capacity} Orang`,
            price: buildingData.rentalPrice,
            facilities: buildingData.facilities || [],
            managers: buildingData.buildingManagers || [],
            location: buildingData.location,
            buildingType: buildingData.buildingType
        } : null,
        reservations: getCalendarReservations()
    };
}; 