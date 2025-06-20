import React from 'react';
import { Box, VStack, Text, Icon, Button, Image } from '@chakra-ui/react';
import { Building } from 'lucide-react';
import { COLORS, GLASS_EFFECT } from '@/utils/designTokens';

const RoomCard = ({ room, onClick, onDetailsClick }) => {
    return (
        <Box
            bg={GLASS_EFFECT.bg}
            backdropFilter={GLASS_EFFECT.backdropFilter}
            border={GLASS_EFFECT.border}
            borderRadius={GLASS_EFFECT.borderRadius}
            boxShadow={GLASS_EFFECT.boxShadow}
            overflow="hidden"
            transition="all 0.3s ease"
            _hover={{
                transform: "translateY(-5px)",
                boxShadow: "0 12px 40px rgba(116, 156, 115, 0.25)"
            }}
            cursor="pointer"
            onClick={() => onClick && onClick(room.id)}
        >
            <Box
                h="200px"
                bg="linear-gradient(135deg, #749C73 0%, #5a7a59 100%)"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {room.image ? (
                    <Image src={room.image} alt={room.name} objectFit="cover" w="full" h="full" />
                ) : (
                    <Icon as={Building} w={16} h={16} color="white" opacity={0.7} />
                )}
            </Box>

            <VStack p={4} spacing={3} align="stretch">
                <Text fontWeight="bold" color={COLORS.black} fontSize="lg">
                    {room.name}
                </Text>
                <Text color={COLORS.primary} fontWeight="medium" fontSize="md">
                    {room.price}
                </Text>
                <Button
                    bg={COLORS.primary}
                    color="white"
                    size="sm"
                    borderRadius="full"
                    w="full"
                    _hover={{
                        bg: COLORS.primary,
                        transform: "translateY(-1px)"
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetailsClick && onDetailsClick(room.id);
                    }}
                >
                    Detail Gedung
                </Button>
            </VStack>
        </Box>
    );
};

export default RoomCard; 