import { useState } from 'react';
import { useToast, useDisclosure } from '@chakra-ui/react';
import { buildingApi } from '../../services/building/buildingService';

export const useAvailabilityCheck = () => {
    const [availableBuildings, setAvailableBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState(null);

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Check availability
    const checkAvailability = async (searchData) => {
        try {
            setLoading(true);
            setError(null);
            setSearchCriteria(searchData);

            // Transform data to match API format
            const requestData = {
                date: searchData.date, // Expected format: DD-MM-YYYY
                time: searchData.time  // Expected format: HH:MM
            };

            console.log('Sending request to API:', requestData);

            const response = await buildingApi.checkAvailability(requestData);

            if (response.status === 'success') {
                setAvailableBuildings(response.data.buildings || []);

                // Open modal to show results
                onOpen();

                toast({
                    title: 'Berhasil',
                    description: `Ditemukan ${response.data.totalAvailable || response.data.buildings?.length || 0} gedung tersedia`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
            } else {
                throw new Error(response.message || 'Gagal mengecek ketersediaan');
            }
        } catch (err) {
            console.error('Error checking availability:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Gagal mengecek ketersediaan gedung';
            setError(errorMessage);

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true
            });
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

    // Format date for display
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';

        const [day, month, year] = dateString.split('-');
        const date = new Date(`${year}-${month}-${day}`);

        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Clear results
    const clearResults = () => {
        setAvailableBuildings([]);
        setSearchCriteria(null);
        setError(null);
        onClose();
    };

    return {
        availableBuildings,
        loading,
        error,
        searchCriteria,
        isOpen,
        onClose,
        checkAvailability,
        formatCurrency,
        formatDisplayDate,
        clearResults
    };
}; 