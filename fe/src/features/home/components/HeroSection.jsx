import React from 'react';
import {
    Box,
    Container,
    Grid,
    GridItem,
    VStack,
    HStack,
    Button
} from '@chakra-ui/react';
import Card from '@shared/components/Card';
import { CardSkeleton } from '@shared/components/LoadingSkeleton';
import ErrorState from '@shared/components/ErrorState';
import { H1, H2, Subtitle,  } from '@shared/components/Typography';
import AnimatedGridPattern from '@shared/components/AnimatedGridPattern';
import AnimatedList, { BookingCard } from '@shared/components/AnimatedList';
import { BookingsEmptyState } from '@shared/components/EmptyState';
import AvailabilityChecker from './AvailabilityChecker';

let motion;
try {
    motion = require('framer-motion').motion;
} catch (error) {
    motion = {
        div: ({ children, initial, animate, transition, ...props }) => (
            <div {...props}>{children}</div>
        )
    };
}

const HeroSection = ({
    bookings,
    bookingsLoading,
    bookingsError,
    refetch,
    availableBuildings,
    availabilityLoading,
    availabilityError,
    checkAvailability
}) => {
    return (
        <Box
            position="relative"
            minH="100vh"
            overflow="hidden"
        >
            {/* Animated Grid Background */}
            <AnimatedGridPattern />

            <Container maxW="7xl" py={8} position="relative" zIndex={1}>
                <Grid
                    templateColumns={{ base: "1fr", lg: "1fr 400px" }}
                    gap={8}
                    alignItems="start"
                    minH="calc(100vh - 140px)"
                >
                    {/* Left Section - Hero Content */}
                    <GridItem>
                        <VStack spacing={8} align="start" py={8}>
                            {/* Hero Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <VStack spacing={4} align="start">
                                    <H1 maxW="600px">
                                        Temukan & Sewa Gedung
                                        Ideal untuk Acara Anda
                                    </H1>

                                    <Subtitle maxW="500px">
                                        Mudah, Cepat, dan Praktis – Peminjaman Gedung
                                        Universitas Andalas
                                    </Subtitle>
                                </VStack>
                            </motion.div>

                            {/* Availability Checker */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <AvailabilityChecker
                                    availableBuildings={availableBuildings}
                                    loading={availabilityLoading}
                                    error={availabilityError}
                                    onCheckAvailability={checkAvailability}
                                />
                            </motion.div>
                        </VStack>
                    </GridItem>

                    {/* Right Section - Today's Bookings */}
                    <GridItem>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <Card
                                variant="transparent"
                                h="fit-content"
                                maxH="calc(100vh - 160px)"
                                overflow="hidden"
                            >
                                <VStack spacing={4} align="stretch">
                               
                                    {bookingsLoading ? (
                                        <CardSkeleton count={3} height="80px" />
                                    ) : bookings && bookings.length > 0 ? (
                                        <AnimatedList delay={300}>
                                            {bookings.map((booking, index) => (
                                                <BookingCard
                                                    key={booking.bookingId || booking.id || index}
                                                    booking={booking}
                                                    index={index}
                                                />
                                            ))}
                                        </AnimatedList>
                                    ) : (
                                        <BookingsEmptyState />
                                    )}

                                    {bookingsError && (
                                        <ErrorState
                                            variant="default"
                                            message="Gagal memuat data peminjaman"
                                            onRetry={refetch}
                                            retryText="Coba Lagi"
                                        />
                                    )}
                                </VStack>
                            </Card>
                        </motion.div>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
