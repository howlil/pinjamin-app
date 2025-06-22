import { useState, useEffect, useCallback } from 'react';
import { buildingApi } from '@/services/building/buildingService';
import { showToast } from '@/utils/helpers';

export const useBuildings = () => {
    // State management
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBuildings, setTotalBuildings] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // Filter states
    const [buildingTypeFilter, setBuildingTypeFilter] = useState('');

    const limit = 10; // Items per page

    // Fetch buildings data
    const fetchBuildings = useCallback(async (page = 1, search = '', buildingType = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                ...(search && { search }),
                ...(buildingType && { buildingType })
            };

            const response = await buildingApi.getBuildings(params);

            if (response.status === 'success') {
                // Handle response structure - data is directly in response.data array
                if (Array.isArray(response.data)) {
                    setBuildings(response.data);
                    setTotalBuildings(response.pagination?.totalItems || response.data.length);
                    setTotalPages(response.pagination?.totalPages || 1);
                } else {
                    // Fallback for nested structure
                    setBuildings(response.data?.buildings || []);
                    setTotalBuildings(response.data?.pagination?.totalItems || 0);
                    setTotalPages(response.data?.pagination?.totalPages || 1);
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch buildings');
            showToast.error('Gagal memuat data gedung');
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle search
    const handleSearch = useCallback(() => {
        setCurrentPage(1);
        fetchBuildings(1, searchTerm, buildingTypeFilter);
    }, [searchTerm, buildingTypeFilter, fetchBuildings]);

    // Handle filter change
    const handleFilterChange = useCallback((filterType, value) => {
        if (filterType === 'buildingType') {
            setBuildingTypeFilter(value);
        }
        setCurrentPage(1);
        fetchBuildings(1, searchTerm,
            filterType === 'buildingType' ? value : buildingTypeFilter
        );
    }, [searchTerm, buildingTypeFilter, fetchBuildings]);

    // Handle pagination
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        fetchBuildings(page, searchTerm, buildingTypeFilter);
    }, [searchTerm, buildingTypeFilter, fetchBuildings]);

    // Create building
    const createBuilding = useCallback(async (buildingData) => {
        try {
            setActionLoading(true);
            console.log('=== CREATE BUILDING HOOK ===');
            console.log('Building data:', buildingData);

            await buildingApi.createBuilding(buildingData);
            showToast.success('Gedung berhasil dibuat');
            await fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
            return true;
        } catch (err) {
            console.error('=== CREATE BUILDING ERROR ===');
            console.error('Full error:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);

            // Handle validation errors - check both err.response.data and err.data
            const errorData = err.response?.data || err.data;

            if (errorData?.message) {
                console.log('Using errorData.message:', errorData.message);
                showToast.error(errorData.message);
            } else if (errorData?.errors) {
                console.log('Using errorData.errors:', errorData.errors);
                showToast.error(errorData.errors);
            } else {
                console.log('Using fallback error message');
                showToast.error('Gagal membuat gedung');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [currentPage, searchTerm, buildingTypeFilter, fetchBuildings]);

    // Update building
    const updateBuilding = useCallback(async (id, buildingData) => {
        try {
            setActionLoading(true);
            console.log('=== UPDATE BUILDING HOOK ===');
            console.log('Building ID:', id);
            console.log('Building data:', buildingData);

            await buildingApi.updateBuilding(id, buildingData);
            showToast.success('Gedung berhasil diperbarui');
            await fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
            return true;
        } catch (err) {
            console.error('=== UPDATE BUILDING ERROR ===');
            console.error('Full error:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);

            // Handle validation errors - check both err.response.data and err.data
            const errorData = err.response?.data || err.data;

            if (errorData?.message) {
                console.log('Using errorData.message:', errorData.message);
                showToast.error(errorData.message);
            } else if (errorData?.errors) {
                console.log('Using errorData.errors:', errorData.errors);
                showToast.error(errorData.errors);
            } else {
                console.log('Using fallback error message');
                showToast.error('Gagal memperbarui gedung');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [currentPage, searchTerm, buildingTypeFilter, fetchBuildings]);

    // Delete building
    const deleteBuilding = useCallback(async (id) => {
        try {
            setActionLoading(true);
            await buildingApi.deleteBuilding(id);
            showToast.success('Gedung berhasil dihapus');
            await fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal menghapus gedung');
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [currentPage, searchTerm, buildingTypeFilter, fetchBuildings]);

    // Refresh data
    const refreshData = useCallback(() => {
        fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
    }, [currentPage, searchTerm, buildingTypeFilter, fetchBuildings]);

    // Initial data fetch
    useEffect(() => {
        fetchBuildings();
    }, [fetchBuildings]);

    return {
        // State
        buildings,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalBuildings,
        actionLoading,
        buildingTypeFilter,

        // Actions
        setSearchTerm,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        createBuilding,
        updateBuilding,
        deleteBuilding,
        refreshData
    };
}; 