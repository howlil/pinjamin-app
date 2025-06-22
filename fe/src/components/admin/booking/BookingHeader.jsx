import React from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    HStack,
    Flex,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';

const MotionBox = motion(Box);

const BookingHeader = ({
    title = "Manajemen Peminjaman",
    description = "Kelola persetujuan dan status peminjaman ruangan",
    onExport
}) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });

    return (
        <MotionBox
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            mb={6}
        >
            <Box
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="20px"
                boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                p={padding}
                _hover={{
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
                }}
                transition="all 0.3s ease"
            >
                <Flex
                    justify="space-between"
                    align={{ base: 'start', md: 'center' }}
                    direction={{ base: 'column', md: 'row' }}
                    gap={4}
                >
                    <HStack spacing={4}>
                        <Box
                            w={14}
                            h={14}
                            borderRadius="16px"
                            bg="rgba(116, 156, 115, 0.15)"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bg: 'linear-gradient(135deg, rgba(116, 156, 115, 0.2), rgba(116, 156, 115, 0.05))',
                                borderRadius: '16px'
                            }}
                        >
                            <Calendar
                                size={24}
                                color={COLORS.primary}
                                style={{ position: 'relative', zIndex: 1 }}
                            />
                        </Box>
                        <Box>
                            <Heading
                                size={{ base: "md", md: "lg" }}
                                color="#444444"
                                fontWeight="bold"
                                mb={1}
                            >
                                {title}
                            </Heading>
                            <Text
                                color="#666666"
                                fontSize="sm"
                                fontWeight="medium"
                                lineHeight="1.5"
                            >
                                {description}
                            </Text>
                        </Box>
                    </HStack>

                    {onExport && (
                        <Button
                            leftIcon={<Download size={16} />}
                            bg="rgba(255, 255, 255, 0.1)"
                            backdropFilter="blur(8px)"
                            border="1px solid rgba(255, 255, 255, 0.15)"
                            color="#444444"
                            borderRadius="12px"
                            px={6}
                            py={3}
                            fontSize="sm"
                            fontWeight="bold"
                            _hover={{
                                bg: "rgba(116, 156, 115, 0.1)",
                                borderColor: "rgba(116, 156, 115, 0.3)",
                                color: COLORS.primary,
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(116, 156, 115, 0.2)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all 0.2s ease"
                            onClick={onExport}
                        >
                            Export Data
                        </Button>
                    )}
                </Flex>
            </Box>
        </MotionBox>
    );
};

export default BookingHeader; 