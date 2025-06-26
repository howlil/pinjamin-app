import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { buildingsAPI } from './buildingsAPI';
import { homeAPI } from './homeAPI';

export const useBuildings = (filters = {}) => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const toast = useToast();

    const fetchBuildings = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.getBuildings({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBuildings(response.data.buildings || response.data || []);
                setPagination(response.data.pagination || pagination);
            } else {
                throw new Error(response.message || 'Gagal memuat data gedung');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data gedung';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuildings();
    }, []);

    const refetch = () => fetchBuildings();

    return {
        buildings,
        loading,
        error,
        pagination,
        fetchBuildings,
        refetch
    };
};

export const useBuildingDetail = (buildingId) => {
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchBuilding = async () => {
        if (!buildingId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.getBuildingById(buildingId);

            if (response.status === 'success') {
                setBuilding(response.data);
            } else {
                throw new Error(response.message || 'Gagal memuat detail gedung');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat detail gedung';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuilding();
    }, [buildingId]);

    return {
        building,
        loading,
        error,
        refetch: fetchBuilding
    };
};

export const useAvailabilityCheck = () => {
    const [availableBuildings, setAvailableBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const checkAvailability = async (date, time) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.checkAvailability({ date, time });
            console.log('Raw API Response:', response);

            let buildings = [];
            let normalizedResponse = {
                status: 'success',
                message: 'Pencarian berhasil',
                data: {
                    availableBuildings: [],
                    requestedDateTime: { date, time }
                }
            };

            // Handle different response structures
            if (Array.isArray(response)) {
                // Response is direct array of buildings
                buildings = response;
                normalizedResponse.message = `Ditemukan ${buildings.length} gedung yang tersedia`;
            } else if (response.data && Array.isArray(response.data)) {
                // Response has data property with array
                buildings = response.data;
                normalizedResponse.status = response.status || 'success';
                normalizedResponse.message = response.message || `Ditemukan ${buildings.length} gedung yang tersedia`;
            } else if (response.data && response.data.availableBuildings) {
                // Response already in expected format
                buildings = response.data.availableBuildings;
                normalizedResponse = response;
            } else if (response.status === 'success' && response.data) {
                // Extract buildings from various possible structures
                buildings = response.data.buildings || response.data.availableBuildings || response.data || [];
                normalizedResponse.status = response.status;
                normalizedResponse.message = response.message || `Ditemukan ${buildings.length} gedung yang tersedia`;
            }

            normalizedResponse.data.availableBuildings = buildings;
            setAvailableBuildings(buildings);

            console.log('Normalized Response:', normalizedResponse);
            return normalizedResponse;

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal mengecek ketersediaan';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        availableBuildings,
        loading,
        error,
        checkAvailability
    };
};

export const useTodayBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchTodayBookings = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await homeAPI.getTodayBookings();

            if (response.status === 'success') {
                setBookings(response.data || []);
            } else {
                throw new Error(response.message || 'Gagal memuat peminjaman hari ini');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat peminjaman hari ini';
            setError(errorMessage);
            console.error('Error fetching today bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayBookings();
    }, []);

    return {
        bookings,
        loading,
        error,
        refetch: fetchTodayBookings
    };
}; 