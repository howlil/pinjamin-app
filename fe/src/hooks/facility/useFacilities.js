import { useState, useEffect } from 'react';
import { facilityApi } from '@/services/facility/facilityService';
import { showToast } from '@/utils/helpers';

export const useFacilities = () => {
    // State management
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFacilities, setTotalFacilities] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    const limit = 10; // Items per page

    // Fetch facilities data
    const fetchFacilities = async (page = 1, search = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                ...(search && { search })
            };

            const response = await facilityApi.getFacilities(params);

            if (response.status === 'success') {
                setFacilities(response.data || []);
                setTotalFacilities(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch facilities');
            showToast.error('Gagal memuat data fasilitas');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        fetchFacilities(1, searchTerm);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchFacilities(page, searchTerm);
    };

    // Handle create facility
    const createFacility = async (facilityData) => {
        try {
            setActionLoading(true);
            console.log('=== CREATE FACILITY HOOK ===');
            console.log('Facility data:', facilityData);

            await facilityApi.createFacility(facilityData);
            showToast.success('Fasilitas berhasil ditambahkan');
            fetchFacilities(currentPage, searchTerm);
            return true;
        } catch (err) {
            console.error('=== CREATE FACILITY ERROR ===');
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
                showToast.error('Gagal menambahkan fasilitas');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Handle update facility
    const updateFacility = async (id, facilityData) => {
        try {
            setActionLoading(true);
            console.log('=== UPDATE FACILITY HOOK ===');
            console.log('Facility ID:', id);
            console.log('Facility data:', facilityData);

            await facilityApi.updateFacility(id, facilityData);
            showToast.success('Fasilitas berhasil diperbarui');
            fetchFacilities(currentPage, searchTerm);
            return true;
        } catch (err) {
            console.error('=== UPDATE FACILITY ERROR ===');
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
                showToast.error('Gagal memperbarui fasilitas');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Handle delete facility
    const deleteFacility = async (id) => {
        try {
            setActionLoading(true);
            console.log('=== DELETE FACILITY HOOK ===');
            console.log('Facility ID:', id);

            await facilityApi.deleteFacility(id);
            showToast.success('Fasilitas berhasil dihapus');
            fetchFacilities(currentPage, searchTerm);
            return true;
        } catch (err) {
            console.error('=== DELETE FACILITY ERROR ===');
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
                showToast.error('Gagal menghapus fasilitas');
            }
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    // Refresh data
    const refreshData = () => {
        fetchFacilities(currentPage, searchTerm);
    };

    // Initial data fetch
    useEffect(() => {
        fetchFacilities();
    }, []);

    return {
        // State
        facilities,
        loading,
        error,
        searchTerm,
        currentPage,
        totalPages,
        totalFacilities,
        actionLoading,

        // Actions
        setSearchTerm,
        handleSearch,
        handlePageChange,
        createFacility,
        updateFacility,
        deleteFacility,
        refreshData
    };
}; 