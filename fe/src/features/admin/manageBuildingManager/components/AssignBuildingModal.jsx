import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Select,
    VStack,
    Text,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import { buildingManagementAPI } from '../../manageBuilding/api/buildingManagementAPI';

const AssignBuildingModal = ({
    isOpen,
    onClose,
    manager,
    onAssign,
    isLoading
}) => {
    const [buildings, setBuildings] = useState([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    const [loadingBuildings, setLoadingBuildings] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchBuildings();
            setSelectedBuildingId(manager?.buildingId || '');
        }
    }, [isOpen, manager]);

    const fetchBuildings = async () => {
        setLoadingBuildings(true);
        try {
            const response = await buildingManagementAPI.getAdminBuildings();
            setBuildings(response.data || []);
        } catch (error) {
            console.error('Failed to fetch buildings:', error);
        } finally {
            setLoadingBuildings(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAssign(manager.id, selectedBuildingId || null);
    };

    const isCurrentlyAssigned = !!manager?.buildingId;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>
                        {isCurrentlyAssigned ? 'Ubah Penugasan Building Manager' : 'Tugaskan Building Manager'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <AlertDescription>
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="semibold">
                                            Manager: {manager?.managerName}
                                        </Text>
                                        {isCurrentlyAssigned && manager?.building && (
                                            <Text fontSize="sm">
                                                Saat ini ditugaskan di: {manager.building.buildingName}
                                            </Text>
                                        )}
                                    </VStack>
                                </AlertDescription>
                            </Alert>

                            <FormControl>
                                <FormLabel>Pilih Gedung</FormLabel>
                                <Select
                                    value={selectedBuildingId}
                                    onChange={(e) => setSelectedBuildingId(e.target.value)}
                                    placeholder={loadingBuildings ? "Memuat gedung..." : "Pilih gedung"}
                                    bg="rgba(255, 255, 255, 0.6)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
                                    h="48px"
                                    isDisabled={loadingBuildings}
                                >
                                    {isCurrentlyAssigned && (
                                        <option value="">Hapus penugasan</option>
                                    )}
                                    {buildings.map(building => (
                                        <option key={building.id} value={building.id}>
                                            {building.buildingName}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedBuildingId === '' && isCurrentlyAssigned && (
                                <Alert status="warning" borderRadius="md">
                                    <AlertIcon />
                                    <AlertDescription>
                                        Manager akan dihapus dari penugasan gedung saat ini
                                    </AlertDescription>
                                </Alert>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter
                        justifyContent="space-between"
                        gap={3}
                    >
                        <SecondaryButton
                            w="100%"
                            onClick={onClose}
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            w="100%"
                            type="submit"
                            isLoading={isLoading}
                            loadingText="Menyimpan..."
                            isDisabled={loadingBuildings}
                        >
                            {selectedBuildingId === '' && isCurrentlyAssigned ? 'Hapus Penugasan' : 'Simpan'}
                        </PrimaryButton>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AssignBuildingModal; 