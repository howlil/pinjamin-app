import React from 'react';
import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GLASS } from '@/utils/designTokens';

const CalendarHeader = ({ currentDate, navigateMonth }) => {
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <Flex justify="space-between" align="center" mb={6}>
            <IconButton
                icon={<ChevronLeft size={20} />}
                onClick={() => navigateMonth(-1)}
                bg="rgba(255, 255, 255, 0.3)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.3)"
                borderRadius="full"
                color="#444444"
                _hover={{
                    bg: "rgba(116, 156, 115, 0.2)",
                    transform: "translateY(-1px)"
                }}
                size="sm"
            />

            <Heading size="lg" color="#444444">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Heading>

            <IconButton
                icon={<ChevronRight size={20} />}
                onClick={() => navigateMonth(1)}
                bg="rgba(255, 255, 255, 0.3)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.3)"
                borderRadius="full"
                color="#444444"
                _hover={{
                    bg: "rgba(116, 156, 115, 0.2)",
                    transform: "translateY(-1px)"
                }}
                size="sm"
            />
        </Flex>
    );
};

export default CalendarHeader; 