import { useState, useEffect, useCallback } from 'react';
import { buildingManagerApi } from '@/services/buildingManager/buildingManagerService';
import { showToast } from '@/utils/helpers';

export const useBuildingManagers = () => {
    // State management
    const [buildingManagers, setBuildingManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalManagers, setTotalManagers] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // Filter states
    const [buildingFilter, setBuildingFilter] = useState('');

    const limit = 10; // Items per page

    // Fetch building managers data
    const fetchBuildingManagers = useCallback(async (page = 1, buildingId = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                ...(buildingId && { buildingId })
            };

            console.log('=== FETCH BUILDING MANAGERS ===');
            console.log('Params:', params);

            const response = await buildingManagerApi.getBuildingManagers(params);

            if (response.status === 'success') {
                setBuildingManagers(response.data || []);
                setTotalManagers(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (err) {
            console.error('Error fetching building managers:', err);
            setError(err.message || 'Failed to fetch building managers');
            showToast.error('Gagal memuat data pengelola gedung');
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle filter change
    const handleFilterChange = useCallback((filterType, value) => {
        if (filterType === 'building') {
            setBuildingFilter(value);
        }
        setCurrentPage(1);
        fetchBuildingManagers(1, filterType === 'building' ? value : buildingFilter);
    }, [buildingFilter, fetchBuildingManagers]);

    // Handle pagination
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        fetchBuildingManagers(page, buildingFilter);
    }, [buildingFilter, fetchBuildingManagers]);

    // Create building manager
    const createBuildingManager = useCallback(async (managerData) => {
        try {
            setActionLoading(true);
            console.log('=== CREATE BUILDING MANAGER HOOK ===');
            console.log('Manager data:', managerData);

            await buildingManagerApi.createBuildingManager(managerData);
            showToast.success('Pengelola gedung berhasil dibuat');
            await fetchBuildingManagers(currentPage, buildingFilter);
            return true;
        } catch (err) {
            console.error('=== CREATE BUILDING MANAGER ERROR ===');
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
                showToast.error('Gagal membuat pengelola gedung');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [currentPage, buildingFilter, fetchBuildingManagers]);

    // Update building manager
    const updateBuildingManager = useCallback(async (id, managerData) => {
        try {
            setActionLoading(true);
            console.log('=== UPDATE BUILDING MANAGER HOOK ===');
            console.log('Manager ID:', id);
            console.log('Manager data:', managerData);

            await buildingManagerApi.updateBuildingManager(id, managerData);
            showToast.success('Pengelola gedung berhasil diperbarui');
            await fetchBuildingManagers(currentPage, buildingFilter);
            return true;
        } catch (err) {
            console.error('=== UPDATE BUILDING MANAGER ERROR ===');
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
                showToast.error('Gagal memperbarui pengelola gedung');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [currentPage, buildingFilter, fetchBuildingManagers]);

    // Delete building manager
    const deleteBuildingManager = useCallback(async (id) => {
        try {
            setActionLoading(true);
            await buildingManagerApi.deleteBuildingManager(id);
            showToast.success('Pengelola gedung berhasil dihapus');
            await fetchBuildingManagers(currentPage, buildingFilter);
            return true;
        } catch (err) {
            showToast.error('Gagal menghapus pengelola gedung');
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [currentPage, buildingFilter, fetchBuildingManagers]);

    // Assign building manager to building
    const assignBuildingManager = useCallback(async (assignmentData) => {
        try {
            setActionLoading(true);
            console.log('=== ASSIGN BUILDING MANAGER HOOK ===');
            console.log('Assignment data:', assignmentData);

            await buildingManagerApi.assignBuildingManager(assignmentData);
            showToast.success('Pengelola gedung berhasil ditugaskan');
            await fetchBuildingManagers(currentPage, buildingFilter);
            return true;
        } catch (err) {
            console.error('=== ASSIGN BUILDING MANAGER ERROR ===');
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
                showToast.error('Gagal menugaskan pengelola gedung');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [currentPage, buildingFilter, fetchBuildingManagers]);

    // Refresh data
    const refreshData = useCallback(() => {
        fetchBuildingManagers(currentPage, buildingFilter);
    }, [currentPage, buildingFilter, fetchBuildingManagers]);

    // Initial data fetch
    useEffect(() => {
        fetchBuildingManagers();
    }, [fetchBuildingManagers]);

    return {
        // State
        buildingManagers,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalManagers,
        actionLoading,
        buildingFilter,

        // Actions
        setSearchTerm,
        handleFilterChange,
        handlePageChange,
        createBuildingManager,
        updateBuildingManager,
        deleteBuildingManager,
        assignBuildingManager,
        refreshData
    };
}; 