import React from 'react';
import { SimpleGrid, Box, HStack, VStack, Text, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

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

    // Responsive values
    const cellHeight = useBreakpointValue({
        base: "100px",
        sm: "110px",
        md: "120px",
        lg: "130px"
    });

    const fontSize = useBreakpointValue({
        base: "xs",
        sm: "sm"
    });

    const eventFontSize = useBreakpointValue({
        base: "10px",
        sm: "11px",
        md: "12px"
    });

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() &&
            today.getMonth() === currentDate.getMonth();

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <Box
                    key={`empty-${i}`}
                    minH={cellHeight}
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    bg="rgba(255, 255, 255, 0.02)"
                />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = scheduleData[dateKey] || [];
            const isToday = isCurrentMonth && today.getDate() === day;

            days.push(
                <MotionBox
                    key={day}
                    minH={cellHeight}
                    maxH={cellHeight}
                    p={{ base: 1.5, sm: 2 }}
                    border="1px solid rgba(255, 255, 255, 0.15)"
                    position="relative"
                    bg={isToday ? "rgba(116, 156, 115, 0.12)" : "rgba(255, 255, 255, 0.03)"}
                    backdropFilter="blur(5px)"
                    display="flex"
                    flexDirection="column"
                    _hover={{
                        bg: isToday ? "rgba(116, 156, 115, 0.15)" : "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(116, 156, 115, 0.3)"
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.2,
                        delay: day * 0.01,
                        ease: "easeOut"
                    }}
                >
                    {/* Day Number */}
                    <HStack justify="space-between" mb={1} flexShrink={0}>
                        <Text
                            fontSize={fontSize}
                            color="#444444"
                            fontWeight={isToday ? "bold" : "medium"}
                        >
                            {day}
                        </Text>
                        {isToday && (
                            <Box
                                w={{ base: 4, sm: 5 }}
                                h={{ base: 4, sm: 5 }}
                                borderRadius="full"
                                bg="#749C73"
                                color="white"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="10px"
                                fontWeight="bold"
                            >
                                •
                            </Box>
                        )}
                    </HStack>

                    {/* Events Container - Compact */}
                    <Box
                        flex={1}
                        overflowY="auto"
                        overflowX="hidden"
                        pr={0.5}
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '2px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(116, 156, 115, 0.3)',
                                borderRadius: '2px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: 'rgba(116, 156, 115, 0.5)',
                            },
                        }}
                    >
                        <VStack spacing={0.5} align="stretch">
                            {dayEvents.slice(0, 3).map((event, index) => (
                                <MotionBox
                                    key={`${event.id}-${index}`}
                                    bg={getStatusColor(event.status)}
                                    color="white"
                                    p={{ base: 1, sm: 1.5 }}
                                    borderRadius="6px"
                                    fontSize={eventFontSize}
                                    cursor="pointer"
                                    onClick={() => handleEventClick(event)}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -1
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    transition="all 0.2s ease"
                                    minH={{ base: "20px", sm: "24px" }}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    boxShadow="0 1px 3px rgba(0,0,0,0.1)"
                                    _hover={{
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                                    }}
                                >
                                    <Text
                                        fontWeight="medium"
                                        noOfLines={1}
                                        lineHeight="1.1"
                                        fontSize="inherit"
                                    >
                                        {event.title}
                                    </Text>
                                    <Text
                                        fontSize={{ base: "8px", sm: "9px" }}
                                        opacity={0.9}
                                        lineHeight="1"
                                        mt={0.5}
                                    >
                                        {event.time}
                                    </Text>
                                </MotionBox>
                            ))}

                            {/* Show more indicator for remaining events */}
                            {dayEvents.length > 3 && (
                                <Box
                                    p={1}
                                    textAlign="center"
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="4px"
                                    border="1px solid rgba(116, 156, 115, 0.2)"
                                    cursor="pointer"
                                    onClick={() => dayEvents.length > 3 && handleEventClick(dayEvents[0])}
                                    _hover={{
                                        bg: "rgba(116, 156, 115, 0.15)"
                                    }}
                                >
                                    <Text
                                        fontSize="9px"
                                        color="#749C73"
                                        fontWeight="medium"
                                    >
                                        +{dayEvents.length - 3} lainnya
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    </Box>
                </MotionBox>
            );
        }

        return days;
    };

    return (
        <Box>
            {/* Day Headers - Compact */}
            <SimpleGrid columns={7} spacing={0} mb={{ base: 2, sm: 3 }}>
                {dayNames.map((day) => (
                    <Box key={day} p={{ base: 2, sm: 3 }} textAlign="center">
                        <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight="semibold"
                            color="#444444"
                            opacity={0.8}
                            letterSpacing="0.5px"
                        >
                            {day}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>

            {/* Calendar Grid - Responsive */}
            <SimpleGrid
                columns={7}
                spacing={{ base: 1, sm: 2 }}
                bg="rgba(255, 255, 255, 0.02)"
                borderRadius="12px"
                p={{ base: 1, sm: 2 }}
                border="1px solid rgba(255, 255, 255, 0.05)"
            >
                {renderCalendarDays()}
            </SimpleGrid>
        </Box>
    );
};

export default CalendarGrid; 