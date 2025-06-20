import React from 'react';
import { Box, VStack, Heading, Text, HStack, Icon } from '@chakra-ui/react';
import { Building, Users, MapPin, Clock, Calendar } from 'lucide-react';
import { AnimatedList } from '@/components/magicui/animated-list';
import { COLORS, GLASS_EFFECT } from '@/utils/designTokens';

// This would typically come from props or a data hook
const defaultRooms = [
    {
        id: 1,
        name: 'Gedung Seminar E',
        time: '12:00 - 16:00',
        event: 'Acara Pelantikan ketua ormawa',
        icon: Building
    },
    {
        id: 2,
        name: 'Ruang Meeting F3',
        time: '08:30 - 11:00',
        event: 'Rapat koordinasi fakultas',
        icon: Users
    },
    {
        id: 3,
        name: 'Aula Utama',
        time: '09:00 - 14:00',
        event: 'Seminar internasional',
        icon: MapPin
    },
    {
        id: 4,
        name: 'Ruang Konferensi B',
        time: '15:30 - 17:00',
        event: 'Workshop penelitian',
        icon: Clock
    },
    {
        id: 5,
        name: 'Auditorium Lantai 2',
        time: '10:00 - 13:00',
        event: 'Presentasi tugas akhir',
        icon: Calendar
    }
];

const AvailableRoomsList = ({ rooms = defaultRooms, onRoomClick }) => {
    return (
        <VStack spacing={4} align="stretch">
            <Heading size="md" color={COLORS.black} fontWeight="600" mb={2}>
                Ruangan Tersedia Hari Ini
            </Heading>

            {/* Room count */}
            <Text fontSize="xs" color={COLORS.primary} opacity={0.7}>
                {rooms.length} ruangan tersedia
            </Text>

            {/* Available Rooms List */}
            <Box w="full" minH="300px">
                <AnimatedList delay={2000} showItemsCount={3} initialDelay={300}>
                    {rooms.map((room) => (
                        <Box
                            key={room.id}
                            bg={GLASS_EFFECT.bg}
                            backdropFilter={GLASS_EFFECT.backdropFilter}
                            border={GLASS_EFFECT.border}
                            p={4}
                            borderRadius={GLASS_EFFECT.borderRadius}
                            boxShadow={GLASS_EFFECT.boxShadow}
                            transition="all 0.3s ease"
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 12px 40px rgba(116, 156, 115, 0.25)"
                            }}
                            cursor="pointer"
                            w="full"
                            onClick={() => onRoomClick && onRoomClick(room)}
                        >
                            <HStack spacing={4}>
                                <Box
                                    bg={COLORS.primary}
                                    p={3}
                                    borderRadius="12px"
                                    color="white"
                                >
                                    <Icon as={room.icon} w={5} h={5} />
                                </Box>
                                <VStack align="start" spacing={1} flex={1}>
                                    <HStack justify="space-between" w="full">
                                        <Text fontWeight="bold" color={COLORS.black} fontSize="md">
                                            {room.name}
                                        </Text>
                                        <Text fontSize="sm" color={COLORS.primary} fontWeight="medium">
                                            {room.time}
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color={COLORS.black} opacity={0.7}>
                                        {room.event}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>
                    ))}
                </AnimatedList>
            </Box>

            {/* Fallback message if no rooms */}
            {rooms.length === 0 && (
                <Box
                    bg={GLASS_EFFECT.bg}
                    backdropFilter={GLASS_EFFECT.backdropFilter}
                    border={GLASS_EFFECT.border}
                    p={6}
                    borderRadius={GLASS_EFFECT.borderRadius}
                    textAlign="center"
                >
                    <Text color={COLORS.black} opacity={0.7}>
                        Tidak ada ruangan tersedia saat ini
                    </Text>
                </Box>
            )}
        </VStack>
    );
};

export default AvailableRoomsList; 