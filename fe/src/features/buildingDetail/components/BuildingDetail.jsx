import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Image,
    Grid,
    GridItem,
    IconButton,
    Badge,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useDisclosure
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Phone, Mail } from 'lucide-react';
import { PrimaryButton } from '@shared/components/Button';
import Card from '@shared/components/Card';
import { H1, H2, H3, H4, Subtitle, Label, MutedText, Text as CustomText } from '@shared/components/Typography';
import { COLORS } from '@utils/designTokens';
import { useBuildingDetail, useBuildingSchedule } from '../api/useBuildingDetail';
import BookingDetailModal from './BookingDetailModal';
import BookingFormModal from './BookingFormModal';

const BuildingCalendar = ({ buildingId, selectedDate, onDateSelect, onDateClick, onBookingRequest, onMainBookingRequest }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const { schedule, loading: scheduleLoading } = useBuildingSchedule(buildingId, currentMonth, currentYear);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));

        const days = [];
        const currentDateToCompare = new Date();
        currentDateToCompare.setHours(0, 0, 0, 0);

        for (let i = 0; i < 42; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);

            const isCurrentMonth = day.getMonth() === month;
            const isPast = day < currentDateToCompare;

            const dateStatus = getDateStatus(day);
            days.push({
                date: day.getDate(),
                fullDate: day,
                isCurrentMonth,
                isPast,
                status: dateStatus.status,
                booking: dateStatus.booking
            });
        }

        return days;
    };

    const getDateStatus = (date) => {
        const dateStr = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');

        const booking = schedule.find(item => item.startDate === dateStr);

        if (!booking) return { status: 'available', booking: null };

        if (booking.status === 'APPROVED' || booking.status === 'COMPLETED') return { status: 'booked', booking };
        if (booking.status === 'PROCESSING') return { status: 'pending', booking };

        return { status: 'available', booking: null };
    };

    const getStatusColor = (status, isPast) => {
        if (isPast) return 'gray.200';

        switch (status) {
            case 'booked':
                return COLORS.primary;
            case 'pending':
                return '#FF8A00';
            default:
                return 'transparent';
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const days = getDaysInMonth(currentDate);

    return (
        <Box
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(15px)"
            borderRadius="24px"
            border="1px solid rgba(215, 215, 215, 0.5)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
            p={6}
            h="100%"
            display="flex"
            flexDirection="column"
        >
            <VStack spacing={4} align="stretch" flex={1} justify="space-between">
                <HStack justify="space-between" align="center">
                    <H2 fontSize="lg" mb={0} color="#2A2A2A">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </H2>
                    <HStack>
                        <IconButton
                            icon={<ChevronLeft size={16} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => navigateMonth(-1)}
                            isDisabled={scheduleLoading}
                        />
                        <IconButton
                            icon={<ChevronRight size={16} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => navigateMonth(1)}
                            isDisabled={scheduleLoading}
                        />
                    </HStack>
                </HStack>

                <Box flex={1}>
                    <Grid templateColumns="repeat(7, 1fr)" gap={1} h="100%">
                        {dayNames.map((day) => (
                            <GridItem key={day}>
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color="gray.500"
                                    textAlign="center"
                                    p={2}
                                >
                                    {day}
                                </Text>
                            </GridItem>
                        ))}

                        {days.map((day, index) => (
                            <GridItem key={index}>
                                <Box
                                    as="button"
                                    w="100%"
                                    h="40px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    bg={getStatusColor(day.status, day.isPast)}
                                    color={day.status !== 'available' && !day.isPast ? 'white' : 'inherit'}
                                    opacity={day.isCurrentMonth ? 1 : 0.3}
                                    fontSize="sm"
                                    borderRadius="md"
                                    cursor={day.isPast ? 'not-allowed' : 'pointer'}
                                    _hover={{
                                        bg: day.isPast ? 'gray.200' : getStatusColor(day.status, false) || 'gray.100'
                                    }}
                                    onClick={() => {
                                        if (!day.isPast) {
                                            if (onDateSelect) onDateSelect(day.fullDate);
                                            if (day.status === 'available' && onBookingRequest) {
                                                onBookingRequest(day.fullDate);
                                            } else if (onDateClick) {
                                                onDateClick(day.fullDate, day.booking);
                                            }
                                        }
                                    }}
                                    disabled={day.isPast}
                                    title={
                                        day.isPast
                                            ? 'Tanggal sudah lewat'
                                            : day.status === 'available'
                                                ? 'Klik untuk ajukan peminjaman'
                                                : day.status === 'booked'
                                                    ? 'Sudah dipinjam - klik untuk detail'
                                                    : 'Sedang diproses - klik untuk detail'
                                    }
                                >
                                    {day.date}
                                </Box>
                            </GridItem>
                        ))}
                    </Grid>
                </Box>

                <VStack spacing={3} align="start">
                    <CustomText fontSize="sm" fontWeight="600" color="#2A2A2A">
                        Keterangan Status Peminjaman
                    </CustomText>

                    <VStack spacing={2} align="start">
                        <HStack spacing={2}>
                            <Box w={3} h={3} bg="#21D179" borderRadius="full" />
                            <CustomText fontSize="sm" color="#2A2A2A">
                                Sudah dipinjam
                            </CustomText>
                        </HStack>

                        <HStack spacing={2}>
                            <Box w={3} h={3} bg="#FF8C00" borderRadius="full" />
                            <CustomText fontSize="sm" color="#2A2A2A">
                                Sedang diproses
                            </CustomText>
                        </HStack>
                    </VStack>
                </VStack>

                <PrimaryButton
                    size="lg"
                    w="100%"
                    onClick={onMainBookingRequest}
                >
                    Ajukan peminjaman
                </PrimaryButton>
            </VStack>
        </Box>
    );
};

const BuildingDetail = ({ buildingId }) => {
    const { building, loading, error } = useBuildingDetail(buildingId);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isBookingOpen,
        onOpen: onBookingOpen,
        onClose: onBookingClose
    } = useDisclosure();

    const handleDateClick = (date, booking) => {
        setSelectedDate(date);
        setSelectedBooking(booking);
        onOpen();
    };

    const handleCloseModal = () => {
        onClose();
        setSelectedDate(null);
        setSelectedBooking(null);
    };

    const handleBookingRequest = () => {
        onBookingOpen();
    };

    const handleDateBookingRequest = (date) => {
        setSelectedDate(date);
        onBookingOpen();
    };

    if (loading) {
        return (
            <Box p={8}>
                <Text>Memuat detail gedung...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={8}>
                <Text color="red.500">Error: {error}</Text>
            </Box>
        );
    }

    if (!building) {
        return (
            <Box p={8}>
                <Text>Gedung tidak ditemukan</Text>
            </Box>
        );
    }

    return (
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6} align="stretch">
            {/* Left Side - Building Info */}
            <Box w={{ base: '100%', lg: '50%' }}>
                <Box
                    bg="rgba(255, 255, 255, 0.8)"
                    backdropFilter="blur(15px)"
                    borderRadius="24px"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    overflow="hidden"
                    h={{ base: 'auto', lg: '700px' }}
                >
                    <Box h="100%" display="flex" flexDirection="column">
                        {/* Building Image */}
                        <Box w="100%">
                            <Image
                                src={building.buildingPhoto || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop'}
                                alt={building.buildingName}
                                w="100%"
                                h="280px"
                                objectFit="cover"
                            />
                        </Box>

                        {/* Building Header Info */}
                        <VStack spacing={4} align="start" p={6} pb={4}>
                            <VStack align="start" spacing={3} w="100%">
                                <HStack spacing={3} align="center">
                                    <Badge
                                        bg="#21D179"
                                        color="white"
                                        borderRadius="20px"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="600"
                                    >
                                        {building.buildingType}
                                    </Badge>
                                </HStack>
                                <H1 fontSize="2xl" color="#2A2A2A" fontWeight="700" mb={0}>
                                    {building.buildingName}
                                </H1>
                            </VStack>

                            {/* Quick Stats */}
                            <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%">
                                <VStack spacing={1} align="start"
                                    bg="rgba(33, 209, 121, 0.05)"
                                    borderRadius="12px"
                                    p={3}
                                >
                                    <CustomText fontSize="xs" color="#2A2A2A" opacity={0.6} fontWeight="600">
                                        HARGA SEWA
                                    </CustomText>
                                    <CustomText fontWeight="700" fontSize="lg" color="#21D179">
                                        Rp {building.rentalPrice?.toLocaleString('id-ID')}
                                    </CustomText>
                                </VStack>

                                <VStack spacing={1} align="start"
                                    bg="rgba(33, 209, 121, 0.05)"
                                    borderRadius="12px"
                                    p={3}
                                >
                                    <CustomText fontSize="xs" color="#2A2A2A" opacity={0.6} fontWeight="600">
                                        KAPASITAS
                                    </CustomText>
                                    <CustomText fontWeight="700" fontSize="lg" color="#2A2A2A">
                                        {building.capacity} Orang
                                    </CustomText>
                                </VStack>

                                <VStack spacing={1} align="start"
                                    bg="rgba(33, 209, 121, 0.05)"
                                    borderRadius="12px"
                                    p={3}
                                >
                                    <CustomText fontSize="xs" color="#2A2A2A" opacity={0.6} fontWeight="600">
                                        LOKASI
                                    </CustomText>
                                    <CustomText fontWeight="700" fontSize="lg" color="#2A2A2A" noOfLines={2}>
                                        {building.location}
                                    </CustomText>
                                </VStack>
                            </Grid>
                        </VStack>

                        {/* Tab System */}
                        <Tabs variant="unstyled" flex={1} display="flex" flexDirection="column">
                            <TabList
                                bg="rgba(33, 209, 121, 0.05)"
                                borderTop="1px solid rgba(215, 215, 215, 0.3)"
                                px={6}
                            >
                                <Tab
                                    fontWeight="600"
                                    color="#2A2A2A"
                                    opacity={0.6}
                                    _selected={{
                                        color: "#21D179",
                                        opacity: 1,
                                        borderBottom: "2px solid #21D179"
                                    }}
                                    _hover={{ opacity: 0.8 }}
                                    px={0}
                                    mr={6}
                                >
                                    Deskripsi
                                </Tab>
                                <Tab
                                    fontWeight="600"
                                    color="#2A2A2A"
                                    opacity={0.6}
                                    _selected={{
                                        color: "#21D179",
                                        opacity: 1,
                                        borderBottom: "2px solid #21D179"
                                    }}
                                    _hover={{ opacity: 0.8 }}
                                    px={0}
                                    mr={6}
                                >
                                    Fasilitas
                                </Tab>
                                <Tab
                                    fontWeight="600"
                                    color="#2A2A2A"
                                    opacity={0.6}
                                    _selected={{
                                        color: "#21D179",
                                        opacity: 1,
                                        borderBottom: "2px solid #21D179"
                                    }}
                                    _hover={{ opacity: 0.8 }}
                                    px={0}
                                    mr={6}
                                >
                                    Pengelola
                                </Tab>
                            </TabList>

                            <TabPanels flex={1} overflow="hidden">
                                {/* Deskripsi Tab */}
                                <TabPanel p={6} h="100%" overflowY="auto">
                                    <VStack align="start" spacing={3} w="100%">
                                        <H3 fontSize="lg" color="#2A2A2A" fontWeight="700">
                                            Tentang Gedung
                                        </H3>
                                        <CustomText color="#2A2A2A" lineHeight="1.6" fontSize="sm">
                                            {building.description}
                                        </CustomText>
                                    </VStack>
                                </TabPanel>

                                {/* Fasilitas Tab */}
                                <TabPanel p={6} h="100%" overflowY="auto">
                                    <VStack align="start" spacing={3} w="100%">
                                        <H3 fontSize="lg" color="#2A2A2A" fontWeight="700">
                                            Fasilitas Tersedia
                                        </H3>
                                        <Grid templateColumns="repeat(2, 1fr)" gap={2} w="100%">
                                            {(building.facilities?.length > 0 ?
                                                building.facilities.map(f => f.facilityName) :
                                                ['Air Conditioner', 'WiFi', 'Projector', 'Sound System', 'Kursi', 'Meja', 'Dispenser', 'Kipas Angin']
                                            ).map((facility, index) => (
                                                <HStack key={index} spacing={2}>
                                                    <Box w="6px" h="6px" bg="#21D179" borderRadius="full" />
                                                    <CustomText fontSize="sm" color="#2A2A2A">
                                                        {facility}
                                                    </CustomText>
                                                </HStack>
                                            ))}
                                        </Grid>
                                    </VStack>
                                </TabPanel>

                                {/* Pengelola Tab */}
                                <TabPanel p={6} h="100%" overflowY="auto">
                                    <VStack align="start" spacing={3} w="100%">
                                        <H3 fontSize="lg" color="#2A2A2A" fontWeight="700">
                                            Pengelola Gedung
                                        </H3>
                                        {building.buildingManagers?.length > 0 ? (
                                            <VStack spacing={3} align="stretch" w="100%">
                                                {building.buildingManagers.map((manager, index) => (
                                                    <Box
                                                        key={index}
                                                        bg="rgba(33, 209, 121, 0.05)"
                                                        borderRadius="12px"
                                                        p={4}
                                                    >
                                                        <VStack align="start" spacing={2}>
                                                            <H4 fontSize="md" fontWeight="700" color="#2A2A2A">
                                                                {manager.managerName}
                                                            </H4>
                                                            <HStack spacing={4} flexWrap="wrap">
                                                                <HStack spacing={2}>
                                                                    <Phone size={14} color="#21D179" />
                                                                    <CustomText fontSize="sm" color="#2A2A2A">
                                                                        {manager.phoneNumber}
                                                                    </CustomText>
                                                                </HStack>
                                                                {manager.email && (
                                                                    <HStack spacing={2}>
                                                                        <Mail size={14} color="#21D179" />
                                                                        <CustomText fontSize="sm" color="#2A2A2A">
                                                                            {manager.email}
                                                                        </CustomText>
                                                                    </HStack>
                                                                )}
                                                            </HStack>
                                                        </VStack>
                                                    </Box>
                                                ))}
                                            </VStack>
                                        ) : (
                                            <CustomText fontSize="sm" color="#2A2A2A" opacity={0.7}>
                                                Informasi pengelola belum tersedia
                                            </CustomText>
                                        )}
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Box>
            </Box>

            {/* Right Side - Calendar */}
            <Box w={{ base: '100%', lg: '50%' }} h={{ base: 'auto', lg: '700px' }}>
                <BuildingCalendar
                    buildingId={buildingId}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    onDateClick={handleDateClick}
                    onBookingRequest={handleDateBookingRequest}
                    onMainBookingRequest={handleBookingRequest}
                />
            </Box>

            {/* Booking Detail Modal */}
            <BookingDetailModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                booking={selectedBooking}
                selectedDate={selectedDate}
            />

            {/* Booking Form Modal */}
            <BookingFormModal
                isOpen={isBookingOpen}
                onClose={onBookingClose}
                buildingId={buildingId}
                buildingName={building?.buildingName}
                selectedDate={selectedDate}
            />
        </Flex>
    );
};

export default BuildingDetail; 