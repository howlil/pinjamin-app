import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { buildingManagementAPI } from './buildingManagementAPI';

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

    const fetchBuildings = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = {};
            const allParams = { ...filters, ...params };

            Object.keys(allParams).forEach(key => {
                const value = allParams[key];
                if (value !== '' && value !== null && value !== undefined) {
                    queryParams[key] = value;
                }
            });

            const response = await buildingManagementAPI.getAdminBuildings(queryParams);

            if (response.data) {
                const buildingsData = response.data || [];
                const paginationData = response.pagination || pagination;

                setBuildings(buildingsData);
                setPagination(paginationData);
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
    }, [JSON.stringify(filters)]); // Re-fetch when filters change

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

    const createBuilding = async (buildingData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await buildingManagementAPI.createBuilding(buildingData);

            if (response.data && response.data.status === 'success') {
                toast.success('Gedung berhasil dibuat');
                return response.data.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat gedung');
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
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui gedung');
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
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menghapus gedung');
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