import React from 'react';
import { Box, VStack, HStack, Text, Badge, Icon, useBreakpointValue } from '@chakra-ui/react';
import { Book, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const BorrowedBooksCard = ({ books = [] }) => {
  const cardPadding = useBreakpointValue({ base: 4, md: 5 });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'due-soon':
        return {
          colorScheme: 'orange',
          bg: 'rgba(255, 165, 0, 0.15)',
          color: '#ff8c00',
          border: '1px solid rgba(255, 165, 0, 0.2)',
          label: 'Segera Jatuh Tempo'
        };
      case 'overdue':
        return {
          colorScheme: 'red',
          bg: 'rgba(255, 0, 0, 0.15)',
          color: '#dc3545',
          border: '1px solid rgba(255, 0, 0, 0.2)',
          label: 'Terlambat'
        };
      default:
        return {
          colorScheme: 'green',
          bg: 'rgba(116, 156, 115, 0.15)',
          color: COLORS.primary,
          border: '1px solid rgba(116, 156, 115, 0.2)',
          label: 'Aktif'
        };
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      bg="rgba(255, 255, 255, 0.08)"
      backdropFilter="blur(16px)"
      border="1px solid rgba(255, 255, 255, 0.12)"
      borderRadius="20px"
      boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
      p={cardPadding}
      position="relative"
      overflow="hidden"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
      }}
      style={{ transition: "all 0.3s ease" }}
    >
      {/* Background Pattern */}
      <AnimatedGridPattern
        numSquares={16}
        maxOpacity={0.04}
        duration={6}
        repeatDelay={3}
        className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
      />

      <Box position="relative" zIndex={1}>
        <HStack justify="space-between" align="center" mb={5}>
          <HStack spacing={3}>
            <Box
              w={10}
              h={10}
              borderRadius="12px"
              bg="rgba(116, 156, 115, 0.15)"
              border="1px solid rgba(116, 156, 115, 0.2)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={Book} boxSize={5} color={COLORS.primary} />
            </Box>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="#444444"
            >
              Buku Dipinjam
            </Text>
          </HStack>
          <Badge
            bg="rgba(116, 156, 115, 0.15)"
            color={COLORS.primary}
            border="1px solid rgba(116, 156, 115, 0.2)"
            px={3}
            py={1}
            borderRadius="8px"
            fontSize="xs"
            fontWeight="semibold"
          >
            {books.length} Buku
          </Badge>
        </HStack>

        <VStack align="stretch" spacing={3}>
          {books.length === 0 ? (
            <Box
              textAlign="center"
              py={8}
              color="#666666"
            >
              <Icon as={Book} boxSize={8} mb={3} color="#999999" />
              <Text fontSize="sm" fontWeight="medium">
                Tidak ada buku yang sedang dipinjam
              </Text>
            </Box>
          ) : (
            books.map((book, index) => {
              const statusConfig = getStatusConfig(book.status);

              return (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                >
                  <HStack
                    justify="space-between"
                    p={4}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(8px)"
                    border="1px solid rgba(255, 255, 255, 0.15)"
                    borderRadius="12px"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.15)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 20px rgba(116, 156, 115, 0.1)"
                    }}
                    style={{ transition: "all 0.2s ease" }}
                    cursor="pointer"
                  >
                    <VStack align="start" spacing={1} flex={1}>
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        color="#444444"
                        noOfLines={1}
                      >
                        {book.title}
                      </Text>
                      <HStack spacing={2}>
                        <Icon as={Clock} boxSize={3} color="#666666" />
                        <Text
                          fontSize="xs"
                          color="#666666"
                          fontWeight="medium"
                        >
                          Jatuh tempo: {book.dueDate}
                        </Text>
                      </HStack>
                    </VStack>
                    <Badge
                      bg={statusConfig.bg}
                      color={statusConfig.color}
                      border={statusConfig.border}
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="6px"
                      fontWeight="semibold"
                    >
                      {statusConfig.label}
                    </Badge>
                  </HStack>
                </MotionBox>
              );
            })
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default BorrowedBooksCard; 