import React from 'react';
import { SimpleGrid, Box, HStack, VStack, Text } from '@chakra-ui/react';

const CalendarGrid = ({
    currentDate,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDate,
    scheduleData,
    getStatusColor,
    handleEventClick
}) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() &&
            today.getMonth() === currentDate.getMonth();

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<Box key={`empty-${i}`} />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = scheduleData[dateKey] || [];
            const isToday = isCurrentMonth && today.getDate() === day;

            days.push(
                <Box
                    key={day}
                    minH="120px"
                    p={2}
                    border="1px solid rgba(255, 255, 255, 0.3)"
                    position="relative"
                    bg={isToday ? "rgba(116, 156, 115, 0.1)" : "transparent"}
                >
                    <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" color="#444444" fontWeight={isToday ? "bold" : "normal"}>
                            {day}
                        </Text>
                        {isToday && (
                            <Box
                                w={6}
                                h={6}
                                borderRadius="full"
                                bg="#749C73"
                                color="white"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="xs"
                            >
                                {day}
                            </Box>
                        )}
                    </HStack>

                    <VStack spacing={1} align="stretch">
                        {dayEvents.slice(0, 2).map((event) => (
                            <Box
                                key={event.id}
                                bg={getStatusColor(event.status)}
                                color="white"
                                p={1}
                                borderRadius="4px"
                                fontSize="xs"
                                cursor="pointer"
                                onClick={() => handleEventClick(event)}
                                _hover={{ opacity: 0.8 }}
                            >
                                <Text fontWeight="medium" noOfLines={1}>
                                    {event.title}
                                </Text>
                                <Text fontSize="10px" opacity={0.9}>
                                    {event.time}
                                </Text>
                            </Box>
                        ))}
                        {dayEvents.length > 2 && (
                            <Text fontSize="10px" color="#444444" opacity={0.7}>
                                +{dayEvents.length - 2} lainnya
                            </Text>
                        )}
                    </VStack>
                </Box>
            );
        }

        return days;
    };

    return (
        <>
            {/* Day Headers */}
            <SimpleGrid columns={7} spacing={0} mb={2}>
                {dayNames.map((day) => (
                    <Box key={day} p={3} textAlign="center">
                        <Text fontSize="sm" fontWeight="medium" color="#444444" opacity={0.7}>
                            {day}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>

            {/* Calendar Grid */}
            <SimpleGrid columns={7} spacing={0}>
                {renderCalendarDays()}
            </SimpleGrid>
        </>
    );
};

export default CalendarGrid; 