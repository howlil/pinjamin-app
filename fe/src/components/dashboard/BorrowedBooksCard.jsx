import React from 'react';
import { Card, CardBody, VStack, HStack, Text, Badge } from '@chakra-ui/react';

const BorrowedBooksCard = ({ books }) => {
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Text fontWeight="bold" fontSize="lg">
            Buku yang Sedang Dipinjam
          </Text>
          {books.map((book, index) => (
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
  );
};

export default BorrowedBooksCard; 