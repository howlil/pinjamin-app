import React, { useEffect, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Box,
    Icon,
    SimpleGrid,
    useDisclosure
} from '@chakra-ui/react';
import { Calendar, Clock, FileText, Upload, CheckCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import Input from '@shared/components/Input';
import FormField from '@shared/components/FormField';
import { H3, H4, Text as CustomText, Caption } from '@shared/components/Typography';
import { COLORS } from '@utils/designTokens';
import { useBooking } from '../api/useBooking';

const BookingFormModal = ({ isOpen, onClose, buildingId, buildingName, selectedDate, requestedTime }) => {
    const fileInputRef = useRef(null);
    const {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
        resetForm,
        initializeForm,
        checkAuthAndRedirect
    } = useBooking();

    useEffect(() => {
        if (isOpen && buildingId) {
            initializeForm(buildingId, selectedDate, requestedTime);
        }
    }, [isOpen, buildingId, selectedDate, requestedTime]);

    const handleModalClose = () => {
        resetForm();
        onClose();
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        handleChange(e);
    };

    const onSubmit = async (e) => {
        // Check authentication before form submission
        if (!checkAuthAndRedirect()) {
            return;
        }

        const success = await handleSubmit(e);
        if (success) {
            handleModalClose();
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const timeOptions = [];
    for (let hour = 7; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeOptions.push(timeString);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleModalClose} size="xl" isCentered>
            <ModalOverlay
                bg="rgba(215, 215, 215, 0.5)"
                backdropFilter="blur(10px)"
            />
            <ModalContent
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(15px)"
                borderRadius="24px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                fontFamily="Inter, sans-serif"
                maxH="90vh"
                overflowY="auto"
            >
                <ModalHeader pb={2} pt={6}>
                    <VStack spacing={2} align="start">
                        <H3 color="#2A2A2A" fontSize="xl" fontWeight="700">
                            Ajukan Peminjaman Gedung
                        </H3>
                        <CustomText fontSize="sm" color="#2A2A2A" opacity={0.7}>
                            {buildingName}
                            {selectedDate && ` • ${formatDate(selectedDate)}`}
                        </CustomText>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={4}>
                    <form onSubmit={onSubmit}>
                        <VStack spacing={5} align="stretch">
                            {/* Activity Name */}
                            <FormField
                                label="Nama Kegiatan"
                                isRequired
                                error={errors.activityName}
                            >
                                <Input
                                    name="activityName"
                                    type="text"
                                    variant="glassmorphism"
                                    placeholder="Masukkan nama kegiatan"
                                    value={formData.activityName}
                                    onChange={handleChange}
                                />
                            </FormField>

                            {/* Date Range */}
                            <SimpleGrid columns={2} spacing={4}>
                                <FormField
                                    label="Tanggal Mulai"
                                    isRequired
                                    error={errors.startDate}
                                >
                                    <Input
                                        name="startDate"
                                        type="date"
                                        variant="glassmorphism"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </FormField>

                                <FormField
                                    label="Tanggal Selesai"
                                    error={errors.endDate}
                                    helperText="Opsional - isi jika kegiatan lebih dari 1 hari"
                                >
                                    <Input
                                        name="endDate"
                                        type="date"
                                        variant="glassmorphism"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </FormField>
                            </SimpleGrid>

                            {/* Time Range */}
                            <SimpleGrid columns={2} spacing={4}>
                                <FormField
                                    label="Waktu Mulai"
                                    isRequired
                                    error={errors.startTime}
                                >
                                    <Box position="relative">
                                        <select
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                height: '48px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(215, 215, 215, 0.5)',
                                                borderRadius: '9999px',
                                                padding: '0 16px',
                                                fontSize: '14px',
                                                fontFamily: 'Inter, sans-serif',
                                                outline: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value="">Pilih waktu mulai</option>
                                            {timeOptions.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        <Icon
                                            as={Clock}
                                            position="absolute"
                                            right="16px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            color="gray.400"
                                            size={16}
                                            pointerEvents="none"
                                        />
                                    </Box>
                                </FormField>

                                <FormField
                                    label="Waktu Selesai"
                                    isRequired
                                    error={errors.endTime}
                                >
                                    <Box position="relative">
                                        <select
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                height: '48px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(215, 215, 215, 0.5)',
                                                borderRadius: '9999px',
                                                padding: '0 16px',
                                                fontSize: '14px',
                                                fontFamily: 'Inter, sans-serif',
                                                outline: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value="">Pilih waktu selesai</option>
                                            {timeOptions.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        <Icon
                                            as={Clock}
                                            position="absolute"
                                            right="16px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            color="gray.400"
                                            size={16}
                                            pointerEvents="none"
                                        />
                                    </Box>
                                </FormField>
                            </SimpleGrid>

                            {/* File Upload */}
                            <FormField
                                label="Surat Proposal"
                                isRequired
                                error={errors.proposalLetter}
                                helperText="Upload file PDF maksimal 5MB"
                            >
                                <VStack spacing={3} align="stretch">
                                    <Box
                                        as="button"
                                        type="button"
                                        onClick={handleFileUpload}
                                        w="100%"
                                        h="120px"
                                        bg="rgba(33, 209, 121, 0.05)"
                                        border="2px dashed"
                                        borderColor={formData.proposalLetter ? COLORS.primary : "rgba(215, 215, 215, 0.5)"}
                                        borderRadius="16px"
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        cursor="pointer"
                                        _hover={{
                                            bg: "rgba(33, 209, 121, 0.08)",
                                            borderColor: COLORS.primary
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <VStack spacing={2}>
                                            <Icon
                                                as={formData.proposalLetter ? CheckCircle : Upload}
                                                size={32}
                                                color={formData.proposalLetter ? COLORS.primary : "gray.400"}
                                            />
                                            <VStack spacing={1}>
                                                <CustomText
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    color={formData.proposalLetter ? COLORS.primary : "#2A2A2A"}
                                                >
                                                    {formData.proposalLetter
                                                        ? 'File berhasil dipilih'
                                                        : 'Klik untuk upload file'
                                                    }
                                                </CustomText>
                                                <Caption fontSize="xs" color="gray.500">
                                                    {formData.proposalLetter
                                                        ? formData.proposalLetter.name
                                                        : 'Format PDF, maksimal 5MB'
                                                    }
                                                </Caption>
                                            </VStack>
                                        </VStack>
                                    </Box>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="proposalLetter"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </VStack>
                            </FormField>


                        </VStack>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3} w="100%">

                        <PrimaryButton
                            onClick={onSubmit}
                            isLoading={isLoading}
                            loadingText="Mengajukan..."
                            disabled={!formData.activityName || !formData.startDate || !formData.startTime || !formData.endTime || !formData.proposalLetter}
                            flex={2}
                        >
                            Ajukan Peminjaman
                        </PrimaryButton>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BookingFormModal; 