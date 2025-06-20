import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    HStack,
    Button,
    VStack,
    Box,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { PrimaryButton } from '@/components/ui';
import { COLORS } from '@/utils/designTokens';

const BuildingDeleteModal = ({
    isOpen,
    onClose,
    building,
    onConfirm,
    isLoading = false
}) => {
    if (!building) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent
                bg="white"
                borderRadius="2xl"
                border="1px solid"
                borderColor={COLORS.gray[200]}
                shadow="xl"
            >
                <ModalHeader
                    bg="red.500"
                    color="white"
                    borderTopRadius="2xl"
                    py={4}
                >
                    <HStack spacing={3}>
                        <Trash2 size={24} />
                        <Text fontSize="lg" fontWeight="bold">
                            Hapus Gedung
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color="white" top={4} />

                <ModalBody py={6}>
                    <VStack spacing={4} align="stretch">
                        <Alert status="warning" borderRadius="xl">
                            <AlertIcon as={AlertTriangle} />
                            <Box>
                                <AlertTitle fontSize="sm" fontWeight="bold">
                                    Peringatan!
                                </AlertTitle>
                                <AlertDescription fontSize="sm">
                                    Tindakan ini tidak dapat dibatalkan.
                                </AlertDescription>
                            </Box>
                        </Alert>

                        <Box>
                            <Text fontSize="md" color={COLORS.gray[700]} mb={2}>
                                Apakah Anda yakin ingin menghapus gedung berikut?
                            </Text>
                            <Box
                                p={4}
                                bg={COLORS.gray[50]}
                                borderRadius="xl"
                                border="1px solid"
                                borderColor={COLORS.gray[200]}
                            >
                                <Text fontSize="lg" fontWeight="bold" color={COLORS.black}>
                                    {building.buildingName}
                                </Text>
                                <Text fontSize="sm" color={COLORS.gray[600]} mt={1}>
                                    {building.description}
                                </Text>
                                <Text fontSize="sm" color={COLORS.gray[500]} mt={2}>
                                    Lokasi: {building.location}
                                </Text>
                            </Box>
                        </Box>

                        <Text fontSize="sm" color={COLORS.gray[600]} textAlign="center">
                            Semua data terkait gedung ini akan dihapus secara permanen.
                        </Text>
                    </VStack>
                </ModalBody>

                <ModalFooter bg={COLORS.gray[50]} borderBottomRadius="2xl">
                    <HStack spacing={3}>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            borderRadius="full"
                            px={6}
                            isDisabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => onConfirm(building)}
                            isLoading={isLoading}
                            loadingText="Menghapus..."
                            borderRadius="full"
                            px={6}
                        >
                            Hapus Gedung
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BuildingDeleteModal; 