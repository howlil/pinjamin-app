import { useState } from 'react';

export const useBookingHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = 78;
    const itemsPerPage = 6;

    // Sample data for bookings
    const bookings = [
        {
            id: 1,
            roomName: 'Seminar Gedung F',
            eventType: 'Pelantikan',
            date: '24 Maret 2024',
            timeStart: '07:30 WIB',
            timeEnd: '10:00 WIB',
            image: 'https://picsum.photos/id/1076/200/120'
        },
        {
            id: 2,
            roomName: 'Seminar Gedung F',
            eventType: 'Pelantikan',
            date: '24 Maret 2024',
            timeStart: '07:30 WIB',
            timeEnd: '10:00 WIB',
            image: 'https://picsum.photos/id/1052/200/120'
        },
        {
            id: 3,
            roomName: 'Seminar Gedung F',
            eventType: 'Pelantikan',
            date: '24 Maret 2024',
            timeStart: '07:30 WIB',
            timeEnd: '10:00 WIB',
            image: 'https://picsum.photos/id/1048/200/120'
        },
        {
            id: 4,
            roomName: 'Seminar Gedung F',
            eventType: 'Pelantikan',
            date: '24 Maret 2024',
            timeStart: '07:30 WIB',
            timeEnd: '10:00 WIB',
            image: 'https://picsum.photos/id/1047/200/120'
        },
        {
            id: 5,
            roomName: 'Seminar Gedung F',
            eventType: 'Pelantikan',
            date: '24 Maret 2024',
            timeStart: '07:30 WIB',
            timeEnd: '10:00 WIB',
            image: 'https://picsum.photos/id/1045/200/120'
        },
        {
            id: 6,
            roomName: 'Seminar Gedung F',
            eventType: 'Pelantikan',
            date: '24 Maret 2024',
            timeStart: '07:30 WIB',
            timeEnd: '10:00 WIB',
            image: 'https://picsum.photos/id/1039/200/120'
        },
    ];

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // In a real app, you would fetch bookings based on the current page
    const fetchBookings = async (page) => {
        // API call to get bookings for the current page
        // const response = await apiService.get(`/bookings?page=${page}&limit=${itemsPerPage}`);
        // setBookings(response.data);
        // setTotalItems(response.meta.total);
    };

    return {
        bookings,
        currentPage,
        totalItems,
        itemsPerPage,
        handlePrevPage,
        handleNextPage
    };
}; 