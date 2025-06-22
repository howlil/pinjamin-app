import { useState, useEffect } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { buildingApi } from '@/services/building/buildingService';

export const useSchedule = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [scheduleData, setScheduleData] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [apiData, setApiData] = useState(null);
    const toast = useToast();

    // Fetch schedule data from API
    const fetchScheduleData = async (month, year) => {
        setIsLoading(true);
        try {
            const response = await buildingApi.getBuildingSchedule({ month, year });

            if (response.status === 'success') {
                setApiData(response.data);
                // Transform API data to calendar format
                const transformedData = transformApiDataToCalendar(response.data.schedule);
                setScheduleData(transformedData);
            }
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
            toast({
                title: "Error",
                description: "Gagal memuat jadwal. Silakan coba lagi.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            // Fallback to empty data
            setScheduleData({});
        } finally {
            setIsLoading(false);
        }
    };

    // Transform API data to calendar format
    const transformApiDataToCalendar = (apiSchedule) => {
        const calendarData = {};

        if (!apiSchedule || !Array.isArray(apiSchedule)) return calendarData;

        apiSchedule.forEach(item => {
            // Convert DD-MM-YYYY to YYYY-MM-DD for consistency
            const formattedStartDate = convertDateFormat(item.startDate);
            const formattedEndDate = item.endDate ? convertDateFormat(item.endDate) : formattedStartDate;

            // Create event object
            const event = {
                id: item.id,
                title: item.activityName,
                time: `${item.startTime} - ${item.endTime}`,
                status: item.status?.toLowerCase(),
                room: item.buildingDetail?.buildingName,
                buildingType: item.buildingDetail?.buildingType,
                location: item.buildingDetail?.location,
                borrowerName: item.borrowerDetail?.borrowerName,
                buildingPhoto: item.buildingDetail?.buildingPhoto,
                startDate: item.startDate,
                endDate: item.endDate,
                originalData: item
            };

            // If it's a multi-day event, add to all dates in the range
            if (formattedEndDate && formattedEndDate !== formattedStartDate) {
                const start = new Date(formattedStartDate);
                const end = new Date(formattedEndDate);

                for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    const dateKey = formatDateToKey(date);
                    if (!calendarData[dateKey]) {
                        calendarData[dateKey] = [];
                    }
                    calendarData[dateKey].push(event);
                }
            } else {
                // Single day event
                if (!calendarData[formattedStartDate]) {
                    calendarData[formattedStartDate] = [];
                }
                calendarData[formattedStartDate].push(event);
            }
        });

        return calendarData;
    };

    // Convert DD-MM-YYYY to YYYY-MM-DD
    const convertDateFormat = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Format date object to YYYY-MM-DD
    const formatDateToKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Load data when component mounts or date changes
    useEffect(() => {
        const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        const year = currentDate.getFullYear();
        fetchScheduleData(month, year);
    }, [currentDate]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return '#749C73';
            case 'processing':
                return '#FFA500';
            case 'completed':
                return '#888888';
            case 'rejected':
                return '#dc3545';
            default:
                return '#888888';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'Disetujui';
            case 'processing':
                return 'Diproses';
            case 'completed':
                return 'Selesai';
            case 'rejected':
                return 'Ditolak';
            default:
                return status || '';
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
        apiData,
        isLoading,
        getStatusColor,
        getStatusText,
        getDaysInMonth,
        getFirstDayOfMonth,
        formatDate,
        handleEventClick,
        navigateMonth
    };
}; 