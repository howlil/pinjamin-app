import { Box, Container, Heading, Text, SimpleGrid, Card, CardBody, VStack, HStack, Badge } from '@chakra-ui/react';

const SchedulePage = () => {
    const schedules = [
        {
            day: 'Senin - Jumat',
            hours: '08:00 - 20:00',
            status: 'open',
            services: ['Peminjaman', 'Pengembalian', 'Ruang Baca', 'Internet']
        },
        {
            day: 'Sabtu',
            hours: '08:00 - 17:00',
            status: 'open',
            services: ['Peminjaman', 'Pengembalian', 'Ruang Baca']
        },
        {
            day: 'Minggu',
            hours: '10:00 - 15:00',
            status: 'limited',
            services: ['Ruang Baca']
        },
        {
            day: 'Hari Libur Nasional',
            hours: 'Tutup',
            status: 'closed',
            services: []
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'green';
            case 'limited':
                return 'yellow';
            case 'closed':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open':
                return 'Buka Penuh';
            case 'limited':
                return 'Layanan Terbatas';
            case 'closed':
                return 'Tutup';
            default:
                return '';
        }
    };

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={8} align="stretch">
                    <VStack spacing={4} textAlign="center">
                        <Heading size="xl" color="gray.800">
                            Jadwal Perpustakaan
                        </Heading>
                        <Text color="gray.600" fontSize="lg">
                            Jam operasional perpustakaan Universitas Andalas
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                        {schedules.map((schedule, index) => (
                            <Card key={index} variant="outline">
                                <CardBody>
                                    <VStack spacing={4} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontWeight="bold" fontSize="lg">
                                                {schedule.day}
                                            </Text>
                                            <Badge colorScheme={getStatusColor(schedule.status)}>
                                                {getStatusText(schedule.status)}
                                            </Badge>
                                        </HStack>

                                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                            {schedule.hours}
                                        </Text>

                                        {schedule.services.length > 0 && (
                                            <VStack align="start" spacing={1}>
                                                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                    Layanan tersedia:
                                                </Text>
                                                {schedule.services.map((service, idx) => (
                                                    <Text key={idx} fontSize="sm" color="gray.500">
                                                        • {service}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        )}
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Card bg="blue.50" variant="filled">
                        <CardBody>
                            <VStack spacing={3} align="start">
                                <Text fontWeight="bold" color="blue.800">
                                    Catatan Penting:
                                </Text>
                                <Text fontSize="sm" color="blue.700">
                                    • Perpustakaan dapat ditutup sewaktu-waktu untuk keperluan maintenance
                                </Text>
                                <Text fontSize="sm" color="blue.700">
                                    • Jam operasional dapat berubah saat periode ujian
                                </Text>
                                <Text fontSize="sm" color="blue.700">
                                    • Untuk informasi terkini, hubungi (0751) 123456
                                </Text>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    );
};

export default SchedulePage; 