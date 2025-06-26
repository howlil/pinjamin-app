import React from 'react';
import { HStack, Text, Box } from '@chakra-ui/react';

const StatusTabs = ({ activeStatus, onStatusChange }) => {
    const statusOptions = [
        { value: '', label: 'Semua', count: null },
        { value: 'PROCESSING', label: 'Diproses', count: null },
        { value: 'APPROVED', label: 'Disetujui', count: null },
        { value: 'REJECTED', label: 'Ditolak', count: null },
        { value: 'COMPLETED', label: 'Selesai', count: null }
    ];

    return (
        <Box
            background="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(15px)"
            borderRadius="24px"
            border="1px solid rgba(215, 215, 215, 0.3)"
            p={{ base: 2, md: 1 }}
            overflow="hidden"
            boxShadow="0 0px 2px rgba(0, 0, 0, 0.1)"
        >
            <HStack
                spacing={{ base: 1, md: 0 }}
                align="center"
                wrap="wrap"
                justify={{ base: "center", md: "flex-start" }}
            >
                {statusOptions.map((option) => {
                    const isActive = activeStatus === option.value;

                    return (
                        <Box
                            key={option.value}
                            as="button"
                            onClick={() => onStatusChange(option.value)}
                            flex={{ base: "0 0 auto", md: "1" }}
                            minW={{ base: "70px", sm: "80px", md: "auto" }}
                            py={{ base: 2, md: 3 }}
                            px={{ base: 3, sm: 4 }}
                            m={{ base: 1, md: 1 }}
                            borderRadius="20px"
                            background={isActive ? '#21D179' : 'transparent'}
                            color={isActive ? 'white' : '#666'}
                            fontFamily="Inter, sans-serif"
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight={isActive ? '600' : '500'}
                            transition="all 0.3s ease"
                            position="relative"
                            whiteSpace="nowrap"
                            textAlign="center"
                            _hover={{
                                background: isActive ? '#1BAE65' : 'rgba(33, 209, 121, 0.1)',
                                color: isActive ? 'white' : '#21D179',
                                transform: 'translateY(-1px)'
                            }}
                            _active={{
                                transform: 'translateY(0)'
                            }}
                        >
                            <Text
                                fontSize={{ base: "xs", sm: "sm" }}
                                fontWeight={isActive ? '600' : '500'}
                                fontFamily="Inter, sans-serif"
                                textAlign="center"
                            >
                                {option.label}
                            </Text>
                        </Box>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default StatusTabs; 