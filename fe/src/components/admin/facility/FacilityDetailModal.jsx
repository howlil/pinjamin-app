import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    Box,
    Text,
    Icon,
    Grid,
    GridItem
} from '@chakra-ui/react';
import { Settings } from 'lucide-react';
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

const FacilityDetailModal = ({
    isOpen,
    onClose,
    facility
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
            <ModalContent bg="white" borderRadius="2xl" boxShadow={SHADOWS.lg}>
                <ModalHeader color={COLORS.black}>Detail Fasilitas</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {facility && (
                        <VStack spacing={6} align="stretch">
                            <Box p={4} borderRadius="lg" bg={`${COLORS.primary}05`} border={`1px solid ${COLORS.primary}15`}>
                                <VStack spacing={4}>
                                    <Box
                                        p={6}
                                        borderRadius="xl"
                                        bg={`${COLORS.primary}15`}
                                        border={`1px solid ${COLORS.primary}30`}
                                    >
                                        <Icon
                                            as={getIconComponent(facility.iconUrl)}
                                            boxSize={12}
                                            color={COLORS.primary}
                                        />
                                    </Box>

                                    <VStack spacing={3} w="full">
                                        <Box textAlign="center">
                                            <Text fontSize="xs" color={COLORS.gray[500]} mb={1}>Nama Fasilitas</Text>
                                            <Text fontSize="xl" fontWeight="bold" color={COLORS.black}>
                                                {facility.facilityName}
                                            </Text>
                                        </Box>

                                        <Grid templateColumns="1fr 1fr" gap={4} w="full">
                                            <GridItem>
                                                <Box textAlign="center">
                                                    <Text fontSize="xs" color={COLORS.gray[500]} mb={1}>Dibuat</Text>
                                                    <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                        {formatDate(facility.createdAt)}
                                                    </Text>
                                                </Box>
                                            </GridItem>
                                            <GridItem>
                                                <Box textAlign="center">
                                                    <Text fontSize="xs" color={COLORS.gray[500]} mb={1}>Diperbarui</Text>
                                                    <Text fontSize="sm" fontWeight="medium" color={COLORS.black}>
                                                        {formatDate(facility.updatedAt)}
                                                    </Text>
                                                </Box>
                                            </GridItem>
                                        </Grid>

                                        <Box w="full" pt={2}>
                                            <Text fontSize="xs" color={COLORS.gray[500]} textAlign="center">
                                                ID: {facility.id}
                                            </Text>
                                        </Box>
                                    </VStack>
                                </VStack>
                            </Box>
                        </VStack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default FacilityDetailModal; 