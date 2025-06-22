import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS } from '../../utils/designTokens';

const MotionBox = motion(Box);

const SimpleBarChart = ({ data = [], height = "180px" }) => {
  // Return empty state if no data
  if (!data || data.length === 0) {
    return (
      <Box
        h={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="#666666"
      >
        <Text fontSize="sm">Tidak ada data untuk ditampilkan</Text>
      </Box>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <Box pt={4}>
      <Flex h={height} alignItems="flex-end" justifyContent="space-between" gap={2}>
        {data.map((item, index) => (
          <Flex
            key={item.month || item.name || index}
            direction="column"
            alignItems="center"
            height="100%"
            flex={1}
          >
            <MotionBox
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: `${(item.value / maxValue) * 80}%`,
                opacity: 1
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              w="85%"
              bg={`linear-gradient(180deg, ${COLORS.primary}, rgba(116, 156, 115, 0.7))`}
              borderRadius="6px 6px 2px 2px"
              position="relative"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: `0 4px 12px rgba(116, 156, 115, 0.3)`
              }}
              style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              cursor="pointer"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '30%',
                bg: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <Text
                position="absolute"
                top="-24px"
                left="50%"
                transform="translateX(-50%)"
                fontSize="xs"
                fontWeight="semibold"
                color="#444444"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s ease"
              >
                {item.value}
              </Text>
            </MotionBox>
            <Text
              mt={3}
              fontSize="xs"
              color="#666666"
              fontWeight="medium"
              textAlign="center"
            >
              {item.month || item.name || `Item ${index + 1}`}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default SimpleBarChart; 