import { useAuthStore } from '@/utils/store';
import { BookOpen, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const useUserDashboard = () => {
    const { user } = useAuthStore();

    const stats = [
        {
            title: 'Buku Dipinjam',
            value: '3',
            icon: BookOpen,
            color: 'blue.500',
            bgColor: 'blue.50'
        },
        {
            title: 'Akan Jatuh Tempo',
            value: '1',
            icon: Clock,
            color: 'yellow.500',
            bgColor: 'yellow.50'
        },
        {
            title: 'Denda Aktif',
            value: 'Rp 10.000',
            icon: AlertCircle,
            color: 'red.500',
            bgColor: 'red.50'
        },
        {
            title: 'Total Dipinjam',
            value: '24',
            icon: CheckCircle,
            color: 'green.500',
            bgColor: 'green.50'
        }
    ];

    const recentBooks = [
        { title: 'Design Patterns', dueDate: '2024-02-01', status: 'active' },
        { title: 'Clean Architecture', dueDate: '2024-02-05', status: 'active' },
        { title: 'The Pragmatic Programmer', dueDate: '2024-01-30', status: 'due-soon' }
    ];

    // In a real app, you would fetch this data from an API
    const fetchDashboardData = async () => {
        // const response = await apiService.get('/user/dashboard');
        // return response.data;
    };

    return {
        user,
        stats,
        recentBooks
    };
}; 