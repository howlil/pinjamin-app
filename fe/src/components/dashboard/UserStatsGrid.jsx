import React from 'react';
import { SimpleGrid, Card, CardBody, HStack, Box, VStack, Text, Icon } from '@chakra-ui/react';

const UserStatsGrid = ({ stats }) => {
    return (
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
    );
};

export default UserStatsGrid; 