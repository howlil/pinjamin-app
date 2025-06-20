import { useState, useEffect } from 'react';
import { buildingManagerApi } from '@/services/apiService';
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
    const fetchBuildingManagers = async (page = 1, buildingId = '') => {
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
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'building') {
            setBuildingFilter(value);
        }
        setCurrentPage(1);
        fetchBuildingManagers(1,
            filterType === 'building' ? value : buildingFilter
        );
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchBuildingManagers(page, buildingFilter);
    };

    // Create building manager
    const createBuildingManager = async (managerData) => {
        try {
            setActionLoading(true);
            console.log('=== CREATE BUILDING MANAGER HOOK ===');
            console.log('Manager data:', managerData);

            await buildingManagerApi.createBuildingManager(managerData);
            showToast.success('Pengelola gedung berhasil ditambahkan');
            fetchBuildingManagers(currentPage, buildingFilter);
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
                showToast.error('Gagal menambahkan pengelola gedung');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Update building manager
    const updateBuildingManager = async (id, managerData) => {
        try {
            setActionLoading(true);
            console.log('=== UPDATE BUILDING MANAGER HOOK ===');
            console.log('Manager ID:', id);
            console.log('Manager data:', managerData);

            await buildingManagerApi.updateBuildingManager(id, managerData);
            showToast.success('Pengelola gedung berhasil diperbarui');
            fetchBuildingManagers(currentPage, buildingFilter);
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
    };

    // Delete building manager
    const deleteBuildingManager = async (id) => {
        try {
            setActionLoading(true);
            console.log('=== DELETE BUILDING MANAGER HOOK ===');
            console.log('Manager ID:', id);

            await buildingManagerApi.deleteBuildingManager(id);
            showToast.success('Pengelola gedung berhasil dihapus');
            fetchBuildingManagers(currentPage, buildingFilter);
            return true;
        } catch (err) {
            console.error('=== DELETE BUILDING MANAGER ERROR ===');
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
                showToast.error('Gagal menghapus pengelola gedung');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Assign building manager to building
    const assignBuildingManager = async (assignmentData) => {
        try {
            setActionLoading(true);
            console.log('=== ASSIGN BUILDING MANAGER HOOK ===');
            console.log('Assignment data:', assignmentData);

            await buildingManagerApi.assignBuildingManager(assignmentData);
            showToast.success('Pengelola gedung berhasil ditugaskan');
            fetchBuildingManagers(currentPage, buildingFilter);
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
    };

    // Refresh data
    const refreshData = () => {
        fetchBuildingManagers(currentPage, buildingFilter);
    };

    // Initial data fetch
    useEffect(() => {
        fetchBuildingManagers();
    }, []);

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