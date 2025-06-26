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
    VStack
} from '@chakra-ui/react';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';

const BuildingManagerFormModal = ({
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
                        {isEdit ? 'Edit Building Manager' : 'Tambah Building Manager'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Nama Manager</FormLabel>
                                <Input
                                    name="managerName"
                                    value={formData.managerName}
                                    onChange={onInputChange}
                                    placeholder="Masukkan nama manager"
                                    autoFocus
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Nomor Telepon</FormLabel>
                                <Input
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={onInputChange}
                                    placeholder="Contoh: +62812345678"
                                    type="tel"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <SecondaryButton mr={3} onClick={onClose}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
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

export default BuildingManagerFormModal; 