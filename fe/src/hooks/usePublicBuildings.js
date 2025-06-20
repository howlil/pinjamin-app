import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { buildingApi } from '@/services/apiService';

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

    // Fetch buildings from API
    const fetchBuildings = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = {
                page: params.page || currentPage,
                limit: params.limit || itemsPerPage,
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
            toast({
                title: 'Error',
                description: 'Gagal memuat data gedung',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (searchData) => {
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
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchBuildings({
            page: newPage,
            limit: itemsPerPage,
            search: searchQuery,
            buildingType: buildingType
        });
    };

    // Handle items per page change
    const handleItemsPerPageChange = (newLimit) => {
        setItemsPerPage(newLimit);
        setCurrentPage(1);
        fetchBuildings({
            page: 1,
            limit: newLimit,
            search: searchQuery,
            buildingType: buildingType
        });
    };

    // Clear filters
    const clearFilters = () => {
        setSearchQuery('');
        setBuildingType('');
        setCurrentPage(1);
        fetchBuildings({
            page: 1,
            limit: itemsPerPage
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Get building type badge color
    const getBuildingTypeColor = (type) => {
        const colors = {
            'CLASSROOM': 'blue',
            'LABORATORY': 'green',
            'SEMINAR': 'purple',
            'PKM': 'orange',
            'AUDITORIUM': 'red',
            'MEETING': 'cyan'
        };
        return colors[type] || 'gray';
    };

    // Get building type text
    const getBuildingTypeText = (type) => {
        const types = {
            'CLASSROOM': 'Ruang Kelas',
            'LABORATORY': 'Laboratorium',
            'SEMINAR': 'Ruang Seminar',
            'PKM': 'PKM',
            'AUDITORIUM': 'Auditorium',
            'MEETING': 'Ruang Meeting'
        };
        return types[type] || type;
    };

    // Get available building types for filter
    const getBuildingTypes = () => [
        { value: '', label: 'Semua Jenis' },
        { value: 'CLASSROOM', label: 'Ruang Kelas' },
        { value: 'LABORATORY', label: 'Laboratorium' },
        { value: 'SEMINAR', label: 'Ruang Seminar' },
        { value: 'PKM', label: 'PKM' },
        { value: 'AUDITORIUM', label: 'Auditorium' },
        { value: 'MEETING', label: 'Ruang Meeting' }
    ];

    // Initial load
    useEffect(() => {
        fetchBuildings();
    }, []);

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
        refetch: () => fetchBuildings({
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            buildingType: buildingType
        })
    };
}; 