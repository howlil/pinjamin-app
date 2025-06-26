import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { facilityManagementAPI } from './facilityManagementAPI';

export const useFacilityManagement = (filters = {}) => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchFacilities = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await facilityManagementAPI.getFacilities({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setFacilities(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data fasilitas');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const refetch = () => fetchFacilities();

    return {
        facilities,
        loading,
        error,
        pagination,
        fetchFacilities,
        refetch
    };
};

export const useCreateFacility = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createFacility = async (facilityData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await facilityManagementAPI.createFacility(facilityData);

            if (response.status === 'success') {
                toast.success('Fasilitas berhasil dibuat');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat fasilitas');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createFacility,
        loading,
        error
    };
};

export const useUpdateFacility = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateFacility = async (id, facilityData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await facilityManagementAPI.updateFacility(id, facilityData);

            if (response.status === 'success') {
                toast.success('Fasilitas berhasil diperbarui');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui fasilitas');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateFacility,
        loading,
        error
    };
};

export const useDeleteFacility = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteFacility = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await facilityManagementAPI.deleteFacility(id);

            if (response.status === 'success') {
                toast.success('Fasilitas berhasil dihapus');
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menghapus fasilitas');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteFacility,
        loading,
        error
    };
}; 