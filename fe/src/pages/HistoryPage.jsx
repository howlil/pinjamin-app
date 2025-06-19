import { Box, Container, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, VStack } from '@chakra-ui/react';

const HistoryPage = () => {
    const borrowHistory = [
        {
            id: 1,
            bookTitle: 'Introduction to Algorithms',
            borrowDate: '2024-01-15',
            returnDate: '2024-01-22',
            status: 'returned'
        },
        {
            id: 2,
            bookTitle: 'Clean Code',
            borrowDate: '2024-01-20',
            returnDate: '2024-01-27',
            status: 'returned'
        },
        {
            id: 3,
            bookTitle: 'Design Patterns',
            borrowDate: '2024-01-25',
            returnDate: '-',
            status: 'active'
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'returned':
                return <Badge colorScheme="green">Dikembalikan</Badge>;
            case 'active':
                return <Badge colorScheme="blue">Dipinjam</Badge>;
            case 'overdue':
                return <Badge colorScheme="red">Terlambat</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={6} align="stretch">
                    <Heading size="lg" color="gray.800">
                        Riwayat Peminjaman
                    </Heading>
                    <Text color="gray.600">
                        Daftar buku yang pernah Anda pinjam
                    </Text>

                    <Box overflowX="auto" bg="white" rounded="lg" shadow="sm" border="1px" borderColor="gray.200">
                        <Table variant="simple">
                            <Thead bg="gray.50">
                                <Tr>
                                    <Th>No</Th>
                                    <Th>Judul Buku</Th>
                                    <Th>Tanggal Pinjam</Th>
                                    <Th>Tanggal Kembali</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {borrowHistory.map((item, index) => (
                                    <Tr key={item.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{item.bookTitle}</Td>
                                        <Td>{item.borrowDate}</Td>
                                        <Td>{item.returnDate}</Td>
                                        <Td>{getStatusBadge(item.status)}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default HistoryPage; 