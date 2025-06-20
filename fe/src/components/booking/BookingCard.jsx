import React from 'react';
import { HStack, VStack, Image, Text, Icon } from '@chakra-ui/react';
import { Calendar, Clock } from 'lucide-react';

const BookingCard = ({ booking }) => {
    return (
        <HStack
            spacing={4}
            bg="white"
            p={4}
            borderRadius="md"
            shadow="sm"
            width="100%"
            align="flex-start"
        >
            <Image
                src={booking.image}
                alt={booking.roomName}
                boxSize="80px"
                borderRadius="md"
                objectFit="cover"
            />
            <VStack align="flex-start" spacing={1} flex={1}>
                <Text fontWeight="bold">{booking.roomName}</Text>
                <HStack>
                    <Icon as={Calendar} size={16} />
                    <Text fontSize="sm">{booking.eventType}</Text>
                </HStack>
                <HStack>
                    <Icon as={Calendar} size={16} />
                    <Text fontSize="sm">{booking.date}</Text>
                </HStack>
                <HStack>
                    <Icon as={Clock} size={16} />
                    <Text fontSize="sm">{booking.timeStart} - {booking.timeEnd}</Text>
                </HStack>
            </VStack>
        </HStack>
    );
};

export default BookingCard; 