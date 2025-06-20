import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

export const useUserHistory = () => {
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    // Mock data - in real app, this would come from API
    const mockBorrowHistory = [
        {
            id: 1,
            itemTitle: 'Ruang Seminar A',
            itemType: 'room',
            borrowDate: '2024-01-15',
            returnDate: '2024-01-15',
            actualReturnDate: '2024-01-15',
            status: 'returned',
            duration: '3 jam',
            building: 'Gedung A',
            cost: 150000
        },
        {
            id: 2,
            itemTitle: 'Ruang Meeting B',
            itemType: 'room',
            borrowDate: '2024-01-20',
            returnDate: '2024-01-20',
            actualReturnDate: '2024-01-20',
            status: 'returned',
            duration: '2 jam',
            building: 'Gedung B',
            cost: 100000
        },
        {
            id: 3,
            itemTitle: 'Ruang Konferensi C',
            itemType: 'room',
            borrowDate: '2024-01-25',
            returnDate: '2024-01-25',
            actualReturnDate: null,
            status: 'active',
            duration: '4 jam',
            building: 'Gedung C',
            cost: 200000
        },
        {
            id: 4,
            itemTitle: 'Ruang Workshop D',
            itemType: 'room',
            borrowDate: '2024-01-10',
            returnDate: '2024-01-10',
            actualReturnDate: '2024-01-12',
            status: 'overdue',
            duration: '6 jam',
            building: 'Gedung D',
            cost: 300000
        }
    ];

    // Fetch history data
    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setBorrowHistory(mockBorrowHistory);
        } catch (err) {
            setError('Gagal memuat riwayat peminjaman');
            toast({
                title: 'Error',
                description: 'Gagal memuat riwayat peminjaman',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'returned':
                return 'green';
            case 'active':
                return 'blue';
            case 'overdue':
                return 'red';
            case 'cancelled':
                return 'gray';
            default:
                return 'gray';
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'returned':
                return 'Dikembalikan';
            case 'active':
                return 'Aktif';
            case 'overdue':
                return 'Terlambat';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get stats
    const getStats = () => {
        const total = borrowHistory.length;
        const active = borrowHistory.filter(item => item.status === 'active').length;
        const returned = borrowHistory.filter(item => item.status === 'returned').length;
        const overdue = borrowHistory.filter(item => item.status === 'overdue').length;
        const totalCost = borrowHistory.reduce((sum, item) => sum + (item.cost || 0), 0);

        return {
            total,
            active,
            returned,
            overdue,
            totalCost
        };
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        borrowHistory,
        loading,
        error,
        getStatusBadge,
        getStatusText,
        formatCurrency,
        formatDate,
        getStats,
        refetch: fetchHistory
    };
}; 