import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { buildingManagementAPI } from './buildingManagementAPI';

export const useBuildingManagement = (filters = {}) => {
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
            const response = await buildingManagementAPI.getAdminBuildings({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setBuildings(response.data.buildings || []);
                setPagination(response.data.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data gedung');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat data gedung',
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

export const useCreateBuilding = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const createBuilding = async (buildingData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagementAPI.createBuilding(buildingData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Gedung berhasil dibuat',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat gedung');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal membuat gedung',
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
        createBuilding,
        loading,
        error
    };
};

export const useUpdateBuilding = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const updateBuilding = async (id, buildingData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagementAPI.updateBuilding(id, buildingData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Gedung berhasil diperbarui',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui gedung');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memperbarui gedung',
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
        updateBuilding,
        loading,
        error
    };
};

export const useDeleteBuilding = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const deleteBuilding = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagementAPI.deleteBuilding(id);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Gedung berhasil dihapus',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menghapus gedung');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal menghapus gedung',
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
        deleteBuilding,
        loading,
        error
    };
}; 