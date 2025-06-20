import React from 'react';
import { VStack, HStack, Heading, Text, Box, Flex } from '@chakra-ui/react';

const ScheduleHeader = ({ apiData }) => {
    return (
        <>
            {/* Header */}
            <VStack spacing={4} textAlign="center">
                <Heading size="xl" color="#444444">
                    Jadwal Peminjaman Ruangan
                </Heading>
                <Text color="#444444" fontSize="lg" opacity={0.8}>
                    Kelola dan lihat jadwal peminjaman ruangan Universitas Andalas
                </Text>
                
                {/* Stats */}
                {apiData && (
                    <Flex
                        justify="center"
                        align="center"
                        gap={4}
                        flexWrap="wrap"
                    >
                        <VStack spacing={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="#749C73">
                                {apiData.totalBookings || 0}
                            </Text>
                            <Text fontSize="sm" color="#444444" opacity={0.7}>
                                Total Peminjaman
                            </Text>
                            <Text fontSize="xs" color="#444444" opacity={0.6}>
                                {apiData.month}/{apiData.year}
                            </Text>
                        </VStack>
                    </Flex>
                )}
            </VStack>

            {/* Legend */}
            <HStack spacing={6} justify="center" flexWrap="wrap">
                <HStack>
                    <Box w={4} h={4} bg="#749C73" borderRadius="sm" />
                    <Text fontSize="sm" color="#444444">Disetujui</Text>
                </HStack>
                <HStack>
                    <Box w={4} h={4} bg="#FFA500" borderRadius="sm" />
                    <Text fontSize="sm" color="#444444">Diproses</Text>
                </HStack>
                <HStack>
                    <Box w={4} h={4} bg="#888888" borderRadius="sm" />
                    <Text fontSize="sm" color="#444444">Selesai</Text>
                </HStack>
                <HStack>
                    <Box w={4} h={4} bg="#dc3545" borderRadius="sm" />
                    <Text fontSize="sm" color="#444444">Ditolak</Text>
                </HStack>
            </HStack>
        </>
    );
};

export default ScheduleHeader; 