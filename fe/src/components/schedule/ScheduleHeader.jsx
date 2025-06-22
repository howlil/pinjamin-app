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
             
            </HStack>
        </>
    );
};

export default ScheduleHeader; 