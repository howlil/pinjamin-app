import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    Text,
    VStack,
    Icon,
    Flex
} from '@chakra-ui/react';
import { Calendar, Clock, Upload } from 'lucide-react';
import { GlassInput, PrimaryButton } from './ui';
import { COLORS, GLASS_EFFECT } from '../utils/designTokens';
import { useBookingForm } from '../hooks/useBookingForm';

const BookingFormModal = ({ isOpen, onClose, roomName }) => {
    const {
        formData,
        fileName,
        fileInputRef,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        triggerFileInput,
        handleSubmit
    } = useBookingForm(onClose);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent
                bg={GLASS_EFFECT.bg}
                backdropFilter={GLASS_EFFECT.backdropFilter}
                border={GLASS_EFFECT.border}
                borderRadius={GLASS_EFFECT.borderRadius}
                boxShadow={GLASS_EFFECT.boxShadow}
                overflow="hidden"
                _before={{
                    ...GLASS_EFFECT.beforeProps,
                    borderRadius: GLASS_EFFECT.borderRadius
                }}
            >
                <ModalHeader fontSize="xl" fontWeight="bold" color={COLORS.black}>
                    {roomName ? `Form Peminjaman - ${roomName}` : 'Form Peminjaman'}
                </ModalHeader>
                <ModalCloseButton color={COLORS.black} />
                <ModalBody pb={6}>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch">
                            {/* Nama Kegiatan */}
                            <GlassInput
                                name="activityName"
                                label="Nama Kegiatan"
                                value={formData.activityName}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama kegiatan"
                                isRequired
                            />

                            {/* Tanggal Kegiatan - Row */}
                            <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                                {/* Tanggal Mulai */}
                                <GlassInput
                                    name="startDate"
                                    label="Tanggal Mulai Kegiatan"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    isRequired
                                    rightElement={<Icon as={Calendar} color="gray.400" />}
                                />

                                {/* Tanggal Selesai */}
                                <GlassInput
                                    name="endDate"
                                    label="Tanggal Selesai Kegiatan"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    rightElement={<Icon as={Calendar} color="gray.400" />}
                                />
                            </Flex>

                            {/* Jam Kegiatan - Row */}
                            <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                                {/* Jam Mulai */}
                                <GlassInput
                                    name="startTime"
                                    label="Jam Mulai Kegiatan"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    isRequired
                                    rightElement={<Icon as={Clock} color="gray.400" />}
                                />

                                {/* Jam Selesai */}
                                <GlassInput
                                    name="endTime"
                                    label="Jam Selesai Kegiatan"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    isRequired
                                    rightElement={<Icon as={Clock} color="gray.400" />}
                                />
                            </Flex>

                            {/* Surat Pengajuan */}
                            <VStack align="start" spacing={1}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={COLORS.black}
                                >
                                    Surat Pengajuan<Text as="span" color={COLORS.primary}>*</Text>
                                </Text>
                                <Box
                                    border="1px dashed"
                                    borderColor="gray.300"
                                    borderRadius="md"
                                    p={4}
                                    textAlign="center"
                                    cursor="pointer"
                                    onClick={triggerFileInput}
                                    _hover={{ borderColor: COLORS.primary }}
                                    bg="rgba(255, 255, 255, 0.4)"
                                    backdropFilter="blur(10px)"
                                    w="100%"
                                    transition="all 0.3s ease"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Icon as={Upload} w={8} h={8} color="gray.400" mb={2} />
                                    <Text mb={1} color={COLORS.black}>
                                        {fileName ? fileName : 'Klik untuk upload file'}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Format: PDF, DOC, DOCX
                                    </Text>
                                </Box>
                            </VStack>

                            {/* Submit Button */}
                            <PrimaryButton
                                type="submit"
                                isLoading={isSubmitting}
                                loadingText="Mengirim..."
                                size="lg"
                                mt={4}
                            >
                                Ajukan Peminjaman
                            </PrimaryButton>
                        </VStack>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default BookingFormModal; 