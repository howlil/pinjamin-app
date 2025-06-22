import React from 'react';
import { Flex, Heading, IconButton, Box } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GLASS } from '@/utils/designTokens';

const MotionFlex = motion(Flex);
const MotionIconButton = motion(IconButton);

const CalendarHeader = ({ currentDate, navigateMonth }) => {
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <MotionFlex
            justify="space-between"
            align="center"
            mb={{ base: 4, sm: 5, md: 6 }}
            px={{ base: 1, sm: 2 }}
            py={2}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Previous Month Button */}
            <MotionIconButton
                icon={<ChevronLeft size={18} />}
                onClick={() => navigateMonth(-1)}
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="12px"
                color="#444444"
                size={{ base: "sm", md: "md" }}
                minW={{ base: "32px", md: "40px" }}
                h={{ base: "32px", md: "40px" }}
                _hover={{
                    bg: "rgba(116, 156, 115, 0.15)",
                    borderColor: "rgba(116, 156, 115, 0.3)",
                    color: "#749C73"
                }}
                _active={{
                    bg: "rgba(116, 156, 115, 0.2)",
                    transform: "scale(0.95)"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
            />

            {/* Month and Year Display */}
            <Box
                flex={1}
                display="flex"
                justifyContent="center"
                px={{ base: 3, sm: 4 }}
            >
                <Heading
                    size={{ base: "md", sm: "lg" }}
                    color="#444444"
                    fontWeight="bold"
                    textAlign="center"
                    letterSpacing="0.5px"
                    bg="rgba(116, 156, 115, 0.05)"
                    px={{ base: 3, sm: 4 }}
                    py={{ base: 1.5, sm: 2 }}
                    borderRadius="12px"
                    border="1px solid rgba(116, 156, 115, 0.1)"
                    backdropFilter="blur(5px)"
                >
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Heading>
            </Box>

            {/* Next Month Button */}
            <MotionIconButton
                icon={<ChevronRight size={18} />}
                onClick={() => navigateMonth(1)}
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="12px"
                color="#444444"
                size={{ base: "sm", md: "md" }}
                minW={{ base: "32px", md: "40px" }}
                h={{ base: "32px", md: "40px" }}
                _hover={{
                    bg: "rgba(116, 156, 115, 0.15)",
                    borderColor: "rgba(116, 156, 115, 0.3)",
                    color: "#749C73"
                }}
                _active={{
                    bg: "rgba(116, 156, 115, 0.2)",
                    transform: "scale(0.95)"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
            />
        </MotionFlex>
    );
};

export default CalendarHeader; 