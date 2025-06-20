import React from 'react';
import { Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Icon } from '@chakra-ui/react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SimpleBarChart from './SimpleBarChart';
import { GlassCard } from '@/components/ui';
import { COLORS, SHADOWS, RADII } from '@/utils/designTokens';

// Default chart data - would typically come from props or a data hook
const defaultBookingsData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 59 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 81 },
    { month: 'Mei', value: 56 },
    { month: 'Jun', value: 55 }
];

const defaultTransactionsData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 63 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 70 },
    { month: 'Mei', value: 75 },
    { month: 'Jun', value: 82 }
];

const AnalyticsCard = ({
    bookingsData = defaultBookingsData,
    transactionsData = defaultTransactionsData
}) => {
    return (
        <GlassCard p={6}>
            <Text
                fontSize="lg"
                fontWeight="semibold"
                color={COLORS.black}
                mb={6}
            >
                Statistik Peminjaman
            </Text>

            <Tabs variant="soft-rounded" colorScheme="green" isLazy>
                <TabList
                    bg={`${COLORS.primary}08`}
                    borderRadius="xl"
                    p={1}
                    mb={6}
                >
                    <Tab
                        fontSize="sm"
                        fontWeight="medium"
                        borderRadius="lg"
                        _selected={{
                            bg: COLORS.primary,
                            color: 'white',
                            boxShadow: SHADOWS.sm
                        }}
                        transition="all 0.2s"
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
                        borderRadius="lg"
                        _selected={{
                            bg: COLORS.primary,
                            color: 'white',
                            boxShadow: SHADOWS.sm
                        }}
                        transition="all 0.2s"
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
                                color={COLORS.gray[600]}
                                fontSize="sm"
                                mb={4}
                            >
                                Jumlah peminjaman per bulan
                            </Text>
                            <SimpleBarChart data={bookingsData} />
                        </motion.div>
                    </TabPanel>
                    <TabPanel p={0}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Text
                                color={COLORS.gray[600]}
                                fontSize="sm"
                                mb={4}
                            >
                                Jumlah transaksi per bulan
                            </Text>
                            <SimpleBarChart data={transactionsData} />
                        </motion.div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </GlassCard>
    );
};

export default AnalyticsCard; 