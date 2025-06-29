import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { buildingManagerAPI } from './buildingManagerAPI';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';

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

    const fetchManagers = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.getBuildingManagers({
                ...filters,
                ...params
            });

            if (response.data) {
                setManagers(response.data || []);
                setPagination(response.pagination || pagination);
            }
        } catch (err) {
            setError(extractErrorMessage(err));
            throw err;
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

    const fetchAvailableManagers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.getAvailableBuildingManagers();

            if (response.status === 'success') {
                setAvailableManagers(response.data || []);
            }
        } catch (err) {
            setError(extractErrorMessage(err));
            throw err;
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

    const createBuildingManager = async (managerData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.createBuildingManager(managerData);

            if (response.status === 'success') {
                toast.success('Building manager berhasil dibuat');
                return response.data;
            }
        } catch (err) {
            setError(extractErrorMessage(err));
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

    const assignBuildingManager = async (assignmentData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.assignBuildingManager(assignmentData);

            if (response.status === 'success') {
                toast.success('Building manager berhasil ditugaskan');
                return response.data;
            }
        } catch (err) {
            setError(extractErrorMessage(err));
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

    const updateBuildingManager = async (id, managerData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.updateBuildingManager(id, managerData);

            if (response.status === 'success') {
                toast.success('Building manager berhasil diperbarui');
                return response.data;
            }
        } catch (err) {
            setError(extractErrorMessage(err));
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

    const deleteBuildingManager = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagerAPI.deleteBuildingManager(id);

            if (response.status === 'success') {
                toast.success('Building manager berhasil dihapus');
                return response.data;
            }
        } catch (err) {
            setError(extractErrorMessage(err));
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