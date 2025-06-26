import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { buildingManagerAPI } from './buildingManagerAPI';

export const useBuildingManagerManagement = (filters = {}) => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const toast = useToast();

    const fetchManagers = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.getBuildingManagers({
                ...filters,
                ...params
            });

            if (response.status === 'success') {
                setManagers(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data building manager');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat data building manager',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    const refetch = () => fetchManagers();

    return {
        managers,
        loading,
        error,
        pagination,
        fetchManagers,
        refetch
    };
};

export const useAvailableBuildingManagers = () => {
    const [availableManagers, setAvailableManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchAvailableManagers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.getAvailableBuildingManagers();

            if (response.status === 'success') {
                setAvailableManagers(response.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data building manager tersedia');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memuat data building manager tersedia',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableManagers();
    }, []);

    const refetch = () => fetchAvailableManagers();

    return {
        availableManagers,
        loading,
        error,
        refetch
    };
};

export const useCreateBuildingManager = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const createBuildingManager = async (managerData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.createBuildingManager(managerData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Building manager berhasil dibuat',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat building manager');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal membuat building manager',
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
        createBuildingManager,
        loading,
        error
    };
};

export const useAssignBuildingManager = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const assignBuildingManager = async (assignmentData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.assignBuildingManager(assignmentData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Building manager berhasil ditugaskan',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menugaskan building manager');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal menugaskan building manager',
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
        assignBuildingManager,
        loading,
        error
    };
};

export const useUpdateBuildingManager = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const updateBuildingManager = async (id, managerData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.updateBuildingManager(id, managerData);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Building manager berhasil diperbarui',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui building manager');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal memperbarui building manager',
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
        updateBuildingManager,
        loading,
        error
    };
};

export const useDeleteBuildingManager = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const deleteBuildingManager = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.deleteBuildingManager(id);

            if (response.status === 'success') {
                toast({
                    title: 'Berhasil',
                    description: 'Building manager berhasil dihapus',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menghapus building manager');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal menghapus building manager',
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
        deleteBuildingManager,
        loading,
        error
    };
}; 