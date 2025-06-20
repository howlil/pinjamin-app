import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    VStack,
    HStack,
    Icon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from '@chakra-ui/react';
import { Trash2, AlertTriangle, Users } from 'lucide-react';
import { COLORS } from '@/utils/designTokens';

const BuildingManagerDeleteModal = ({
    isOpen,
    onClose,
    manager,
    onConfirm,
    isLoading = false
}) => {
    if (!manager) return null;

    const handleDelete = async () => {
        const success = await onConfirm(manager.id);
        if (success) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
            <ModalContent
                bg="white"
                borderRadius="2xl"
                border="1px solid"
                borderColor="red.200"
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
                            Hapus Pengelola Gedung
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color="white" top={4} />

                <ModalBody py={6}>
                    <VStack spacing={4} align="stretch">
                        <Alert status="warning" borderRadius="xl">
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                                <AlertTitle fontSize="sm">Peringatan!</AlertTitle>
                                <AlertDescription fontSize="sm">
                                    Tindakan ini tidak dapat dibatalkan.
                                </AlertDescription>
                            </VStack>
                        </Alert>

                        <VStack spacing={3} align="stretch">
                            <Text fontSize="md" color={COLORS.gray[700]}>
                                Anda yakin ingin menghapus pengelola gedung berikut?
                            </Text>

                            <VStack
                                p={4}
                                bg={COLORS.gray[50]}
                                borderRadius="xl"
                                border="1px solid"
                                borderColor={COLORS.gray[200]}
                                align="stretch"
                                spacing={2}
                            >
                                <HStack spacing={3}>
                                    <Icon as={Users} color={COLORS.primary} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                            {manager.managerName}
                                        </Text>
                                        <Text fontSize="xs" color={COLORS.gray[500]}>
                                            {manager.phoneNumber}
                                        </Text>
                                    </VStack>
                                </HStack>

                                {manager.buildingName && (
                                    <Text fontSize="xs" color={COLORS.gray[600]}>
                                        Saat ini mengelola: <strong>{manager.buildingName}</strong>
                                    </Text>
                                )}
                            </VStack>

                            {manager.buildingName && (
                                <Alert status="info" borderRadius="xl">
                                    <AlertIcon />
                                    <VStack align="start" spacing={1}>
                                        <AlertTitle fontSize="sm">Informasi</AlertTitle>
                                        <AlertDescription fontSize="sm">
                                            Pengelola ini saat ini ditugaskan ke gedung "{manager.buildingName}". 
                                            Menghapus pengelola akan menghapus penugasan tersebut.
                                        </AlertDescription>
                                    </VStack>
                                </Alert>
                            )}
                        </VStack>
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
                            bg="red.500"
                            color="white"
                            onClick={handleDelete}
                            isLoading={isLoading}
                            loadingText="Menghapus..."
                            borderRadius="full"
                            px={6}
                            _hover={{ bg: "red.600" }}
                        >
                            Hapus Pengelola
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BuildingManagerDeleteModal; 