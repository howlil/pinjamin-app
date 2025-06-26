import React from 'react';
import {
    VStack,
    HStack,
    Text,
    Badge,
    Divider,
    Avatar,
    Box
} from '@chakra-ui/react';
import { MapPin, Clock, User, Calendar } from 'lucide-react';
import Card from '@shared/components/Card';
import { H3, Label, Caption, MutedText } from '@shared/components/Typography';
import { COLORS } from '@utils/designTokens';

const BookingDetail = ({ bookings = [], selectedDate }) => {
    const statusConfig = {
        APPROVED: {
            label: 'Disetujui',
            colorScheme: 'green',
            bgColor: COLORS.primary,
        },
        PENDING: {
            label: 'Diproses',
            colorScheme: 'orange',
            bgColor: '#FF8C00',
        },
        COMPLETED: {
            label: 'Selesai',
            colorScheme: 'gray',
            bgColor: '#9CA3AF',
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (!selectedDate || bookings.length === 0) {
        return (
            <Card variant="transparent">
                <VStack spacing={4} py={8} textAlign="center">
                    <Calendar size={48} color="#9CA3AF" />
                    <VStack spacing={2}>
                        <H3 color="gray.500">Pilih Tanggal</H3>
                        <MutedText>
                            Klik pada tanggal di kalender untuk melihat detail peminjaman
                        </MutedText>
                    </VStack>
                </VStack>
            </Card>
        );
    }

    return (
        <Card>
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <VStack spacing={2} align="start">
                    <H3 color={COLORS.text}>
                        Jadwal Peminjaman
                    </H3>
                    <HStack spacing={2}>
                        <Calendar size={16} color="gray" />
                        <Caption color="gray.600">
                            {formatDate(selectedDate)}
                        </Caption>
                    </HStack>
                </VStack>

                <Divider />

                {/* Booking List */}
                <VStack spacing={4} align="stretch">
                    {bookings.map((booking, index) => (
                        <Card key={booking.id || index} variant="transparent" p={4}>
                            <VStack spacing={3} align="stretch">
                                {/* Header */}
                                <HStack justify="space-between" align="start">
                                    <VStack spacing={1} align="start" flex={1}>
                                        <Label fontSize="md" color={COLORS.text}>
                                            {booking.title || 'Rapat Peminjaman'}
                                        </Label>
                                        <HStack spacing={1}>
                                            <MapPin size={14} color="gray" />
                                            <MutedText fontSize="sm">
                                                {booking.buildingName}
                                            </MutedText>
                                        </HStack>
                                    </VStack>

                                    <Badge
                                        bg={statusConfig[booking.status]?.bgColor}
                                        color="white"
                                        fontSize="xs"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                    >
                                        {statusConfig[booking.status]?.label}
                                    </Badge>
                                </HStack>

                                {/* Time */}
                                <HStack spacing={2}>
                                    <Clock size={16} color="gray" />
                                    <Text fontSize="sm" color={COLORS.text} fontWeight="500">
                                        {booking.time}
                                    </Text>
                                </HStack>

                                {/* Organizer */}
                                {booking.organizer && (
                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={booking.organizer.name}
                                            src={booking.organizer.avatar}
                                        />
                                        <VStack spacing={0} align="start">
                                            <Text fontSize="sm" color={COLORS.text}>
                                                {booking.organizer.name}
                                            </Text>
                                            <MutedText fontSize="xs">
                                                Penyelenggara
                                            </MutedText>
                                        </VStack>
                                    </HStack>
                                )}

                                {/* Participants */}
                                {booking.participants && (
                                    <HStack spacing={2}>
                                        <User size={14} color="gray" />
                                        <MutedText fontSize="sm">
                                            {booking.participants} peserta
                                        </MutedText>
                                    </HStack>
                                )}

                                {/* Description */}
                                {booking.description && (
                                    <Box>
                                        <MutedText fontSize="sm" lineHeight="1.5">
                                            {booking.description}
                                        </MutedText>
                                    </Box>
                                )}
                            </VStack>
                        </Card>
                    ))}
                </VStack>
            </VStack>
        </Card>
    );
};

export default BookingDetail; 