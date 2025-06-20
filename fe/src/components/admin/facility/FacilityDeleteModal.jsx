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
    VStack,
    Box,
    HStack,
    Text,
    Icon
} from '@chakra-ui/react';
import { Trash2, Settings } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import {
    Wifi,
    Mic2,
    Projector,
    AirVent,
    Users,
    PenTool,
    Volume2,
    Bath,
    Armchair,
    School2
} from 'lucide-react';

// Icon mapping for facilities
const FACILITY_ICONS = {
    'Wifi': Wifi,
    'Mic2': Mic2,
    'Projector': Projector,
    'AirConditioning': AirVent,
    'PenTool': PenTool,
    'Speaker': Volume2,
    'Bath': Bath,
    'Armchair': Armchair,
    'School2': School2,
    'PodiumLecture': Users,
    'Settings': Settings
};

const FacilityDeleteModal = ({
    isOpen,
    onClose,
    facility,
    onConfirm,
    isLoading = false
}) => {
    // Get icon component
    const getIconComponent = (iconName) => {
        const IconComponent = FACILITY_ICONS[iconName] || Settings;
        return IconComponent;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleConfirm = async () => {
        if (facility?.id) {
            const success = await onConfirm(facility.id);
            if (success) {
                onClose();
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
            <ModalContent bg="white" borderRadius="2xl" boxShadow={SHADOWS.lg}>
                <ModalHeader color={COLORS.black}>Konfirmasi Hapus</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="start">
                        <Text color={COLORS.black}>
                            Apakah Anda yakin ingin menghapus fasilitas ini?
                        </Text>
                        {facility && (
                            <Box p={4} borderRadius="xl" bg="red.50" border="1px solid red.200" w="full">
                                <HStack spacing={3}>
                                    <Icon
                                        as={getIconComponent(facility.iconUrl)}
                                        boxSize={6}
                                        color="red.500"
                                    />
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="sm" fontWeight="semibold" color="red.700">
                                            {facility.facilityName}
                                        </Text>
                                        <Text fontSize="xs" color="red.600">
                                            Dibuat: {formatDate(facility.createdAt)}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        mr={3}
                        onClick={onClose}
                        borderRadius="full"
                        isDisabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        bg="red.500"
                        color="white"
                        onClick={handleConfirm}
                        isLoading={isLoading}
                        loadingText="Menghapus..."
                        leftIcon={<Trash2 size={16} />}
                        borderRadius="full"
                        _hover={{ bg: 'red.600' }}
                    >
                        Hapus
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FacilityDeleteModal; 