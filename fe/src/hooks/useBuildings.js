import { useState, useEffect } from 'react';
import { buildingApi } from '@/services/apiService';
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
    const fetchBuildings = async (page = 1, search = '', buildingType = '') => {
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
                setBuildings(response.data || []);
                setTotalBuildings(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch buildings');
            showToast.error('Gagal memuat data gedung');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        fetchBuildings(1, searchTerm, buildingTypeFilter);
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'buildingType') {
            setBuildingTypeFilter(value);
        }
        setCurrentPage(1);
        fetchBuildings(1, searchTerm,
            filterType === 'buildingType' ? value : buildingTypeFilter
        );
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchBuildings(page, searchTerm, buildingTypeFilter);
    };

    // Create building
    const createBuilding = async (buildingData) => {
        try {
            setActionLoading(true);
            await buildingApi.createBuilding(buildingData);
            showToast.success('Gedung berhasil ditambahkan');
            fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal menambahkan gedung');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Update building
    const updateBuilding = async (id, buildingData) => {
        try {
            setActionLoading(true);
            await buildingApi.updateBuilding(id, buildingData);
            showToast.success('Gedung berhasil diperbarui');
            fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal memperbarui gedung');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Delete building
    const deleteBuilding = async (id) => {
        try {
            setActionLoading(true);
            await buildingApi.deleteBuilding(id);
            showToast.success('Gedung berhasil dihapus');
            fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal menghapus gedung');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Refresh data
    const refreshData = () => {
        fetchBuildings(currentPage, searchTerm, buildingTypeFilter);
    };

    // Initial data fetch
    useEffect(() => {
        fetchBuildings();
    }, []);

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