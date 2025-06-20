import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';

export const useSchedule = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 1)); // March 2024

    // Mock data untuk jadwal peminjaman
    const scheduleData = {
        '2024-03-01': [
            { id: 1, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'diproses', room: 'Gedung A' },
            { id: 2, title: 'Rapat Peminjaman', time: '10:00 - 12:00', status: 'diproses', room: 'Gedung B' }
        ],
        '2024-03-02': [
            { id: 3, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'diproses', room: 'Gedung C' },
            { id: 4, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'diproses', room: 'Gedung D' }
        ],
        '2024-03-03': [
            { id: 5, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'diproses', room: 'Gedung E' }
        ],
        '2024-03-07': [
            { id: 6, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'disetujui', room: 'Seminar Gedung F' },
            { id: 7, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'disetujui', room: 'Gedung G' }
        ],
        '2024-03-12': [
            { id: 8, title: 'Rapat Peminjaman', time: '10:00 - 12:00', status: 'disetujui', room: 'Gedung H' }
        ],
        '2024-03-17': [
            { id: 9, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'disetujui', room: 'Gedung I' }
        ],
        '2024-03-19': [
            { id: 10, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'disetujui', room: 'Gedung J' },
            { id: 11, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'disetujui', room: 'Gedung K' }
        ],
        '2024-03-22': [
            { id: 12, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'disetujui', room: 'Gedung L' }
        ],
        '2024-03-27': [
            { id: 13, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'selesai', room: 'Gedung M' },
            { id: 14, title: 'Rapat Peminjaman', time: '07:30 - 10:00', status: 'selesai', room: 'Gedung N' }
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'disetujui':
                return '#749C73';
            case 'diproses':
                return '#FFA500';
            case 'selesai':
                return '#888888';
            default:
                return '#888888';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'disetujui':
                return 'Disetujui';
            case 'diproses':
                return 'Diproses';
            case 'selesai':
                return 'Selesai';
            default:
                return '';
        }
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        onOpen();
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    return {
        isOpen,
        onOpen,
        onClose,
        selectedEvent,
        currentDate,
        scheduleData,
        getStatusColor,
        getStatusText,
        getDaysInMonth,
        getFirstDayOfMonth,
        formatDate,
        handleEventClick,
        navigateMonth
    };
}; 