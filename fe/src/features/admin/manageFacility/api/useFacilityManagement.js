import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
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

    const toast = useToast();

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
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat data fasilitas',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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

    const toast = useToast();

    const createFacility = async (facilityData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await facilityManagementAPI.createFacility(facilityData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Fasilitas berhasil dibuat',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat fasilitas');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal membuat fasilitas',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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

    const toast = useToast();

    const updateFacility = async (id, facilityData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await facilityManagementAPI.updateFacility(id, facilityData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Fasilitas berhasil diperbarui',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui fasilitas');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memperbarui fasilitas',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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

    const toast = useToast();

    const deleteFacility = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await facilityManagementAPI.deleteFacility(id);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Fasilitas berhasil dihapus',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menghapus fasilitas');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal menghapus fasilitas',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
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