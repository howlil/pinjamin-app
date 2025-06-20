import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Badge
} from '@chakra-ui/react';
import { GLASS } from '@/utils/designTokens';

const EventDetailModal = ({ isOpen, onClose, selectedEvent, getStatusColor, getStatusText }) => {
    if (!selectedEvent) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent
                bg={GLASS.background}
                backdropFilter={GLASS.backdropFilter}
                border={GLASS.border}
                borderRadius="20px"
                boxShadow="0 8px 32px rgba(116, 156, 115, 0.2)"
            >
                <ModalHeader color="#444444" fontSize="xl" fontWeight="bold">
                    {selectedEvent?.room}
                </ModalHeader>
                <ModalCloseButton
                    color="#444444"
                    _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        <HStack>
                            <Text fontWeight="medium" color="#444444" minW="80px">
                                Tanggal
                            </Text>
                            <Text color="#444444">2 Maret 2024</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="medium" color="#444444" minW="80px">
                                Waktu
                            </Text>
                            <Text color="#444444">{selectedEvent?.time} WIB</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="medium" color="#444444" minW="80px">
                                Peminjam
                            </Text>
                            <Text color="#444444">Rektor</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="medium" color="#444444" minW="80px">
                                Kegiatan
                            </Text>
                            <Text color="#444444">Pelantikan</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight="medium" color="#444444" minW="80px">
                                Status
                            </Text>
                            <Badge
                                bg={getStatusColor(selectedEvent?.status)}
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                {getStatusText(selectedEvent?.status)}
                            </Badge>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EventDetailModal; 