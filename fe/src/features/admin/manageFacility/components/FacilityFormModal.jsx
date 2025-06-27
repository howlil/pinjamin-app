import React from 'react';
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
    HStack,
    Text
} from '@chakra-ui/react';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FacilityIcon from './FacilityIcon';
import { FACILITY_ICONS } from './facilityIcons';

const FacilityFormModal = ({
    isOpen,
    onClose,
    isEdit,
    formData,
    onInputChange,
    onSubmit,
    isLoading
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={onSubmit}>
                    <ModalHeader>
                        {isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Nama Fasilitas</FormLabel>
                                <Input
                                    name="facilityName"
                                    value={formData.facilityName}
                                    onChange={onInputChange}
                                    placeholder="Masukkan nama fasilitas"
                                    autoFocus
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Icon</FormLabel>
                                <Select
                                    name="iconUrl"
                                    value={formData.iconUrl}
                                    onChange={onInputChange}
                                    placeholder="Pilih icon"
                                    bg="rgba(255, 255, 255, 0.6)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                    borderRadius="9999px"
                                    h="48px"
                                >
                                    {FACILITY_ICONS.map(icon => (
                                        <option key={icon.value} value={icon.value}>
                                            {icon.label}
                                        </option>
                                    ))}
                                </Select>
                                {formData.iconUrl && (
                                    <HStack mt={2} spacing={2}>
                                        <Text fontSize="sm" color="gray.600">Preview:</Text>
                                        <FacilityIcon 
                                            iconName={formData.iconUrl} 
                                            boxSize="32px"
                                        />
                                    </HStack>
                                )}
                            </FormControl>
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
                            loadingText={isEdit ? "Memperbarui..." : "Menyimpan..."}
                        >
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </PrimaryButton>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default FacilityFormModal; 