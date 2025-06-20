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
    Badge,
    Avatar,
    Divider,
    Box
} from '@chakra-ui/react';
import { Users, Phone, Building, Calendar, UserCheck, UserX } from 'lucide-react';
import { COLORS } from '@/utils/designTokens';

const BuildingManagerDetailModal = ({
    isOpen,
    onClose,
    manager
}) => {
    if (!manager) return null;

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge
    const getStatusBadge = () => {
        if (manager.buildingId && manager.buildingName) {
            return (
                <Badge
                    colorScheme="green"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    fontWeight="semibold"
                >
                    <HStack spacing={2}>
                        <UserCheck size={14} />
                        <Text>Ditugaskan</Text>
                    </HStack>
                </Badge>
            );
        } else {
            return (
                <Badge
                    colorScheme="gray"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    fontWeight="semibold"
                >
                    <HStack spacing={2}>
                        <UserX size={14} />
                        <Text>Tersedia</Text>
                    </HStack>
                </Badge>
            );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
            <ModalContent
                bg="white"
                borderRadius="2xl"
                border="1px solid"
                borderColor={COLORS.gray[200]}
                shadow="xl"
            >
                <ModalHeader
                    bg={COLORS.primary}
                    color="white"
                    borderTopRadius="2xl"
                    py={4}
                >
                    <HStack spacing={3}>
                        <Users size={24} />
                        <Text fontSize="lg" fontWeight="bold">
                            Detail Pengelola Gedung
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color="white" top={4} />

                <ModalBody py={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Profile Section */}
                        <VStack spacing={4} align="center">
                            <Avatar
                                size="xl"
                                name={manager.managerName}
                                bg={`${COLORS.primary}20`}
                                color={COLORS.primary}
                            />
                            <VStack spacing={1} align="center">
                                <Text fontSize="xl" fontWeight="bold" color={COLORS.black}>
                                    {manager.managerName}
                                </Text>
                                {getStatusBadge()}
                            </VStack>
                        </VStack>

                        <Divider />

                        {/* Contact Information */}
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="md" fontWeight="semibold" color={COLORS.gray[700]}>
                                Informasi Kontak
                            </Text>

                            <VStack spacing={3} align="stretch">
                                <HStack spacing={3} p={3} bg={COLORS.gray[50]} borderRadius="xl">
                                    <Icon as={Phone} color={COLORS.primary} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" color={COLORS.gray[500]} fontWeight="medium">
                                            Nomor Telepon
                                        </Text>
                                        <Text fontSize="sm" color={COLORS.black} fontWeight="semibold">
                                            {manager.phoneNumber}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <HStack spacing={3} p={3} bg={COLORS.gray[50]} borderRadius="xl">
                                    <Icon as={Users} color={COLORS.primary} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" color={COLORS.gray[500]} fontWeight="medium">
                                            ID Pengelola
                                        </Text>
                                        <Text fontSize="sm" color={COLORS.black} fontWeight="semibold" fontFamily="mono">
                                            {manager.id}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </VStack>
                        </VStack>

                        <Divider />

                        {/* Assignment Information */}
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="md" fontWeight="semibold" color={COLORS.gray[700]}>
                                Informasi Penugasan
                            </Text>

                            {manager.buildingName ? (
                                <HStack
                                    spacing={3}
                                    p={4}
                                    bg={`${COLORS.primary}05`}
                                    borderRadius="xl"
                                    border="1px solid"
                                    borderColor={`${COLORS.primary}20`}
                                >
                                    <Icon as={Building} color={COLORS.primary} />
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="xs" color={COLORS.gray[500]} fontWeight="medium">
                                            Gedung Ditugaskan
                                        </Text>
                                        <Text fontSize="sm" color={COLORS.black} fontWeight="semibold">
                                            {manager.buildingName}
                                        </Text>
                                        {manager.buildingId && (
                                            <Text fontSize="xs" color={COLORS.gray[500]} fontFamily="mono">
                                                ID: {manager.buildingId}
                                            </Text>
                                        )}
                                    </VStack>
                                </HStack>
                            ) : (
                                <Box p={4} bg={COLORS.gray[50]} borderRadius="xl" textAlign="center">
                                    <Text fontSize="sm" color={COLORS.gray[500]} fontStyle="italic">
                                        Belum ditugaskan ke gedung manapun
                                    </Text>
                                </Box>
                            )}
                        </VStack>

                        <Divider />

                        {/* Timestamps */}
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="md" fontWeight="semibold" color={COLORS.gray[700]}>
                                Informasi Sistem
                            </Text>

                            <VStack spacing={3} align="stretch">
                                <HStack spacing={3} p={3} bg={COLORS.gray[50]} borderRadius="xl">
                                    <Icon as={Calendar} color={COLORS.primary} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" color={COLORS.gray[500]} fontWeight="medium">
                                            Dibuat
                                        </Text>
                                        <Text fontSize="sm" color={COLORS.black}>
                                            {formatDate(manager.createdAt)}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <HStack spacing={3} p={3} bg={COLORS.gray[50]} borderRadius="xl">
                                    <Icon as={Calendar} color={COLORS.primary} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" color={COLORS.gray[500]} fontWeight="medium">
                                            Terakhir Diperbarui
                                        </Text>
                                        <Text fontSize="sm" color={COLORS.black}>
                                            {formatDate(manager.updatedAt)}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </VStack>
                        </VStack>
                    </VStack>
                </ModalBody>

                <ModalFooter bg={COLORS.gray[50]} borderBottomRadius="2xl">
                    <Button
                        onClick={onClose}
                        borderRadius="full"
                        px={6}
                        bg={COLORS.primary}
                        color="white"
                        _hover={{ bg: COLORS.primaryDark }}
                    >
                        Tutup
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BuildingManagerDetailModal; 