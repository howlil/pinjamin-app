import React, { useState, useEffect } from 'react';
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
    FormControl,
    FormLabel,
    Input,
    Select,
    Box,
    Flex,
    Icon
} from '@chakra-ui/react';
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
    School2,
    Settings
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import { showToast } from '@/utils/helpers';

// Available icons for selection
const AVAILABLE_ICONS = [
    { value: 'Wifi', label: 'Wi-Fi', icon: Wifi },
    { value: 'Mic2', label: 'Microphone', icon: Mic2 },
    { value: 'Projector', label: 'Projector', icon: Projector },
    { value: 'AirConditioning', label: 'Air Conditioning', icon: AirVent },
    { value: 'PenTool', label: 'Whiteboard', icon: PenTool },
    { value: 'Speaker', label: 'Speaker', icon: Volume2 },
    { value: 'Bath', label: 'Toilet', icon: Bath },
    { value: 'Armchair', label: 'Chair', icon: Armchair },
    { value: 'School2', label: 'Board', icon: School2 },
    { value: 'PodiumLecture', label: 'Podium', icon: Users }
];

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

const FacilityFormModal = ({
    isOpen,
    onClose,
    facility = null, // null for create, facility object for edit
    onSubmit,
    isLoading = false
}) => {
    const [formData, setFormData] = useState({
        facilityName: '',
        iconUrl: ''
    });

    const isEditing = Boolean(facility);

    // Reset form when modal opens/closes or facility changes
    useEffect(() => {
        if (isOpen) {
            if (facility) {
                setFormData({
                    facilityName: facility.facilityName || '',
                    iconUrl: facility.iconUrl || ''
                });
            } else {
                setFormData({
                    facilityName: '',
                    iconUrl: ''
                });
            }
        }
    }, [isOpen, facility]);

    // Get icon component
    const getIconComponent = (iconName) => {
        const IconComponent = FACILITY_ICONS[iconName] || Settings;
        return IconComponent;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!formData.facilityName.trim() || !formData.iconUrl) {
            showToast.error('Nama fasilitas dan ikon harus diisi');
            return;
        }

        const success = await onSubmit(formData, facility?.id);
        if (success) {
            onClose();
        }
    };

    // Handle input change
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
            <ModalContent bg="white" borderRadius="2xl" boxShadow={SHADOWS.lg}>
                <ModalHeader color={COLORS.black}>
                    {isEditing ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                            <FormLabel color={COLORS.black}>Nama Fasilitas</FormLabel>
                            <Input
                                placeholder="Masukkan nama fasilitas..."
                                value={formData.facilityName}
                                onChange={(e) => handleInputChange('facilityName', e.target.value)}
                                borderColor={`${COLORS.primary}30`}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`
                                }}
                                borderRadius="full"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color={COLORS.black}>Ikon</FormLabel>
                            <Select
                                placeholder="Pilih ikon fasilitas..."
                                value={formData.iconUrl}
                                onChange={(e) => handleInputChange('iconUrl', e.target.value)}
                                borderColor={`${COLORS.primary}30`}
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 1px ${COLORS.primary}`
                                }}
                                borderRadius="full"
                            >
                                {AVAILABLE_ICONS.map((iconOption) => (
                                    <option key={iconOption.value} value={iconOption.value}>
                                        {iconOption.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Icon Preview */}
                        {formData.iconUrl && (
                            <Box>
                                <FormLabel color={COLORS.black}>Preview Ikon</FormLabel>
                                <Flex align="center" justify="center" p={4} bg={`${COLORS.primary}05`} borderRadius="xl">
                                    <Box
                                        p={4}
                                        borderRadius="xl"
                                        bg={`${COLORS.primary}15`}
                                        border={`1px solid ${COLORS.primary}30`}
                                    >
                                        <Icon
                                            as={getIconComponent(formData.iconUrl)}
                                            boxSize={8}
                                            color={COLORS.primary}
                                        />
                                    </Box>
                                </Flex>
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
                        bg={COLORS.primary}
                        color="white"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText={isEditing ? "Memperbarui..." : "Menambahkan..."}
                        borderRadius="full"
                        _hover={{ bg: COLORS.primaryDark }}
                    >
                        {isEditing ? 'Perbarui' : 'Tambah'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FacilityFormModal; 