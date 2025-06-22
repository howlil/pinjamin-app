import React from 'react';
import { VStack, Text, Icon, Button, Image, Box } from '@chakra-ui/react';
import { Building } from 'lucide-react';
import { COLORS } from '../../utils/designTokens';
import GlassCard from './GlassCard';

const RoomCard = ({ room, onClick, onDetailsClick }) => {
    return (
        <GlassCard
            variant="frosted"
            p={0}
            overflow="hidden"
            transition="all 0.3s ease"
            _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 15px 35px rgba(116, 156, 115, 0.2)"
            }}
            cursor="pointer"
            onClick={() => onClick && onClick(room.id)}
            maxW="280px"
            w="full"
        >
            <Box
                h="140px"
                bgGradient="linear(135deg, #749C73 0%, #5a7a59 100%)"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="16px 16px 0 0"
                overflow="hidden"
            >
                {room.image ? (
                    <Image
                        src={room.image}
                        alt={room.name}
                        objectFit="cover"
                        w="full"
                        h="full"
                    />
                ) : (
                    <Icon as={Building} w={12} h={12} color="white" opacity={0.7} />
                )}

                {/* Glassmorphism overlay on image */}
                <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    h="40%"
                    bgGradient="linear(to-t, rgba(0,0,0,0.2), transparent)"
                />
            </Box>

            <VStack p={4} spacing={3} align="stretch">
                <Text
                    fontWeight="semibold"
                    color={COLORS.black}
                    fontSize="md"
                    textAlign="center"
                    noOfLines={2}
                    lineHeight="1.3"
                >
                    {room.name}
                </Text>

                <Text
                    color={COLORS.primary}
                    fontWeight="medium"
                    fontSize="sm"
                    textAlign="center"
                >
                    {room.price}
                </Text>

                <Button
                    bg={COLORS.primary}
                    color="white"
                    size="sm"
                    borderRadius="full"
                    w="full"
                    fontWeight="medium"
                    fontSize="sm"
                    h="32px"
                    _hover={{
                        bg: COLORS.primaryDark,
                        transform: "translateY(-1px)",
                        boxShadow: `0 6px 20px ${COLORS.primary}30`
                    }}
                    _active={{
                        transform: "translateY(0)",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetailsClick && onDetailsClick(room.id);
                    }}
                >
                    Detail Gedung
                </Button>
            </VStack>
        </GlassCard>
    );
};

export default RoomCard; 