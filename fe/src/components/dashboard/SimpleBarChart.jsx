import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { COLORS } from '@/utils/designTokens';

// Default chart data - would typically come from props or a data hook
const defaultChartData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 59 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 81 },
  { month: 'Mei', value: 56 },
  { month: 'Jun', value: 55 }
];

const SimpleBarChart = ({ data = defaultChartData, height = "200px" }) => {
  return (
    <Box pt={6}>
      <Flex h={height} alignItems="flex-end" justifyContent="space-between">
        {data.map((item) => (
          <Flex
            key={item.month}
            direction="column"
            alignItems="center"
            height="100%"
            flex={1}
          >
            <Box
              h={`${item.value}%`}
              w="60%"
              bg={`rgba(${COLORS.primary.replace('#', '').match(/../g).map(hex => parseInt(hex, 16)).join(', ')}, ${(item.value / 100) * 0.8 + 0.2})`}
              borderRadius="md"
              transition="height 0.3s"
              _hover={{ transform: 'scale(1.05)' }}
            />
            <Text mt={2} fontSize="xs" color="gray.500">{item.month}</Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default SimpleBarChart; 