import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { buildingApi } from '@/services/building/buildingService';

export const usePublicBuildings = () => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const toast = useToast();

    // Use ref for stable reference to avoid dependency issues
    const toastRef = useRef(toast);
    toastRef.current = toast;

    // Fetch buildings from API - Remove unnecessary dependencies
    const fetchBuildings = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = {
                page: params.page || 1,
                limit: params.limit || 10,
                ...(params.search && { search: params.search }),
                ...(params.buildingType && { buildingType: params.buildingType })
            };

            const response = await buildingApi.getPublicBuildings(queryParams);

            if (response.status === 'success') {
                setBuildings(response.data || []);
                setPagination(response.pagination || {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: 1,
                    itemsPerPage: 10
                });
            } else {
                throw new Error(response.message || 'Failed to fetch buildings');
            }
        } catch (err) {
            console.error('Error fetching buildings:', err);
            setError(err.message || 'Gagal memuat data gedung');
            setBuildings([]);
            toastRef.current({
                title: 'Error',
                description: 'Gagal memuat data gedung',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    }, []); // Remove all dependencies to prevent loop

    // Handle search - Simplify dependencies
    const handleSearch = useCallback((searchData) => {
        const { query = '', buildingType: type = '' } = searchData;

        setSearchQuery(query);
        setBuildingType(type);
        setCurrentPage(1); // Reset to first page when searching

        fetchBuildings({
            page: 1,
            limit: itemsPerPage,
            search: query,
            buildingType: type
        });
    }, [fetchBuildings, itemsPerPage]);

    // Handle pagination - Use current values from state
    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
        fetchBuildings({
            page: newPage,
            limit: itemsPerPage,
            search: searchQuery,
            buildingType: buildingType
        });
    }, [fetchBuildings, itemsPerPage, searchQuery, buildingType]);

    // Handle items per page change
    const handleItemsPerPageChange = useCallback((newLimit) => {
        setItemsPerPage(newLimit);
        setCurrentPage(1);
        fetchBuildings({
            page: 1,
            limit: newLimit,
            search: searchQuery,
            buildingType: buildingType
        });
    }, [fetchBuildings, searchQuery, buildingType]);

    // Clear filters
    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setBuildingType('');
        setCurrentPage(1);
        fetchBuildings({
            page: 1,
            limit: itemsPerPage
        });
    }, [fetchBuildings, itemsPerPage]);

    // Format currency - No dependencies needed
    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }, []);

    // Get building type badge color - No dependencies needed
    const getBuildingTypeColor = useCallback((type) => {
        const colors = {
            'CLASSROOM': 'blue',
            'LABORATORY': 'green',
            'SEMINAR': 'purple',
            'PKM': 'orange',
            'AUDITORIUM': 'red',
            'MEETING': 'cyan'
        };
        return colors[type] || 'gray';
    }, []);

    // Get building type text - No dependencies needed
    const getBuildingTypeText = useCallback((type) => {
        const types = {
            'CLASSROOM': 'Ruang Kelas',
            'LABORATORY': 'Laboratorium',
            'SEMINAR': 'Ruang Seminar',
            'PKM': 'PKM',
            'AUDITORIUM': 'Auditorium',
            'MEETING': 'Ruang Meeting'
        };
        return types[type] || type;
    }, []);

    // Get available building types for filter - No dependencies needed
    const getBuildingTypes = useCallback(() => [
        { value: '', label: 'Semua Jenis' },
        { value: 'CLASSROOM', label: 'Ruang Kelas' },
        { value: 'LABORATORY', label: 'Laboratorium' },
        { value: 'SEMINAR', label: 'Ruang Seminar' },
        { value: 'PKM', label: 'PKM' },
        { value: 'AUDITORIUM', label: 'Auditorium' },
        { value: 'MEETING', label: 'Ruang Meeting' }
    ], []);

    // Refetch function
    const refetch = useCallback(() => {
        fetchBuildings({
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            buildingType: buildingType
        });
    }, [fetchBuildings, currentPage, itemsPerPage, searchQuery, buildingType]);

    // Initial load - Only fetch once
    const hasInitialized = useRef(false);
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            fetchBuildings();
        }
    }, [fetchBuildings]);

    return {
        buildings,
        loading,
        error,
        pagination,
        searchQuery,
        buildingType,
        currentPage,
        itemsPerPage,
        handleSearch,
        handlePageChange,
        handleItemsPerPageChange,
        clearFilters,
        formatCurrency,
        getBuildingTypeColor,
        getBuildingTypeText,
        getBuildingTypes,
        refetch
    };
}; 