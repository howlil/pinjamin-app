import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { buildingsAPI } from './buildingsAPI';
import { homeAPI } from './homeAPI';

export const useBuildings = (filters = {}) => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchBuildings = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.getBuildings({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBuildings(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data gedung');
            throw err;
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
            toast.error(errorMessage);
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
            toast.error(errorMessage);
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

export const useAvailabilityChecker = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const checkAvailability = async (checkData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingsAPI.checkAvailability(checkData);

            if (response.status === 'success') {
                setResults(response.data);
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengecek ketersediaan gedung');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        checkAvailability,
        loading,
        error,
        results
    };
}; 