import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { buildingManagementAPI } from './buildingManagementAPI';
import { extractErrorMessage } from '@/shared/services/apiErrorHandler';

export const useBuildingManagement = (filters = {}) => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        currentPage: 1,
        limit: 10,
        itemsPerPage: 10,
        total: 0,
        totalItems: 0,
        totalPages: 0
    });

    const fetchBuildings = useCallback(async (customParams = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Combine filters with custom params
            const allParams = { ...filters, ...customParams };

            // Filter out empty parameters to avoid API validation errors
            const queryParams = {};
            Object.keys(allParams).forEach(key => {
                const value = allParams[key];
                // Only include non-empty values
                if (value !== '' && value !== null && value !== undefined) {
                    queryParams[key] = value;
                }
            });

            const response = await buildingManagementAPI.getAdminBuildings(queryParams);

            if (response.data || response.status === 'success') {
                const buildingsData = response.data || [];
                const paginationData = response.pagination || {
                    page: 1,
                    currentPage: 1,
                    limit: 10,
                    itemsPerPage: 10,
                    total: buildingsData.length,
                    totalItems: buildingsData.length,
                    totalPages: Math.ceil(buildingsData.length / 10)
                };

                setBuildings(buildingsData);
                setPagination(paginationData);
            } else {
                setBuildings([]);
                setPagination({
                    page: 1,
                    currentPage: 1,
                    limit: 10,
                    itemsPerPage: 10,
                    total: 0,
                    totalItems: 0,
                    totalPages: 0
                });
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
            console.error('Error fetching buildings:', err);
            setBuildings([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Fetch buildings when filters change
    useEffect(() => {
        fetchBuildings();
    }, [fetchBuildings]);

    const refetch = useCallback(() => {
        fetchBuildings();
    }, [fetchBuildings]);

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

    const createBuilding = async (buildingData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagementAPI.createBuilding(buildingData);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil dibuat');
                return response.data.data;
            } else if (response.status === 'success') {
                toast.success('Gedung berhasil dibuat');
                return response.data;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
            console.error('Error creating building:', err);
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

    const updateBuilding = async (id, buildingData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagementAPI.updateBuilding(id, buildingData);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil diperbarui');
                return response.data.data;
            } else if (response.status === 'success') {
                toast.success('Gedung berhasil diperbarui');
                return response.data;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
            console.error('Error updating building:', err);
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

    const deleteBuilding = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagementAPI.deleteBuilding(id);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil dihapus');
                return response.data.data;
            } else if (response.status === 'success') {
                toast.success('Gedung berhasil dihapus');
                return response.data;
            }
        } catch (err) {
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
            console.error('Error deleting building:', err);
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