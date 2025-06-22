import React from 'react';
import { SimpleGrid, Box, HStack, VStack, Text, Icon, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);

const UserStatsGrid = ({ stats = [] }) => {
    const gridColumns = useBreakpointValue({ base: 1, sm: 2, lg: 4 });
    const cardPadding = useBreakpointValue({ base: 4, md: 5 });

    return (
        <SimpleGrid columns={gridColumns} spacing={{ base: 3, md: 4 }}>
            {stats.map((stat, index) => (
                <MotionBox
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    whileHover={{
                        y: -3,
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                >
                    <Box
                        bg="rgba(255, 255, 255, 0.08)"
                        backdropFilter="blur(16px)"
                        border="1px solid rgba(255, 255, 255, 0.12)"
                        borderRadius="16px"
                        boxShadow="0 8px 32px rgba(116, 156, 115, 0.08)"
                        p={cardPadding}
                        position="relative"
                        overflow="hidden"
                        _hover={{
                            borderColor: "rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 12px 40px rgba(116, 156, 115, 0.12)"
                        }}
                        style={{ transition: "all 0.3s ease" }}
                        cursor="pointer"
                    >
                        {/* Background Pattern */}
                        <AnimatedGridPattern
                            numSquares={6}
                            maxOpacity={0.03}
                            duration={4}
                            repeatDelay={2}
                            className="absolute inset-0 h-full w-full fill-[#749c73]/6 stroke-[#749c73]/3"
                        />

                        <HStack spacing={4} position="relative" zIndex={1}>
                            <Box
                                w={12}
                                h={12}
                                borderRadius="12px"
                                bg={`${stat.color}15`}
                                border={`1px solid ${stat.color}30`}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                                _before={{
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bg: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`,
                                    borderRadius: '12px'
                                }}
                            >
                                <Icon
                                    as={stat.icon}
                                    boxSize={6}
                                    color={stat.color}
                                    position="relative"
                                    zIndex={1}
                                />
                            </Box>
                            <VStack align="start" spacing={0} flex={1}>
                                <Text
                                    fontSize="xs"
                                    color="#666666"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                >
                                    {stat.title}
                                </Text>
                                <Text
                                    fontSize={{ base: "xl", md: "2xl" }}
                                    fontWeight="bold"
                                    color="#444444"
                                    lineHeight="1.2"
                                >
                                    {stat.value}
                                </Text>
                            </VStack>
                        </HStack>
                    </Box>
                </MotionBox>
            ))}
        </SimpleGrid>
    );
};

export default UserStatsGrid; 