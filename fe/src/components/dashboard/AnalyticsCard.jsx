import React from 'react';
import { Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Icon, useBreakpointValue } from '@chakra-ui/react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SimpleBarChart from './SimpleBarChart';
import { COLORS } from '../../utils/designTokens';

const MotionBox = motion(Box);

const AnalyticsCard = ({
    bookingsData = [],
    transactionsData = []
}) => {
    const cardPadding = useBreakpointValue({ base: 4, md: 5 });

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
        >


            <Box position="relative" zIndex={1}>
                <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    color="#444444"
                    mb={5}
                >
                    Statistik Peminjaman
                </Text>

                <Tabs variant="unstyled" isLazy>
                    <TabList
                        bg="rgba(255, 255, 255, 0.1)"
                        backdropFilter="blur(8px)"
                        border="1px solid rgba(255, 255, 255, 0.15)"
                        borderRadius="12px"
                        p={1}
                        mb={5}
                    >
                        <Tab
                            fontSize="sm"
                            fontWeight="medium"
                            borderRadius="8px"
                            color="#666666"
                            _selected={{
                                bg: "rgba(116, 156, 115, 0.15)",
                                color: COLORS.primary,
                                border: "1px solid rgba(116, 156, 115, 0.2)",
                                boxShadow: "0 2px 8px rgba(116, 156, 115, 0.1)"
                            }}
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.1)",
                                color: "#444444"
                            }}
                            transition="all 0.2s ease"
                            flex={1}
                        >
                            <HStack spacing={2}>
                                <Icon as={BarChart3} boxSize={4} />
                                <Text>Peminjaman</Text>
                            </HStack>
                        </Tab>
                        <Tab
                            fontSize="sm"
                            fontWeight="medium"
                            borderRadius="8px"
                            color="#666666"
                            _selected={{
                                bg: "rgba(116, 156, 115, 0.15)",
                                color: COLORS.primary,
                                border: "1px solid rgba(116, 156, 115, 0.2)",
                                boxShadow: "0 2px 8px rgba(116, 156, 115, 0.1)"
                            }}
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.1)",
                                color: "#444444"
                            }}
                            transition="all 0.2s ease"
                            flex={1}
                        >
                            <HStack spacing={2}>
                                <Icon as={TrendingUp} boxSize={4} />
                                <Text>Transaksi</Text>
                            </HStack>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel p={0}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Text
                                    color="#666666"
                                    fontSize="sm"
                                    mb={4}
                                    fontWeight="medium"
                                >
                                    Jumlah peminjaman per bulan
                                </Text>
                                {bookingsData.length > 0 ? (
                                    <SimpleBarChart data={bookingsData} />
                                ) : (
                                    <Box
                                        h="200px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        color="#666666"
                                    >
                                        <Text fontSize="sm">Tidak ada data peminjaman</Text>
                                    </Box>
                                )}
                            </motion.div>
                        </TabPanel>
                        <TabPanel p={0}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Text
                                    color="#666666"
                                    fontSize="sm"
                                    mb={4}
                                    fontWeight="medium"
                                >
                                    Jumlah transaksi per bulan
                                </Text>
                                {transactionsData.length > 0 ? (
                                    <SimpleBarChart data={transactionsData} />
                                ) : (
                                    <Box
                                        h="200px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        color="#666666"
                                    >
                                        <Text fontSize="sm">Tidak ada data transaksi</Text>
                                    </Box>
                                )}
                            </motion.div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </MotionBox>
    );
};

export default AnalyticsCard; 