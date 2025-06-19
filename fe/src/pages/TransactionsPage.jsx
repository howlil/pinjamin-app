import { Box, Container, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, VStack, HStack, Button } from '@chakra-ui/react';

const TransactionsPage = () => {
    const transactions = [
        {
            id: 1,
            date: '2024-01-22',
            description: 'Denda keterlambatan - Clean Code',
            amount: 15000,
            status: 'paid',
            type: 'fine'
        },
        {
            id: 2,
            date: '2024-01-25',
            description: 'Biaya kartu anggota baru',
            amount: 50000,
            status: 'paid',
            type: 'fee'
        },
        {
            id: 3,
            date: '2024-01-28',
            description: 'Denda keterlambatan - Design Patterns',
            amount: 10000,
            status: 'pending',
            type: 'fine'
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return <Badge colorScheme="green">Lunas</Badge>;
            case 'pending':
                return <Badge colorScheme="yellow">Belum Bayar</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'fine':
                return <Badge variant="outline" colorScheme="red">Denda</Badge>;
            case 'fee':
                return <Badge variant="outline" colorScheme="blue">Biaya</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const totalPending = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="gray.800">
                                Transaksi
                            </Heading>
                            <Text color="gray.600">
                                Riwayat pembayaran dan denda
                            </Text>
                        </VStack>

                        {totalPending > 0 && (
                            <VStack align="end" spacing={1}>
                                <Text fontSize="sm" color="gray.600">Total yang harus dibayar:</Text>
                                <Text fontSize="xl" fontWeight="bold" color="red.500">
                                    {formatCurrency(totalPending)}
                                </Text>
                                <Button size="sm" colorScheme="green">
                                    Bayar Sekarang
                                </Button>
                            </VStack>
                        )}
                    </HStack>

                    <Box overflowX="auto" bg="white" rounded="lg" shadow="sm" border="1px" borderColor="gray.200">
                        <Table variant="simple">
                            <Thead bg="gray.50">
                                <Tr>
                                    <Th>No</Th>
                                    <Th>Tanggal</Th>
                                    <Th>Keterangan</Th>
                                    <Th>Jenis</Th>
                                    <Th isNumeric>Jumlah</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {transactions.map((item, index) => (
                                    <Tr key={item.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{item.date}</Td>
                                        <Td>{item.description}</Td>
                                        <Td>{getTypeBadge(item.type)}</Td>
                                        <Td isNumeric fontWeight="medium">
                                            {formatCurrency(item.amount)}
                                        </Td>
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

export default TransactionsPage; 