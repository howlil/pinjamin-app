import React from 'react';
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    VStack,
    Text
} from '@chakra-ui/react';
import { COLORS } from '../../utils/designTokens';
import BookingCard from './BookingCard';

const BookingTabs = ({ bookings }) => {
    return (
        <Tabs variant="soft-rounded" colorScheme="green">
            <TabList
                borderBottom="1px solid"
                borderColor="gray.200"
                overflowX="auto"
                py={2}
                sx={{
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}
            >
                <Tab
                    _selected={{
                        color: 'white',
                        bg: COLORS.primary,
                    }}
                    borderRadius="md"
                    mx={1}
                >
                    Diproses
                </Tab>
                <Tab
                    _selected={{
                        color: 'white',
                        bg: COLORS.primary,
                    }}
                    borderRadius="md"
                    mx={1}
                >
                    Disetujui
                </Tab>
                <Tab
                    _selected={{
                        color: 'white',
                        bg: COLORS.primary,
                    }}
                    borderRadius="md"
                    mx={1}
                >
                    Ditolak
                </Tab>
                <Tab
                    _selected={{
                        color: 'white',
                        bg: COLORS.primary,
                    }}
                    borderRadius="md"
                    mx={1}
                >
                    Selesai
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel p={0} pt={4}>
                    <VStack spacing={4} align="stretch">
                        {bookings.map(booking => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </VStack>
                </TabPanel>

                <TabPanel p={0} pt={4}>
                    <VStack spacing={4} align="stretch">
                        {/* Similar content would go in other tabs */}
                        <Text>Tab content for Disetujui</Text>
                    </VStack>
                </TabPanel>

                <TabPanel p={0} pt={4}>
                    <VStack spacing={4} align="stretch">
                        <Text>Tab content for Ditolak</Text>
                    </VStack>
                </TabPanel>

                <TabPanel p={0} pt={4}>
                    <VStack spacing={4} align="stretch">
                        <Text>Tab content for Selesai</Text>
                    </VStack>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default BookingTabs; 