import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    VStack,
    HStack,
    Icon,
    Badge
} from '@chakra-ui/react';
import { BookOpen, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../utils/store';

const DashboardPage = () => {
    const { user } = useAuthStore();

    const stats = [
        {
            title: 'Buku Dipinjam',
            value: '3',
            icon: BookOpen,
            color: 'blue.500',
            bgColor: 'blue.50'
        },
        {
            title: 'Akan Jatuh Tempo',
            value: '1',
            icon: Clock,
            color: 'yellow.500',
            bgColor: 'yellow.50'
        },
        {
            title: 'Denda Aktif',
            value: 'Rp 10.000',
            icon: AlertCircle,
            color: 'red.500',
            bgColor: 'red.50'
        },
        {
            title: 'Total Dipinjam',
            value: '24',
            icon: CheckCircle,
            color: 'green.500',
            bgColor: 'green.50'
        }
    ];

    const recentBooks = [
        { title: 'Design Patterns', dueDate: '2024-02-01', status: 'active' },
        { title: 'Clean Architecture', dueDate: '2024-02-05', status: 'active' },
        { title: 'The Pragmatic Programmer', dueDate: '2024-01-30', status: 'due-soon' }
    ];

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={8} align="stretch">
                    <Box>
                        <Heading size="lg" mb={2}>
                            Selamat datang, {user?.name || 'User'}!
                        </Heading>
                        <Text color="gray.600">
                            Berikut adalah ringkasan aktivitas perpustakaan Anda
                        </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
                        {stats.map((stat, index) => (
                            <Card key={index}>
                                <CardBody>
                                    <HStack spacing={4}>
                                        <Box
                                            p={3}
                                            bg={stat.bgColor}
                                            borderRadius="lg"
                                        >
                                            <Icon
                                                as={stat.icon}
                                                w={6}
                                                h={6}
                                                color={stat.color}
                                            />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="sm" color="gray.600">
                                                {stat.title}
                                            </Text>
                                            <Text fontSize="2xl" fontWeight="bold">
                                                {stat.value}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Card>
                        <CardBody>
                            <VStack align="stretch" spacing={4}>
                                <Text fontWeight="bold" fontSize="lg">
                                    Buku yang Sedang Dipinjam
                                </Text>
                                {recentBooks.map((book, index) => (
                                    <HStack
                                        key={index}
                                        justify="space-between"
                                        p={3}
                                        bg="gray.50"
                                        borderRadius="md"
                                    >
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="medium">{book.title}</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Jatuh tempo: {book.dueDate}
                                            </Text>
                                        </VStack>
                                        <Badge
                                            colorScheme={book.status === 'due-soon' ? 'yellow' : 'blue'}
                                        >
                                            {book.status === 'due-soon' ? 'Segera Jatuh Tempo' : 'Aktif'}
                                        </Badge>
                                    </HStack>
                                ))}
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    );
};

export default DashboardPage; 