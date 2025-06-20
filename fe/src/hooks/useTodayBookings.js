import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { bookingApi } from '../services/apiService';

export const useTodayBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const fetchTodayBookings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await bookingApi.getTodayBookings();

            if (response.status === 'success') {
                setBookings(response.data || []);
            } else {
                throw new Error(response.message || 'Failed to fetch today bookings');
            }
        } catch (err) {
            console.error('Error fetching today bookings:', err);
            setError(err.message);
            setBookings([]); // Set empty array on error

            // Don't show toast for normal "no data" scenarios
            if (err.status !== 404) {
                toast({
                    title: "Error",
                    description: "Gagal memuat data peminjaman hari ini",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayBookings();
    }, []);

    return {
        bookings,
        isLoading,
        error,
        isEmpty: bookings.length === 0
    };
}; 