import React, { useState } from 'react';
import {
    HStack,
    VStack,
    Text,
    Input,
    Button,
    Box,
    Badge,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    Grid,
    IconButton,
    Flex,
    Spacer
} from '@chakra-ui/react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

const DateFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange, onClearFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

    const formatDateForAPI = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const parseAPIDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('-');
        return new Date(year, month - 1, day);
    };

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const isDateInRange = (date) => {
        if (!selectedRange.start || !selectedRange.end) return false;
        return date >= selectedRange.start && date <= selectedRange.end;
    };

    const isDateSelected = (date) => {
        return (selectedRange.start && date.getTime() === selectedRange.start.getTime()) ||
            (selectedRange.end && date.getTime() === selectedRange.end.getTime());
    };

    const handleDateClick = (date) => {
        if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
            // Start new selection
            setSelectedRange({ start: date, end: null });
        } else {
            // Complete the range
            if (date < selectedRange.start) {
                setSelectedRange({ start: date, end: selectedRange.start });
            } else {
                setSelectedRange({ start: selectedRange.start, end: date });
            }
        }
    };

    const applyDateRange = () => {
        if (selectedRange.start) {
            onStartDateChange(formatDateForAPI(selectedRange.start));
        }
        if (selectedRange.end) {
            onEndDateChange(formatDateForAPI(selectedRange.end));
        }
        setIsOpen(false);
    };

    const clearSelection = () => {
        setSelectedRange({ start: null, end: null });
        onClearFilter();
        setIsOpen(false);
    };

    React.useEffect(() => {
        if (startDate || endDate) {
            setSelectedRange({
                start: parseAPIDate(startDate),
                end: parseAPIDate(endDate)
            });
        }
    }, [startDate, endDate]);

    const hasActiveFilter = startDate || endDate;
    const displayText = startDate && endDate
        ? `${startDate} - ${endDate}`
        : startDate
            ? `Dari: ${startDate}`
            : endDate
                ? `Sampai: ${endDate}`
                : 'Pilih Tanggal';

    return (
        <Box>
            <Text mb={2} fontWeight="medium" fontSize="sm" color="#2A2A2A" opacity={0.8}>
                Filter Tanggal:
            </Text>

            <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <PopoverTrigger>
                    <Button
                        leftIcon={<Calendar size={16} />}
                        onClick={() => setIsOpen(!isOpen)}
                        bg="rgba(255, 255, 255, 0.8)"
                        borderRadius="9999px"
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        color="#2A2A2A"
                        size="md"
                        _hover={{
                            bg: "rgba(255, 255, 255, 0.9)",
                            transform: "translateY(-1px)"
                        }}
                    >
                        {displayText}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    bg="rgba(255, 255, 255, 0.95)"
                    backdropFilter="blur(20px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    w="320px"
                    zIndex={9999}
                >
                    <PopoverArrow bg="rgba(255, 255, 255, 0.95)" />
                    <PopoverBody p={4}>
                        {/* Calendar Header */}
                        <Flex align="center" mb={4}>
                            <IconButton
                                icon={<ChevronLeft size={16} />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                borderRadius="9999px"
                            />
                            <Spacer />
                            <Text fontWeight="bold" color="#2A2A2A">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </Text>
                            <Spacer />
                            <IconButton
                                icon={<ChevronRight size={16} />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                borderRadius="9999px"
                            />
                        </Flex>

                        {/* Day Headers */}
                        <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2}>
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                <Text key={day} textAlign="center" fontSize="xs" color="#2A2A2A" opacity={0.6} fontWeight="bold">
                                    {day}
                                </Text>
                            ))}
                        </Grid>

                        {/* Calendar Grid */}
                        <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={4}>
                            {getDaysInMonth(currentMonth).map((date, index) => (
                                <Box
                                    key={index}
                                    as="button"
                                    h="32px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius="8px"
                                    fontSize="sm"
                                    bg={date && isDateSelected(date) ? "#21D179" :
                                        date && isDateInRange(date) ? "rgba(33, 209, 121, 0.2)" :
                                            "transparent"}
                                    color={date && isDateSelected(date) ? "white" : "#2A2A2A"}
                                    _hover={date ? {
                                        bg: date && isDateSelected(date) ? "#16B866" : "rgba(33, 209, 121, 0.1)"
                                    } : {}}
                                    onClick={date ? () => handleDateClick(date) : undefined}
                                    isDisabled={!date}
                                    opacity={date ? 1 : 0}
                                >
                                    {date?.getDate()}
                                </Box>
                            ))}
                        </Grid>

                        {/* Action Buttons */}
                        <HStack spacing={2}>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={clearSelection}
                                borderRadius="9999px"
                                leftIcon={<X size={14} />}
                            >
                                Hapus
                            </Button>
                            <Spacer />
                            <Button
                                size="sm"
                                bg="#21D179"
                                color="white"
                                borderRadius="9999px"
                                onClick={applyDateRange}
                                _hover={{ bg: "#16B866" }}
                                isDisabled={!selectedRange.start}
                            >
                                Terapkan
                            </Button>
                        </HStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

            {hasActiveFilter && (
                <HStack mt={2} spacing={2} wrap="wrap">
                    <Text fontSize="sm" color="#2A2A2A" opacity={0.7}>Filter aktif:</Text>
                    {startDate && (
                        <Badge
                            bg="rgba(33, 209, 121, 0.1)"
                            color="#21D179"
                            borderRadius="9999px"
                            px={3}
                            py={1}
                            fontSize="xs"
                            border="1px solid rgba(33, 209, 121, 0.3)"
                        >
                            Dari: {startDate}
                        </Badge>
                    )}
                    {endDate && (
                        <Badge
                            bg="rgba(33, 209, 121, 0.1)"
                            color="#21D179"
                            borderRadius="9999px"
                            px={3}
                            py={1}
                            fontSize="xs"
                            border="1px solid rgba(33, 209, 121, 0.3)"
                        >
                            Sampai: {endDate}
                        </Badge>
                    )}
                </HStack>
            )}
        </Box>
    );
};

export default DateFilter; 