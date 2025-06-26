import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    VStack,
    HStack,
    Box,
    Text,
    Grid,
    useDisclosure
} from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import { COLORS } from '@utils/designTokens';

const MonthYearPicker = ({ value, onChange, placeholder = "Pilih Periode" }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Initialize state
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Sync internal state with props value
    useEffect(() => {
        if (value) {
            const [month, year] = value.split('-');
            setSelectedMonth(parseInt(month) - 1);
            setSelectedYear(parseInt(year));
        } else {
            setSelectedMonth(currentMonth);
            setSelectedYear(currentYear);
        }
    }, [value]);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Generate years (5 years back and 1 year forward)
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

    const handleConfirm = () => {
        onChange(`${selectedMonth + 1}-${selectedYear}`);
        onClose();
    };

    const handleClear = () => {
        onChange('');
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
        onClose();
    };

    const formatDisplayValue = () => {
        if (!value) return placeholder;
        const [month, year] = value.split('-');
        return `${months[parseInt(month) - 1]} ${year}`;
    };

    // Reset internal state when modal opens
    const handleOpen = () => {
        if (value) {
            const [month, year] = value.split('-');
            setSelectedMonth(parseInt(month) - 1);
            setSelectedYear(parseInt(year));
        }
        onOpen();
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                leftIcon={<Calendar size={16} />}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                _hover={{ bg: 'gray.50' }}
                fontWeight="normal"
                minW="250px"
                justifyContent="space-between"
            >
                <Text>{formatDisplayValue()}</Text>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent borderRadius="24px">
                    <ModalHeader>Pilih Bulan dan Tahun</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <VStack spacing={6}>
                            {/* Year Selector */}
                            <Box w="full">
                                <Text fontSize="sm" mb={3} fontWeight="medium" color="gray.700">
                                    Tahun
                                </Text>
                                <HStack spacing={2} justify="center">
                                    {years.map(year => (
                                        <Button
                                            key={year}
                                            size="sm"
                                            variant={selectedYear === year ? 'solid' : 'outline'}
                                            colorScheme={selectedYear === year ? 'green' : 'gray'}
                                            onClick={() => setSelectedYear(year)}
                                            minW="60px"
                                        >
                                            {year}
                                        </Button>
                                    ))}
                                </HStack>
                            </Box>

                            {/* Month Selector */}
                            <Box w="full">
                                <Text fontSize="sm" mb={3} fontWeight="medium" color="gray.700">
                                    Bulan
                                </Text>
                                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                                    {months.map((month, index) => (
                                        <Button
                                            key={month}
                                            size="sm"
                                            variant={selectedMonth === index ? 'solid' : 'ghost'}
                                            bg={selectedMonth === index ? COLORS.primary : 'transparent'}
                                            color={selectedMonth === index ? 'white' : 'gray.700'}
                                            _hover={{
                                                bg: selectedMonth === index ? COLORS.primary : 'gray.100'
                                            }}
                                            onClick={() => setSelectedMonth(index)}
                                            fontSize="sm"
                                        >
                                            {month}
                                        </Button>
                                    ))}
                                </Grid>
                            </Box>

                            {/* Preview */}
                            <Box
                                w="full"
                                p={4}
                                bg="gray.50"
                                borderRadius="lg"
                                textAlign="center"
                            >
                                <Text fontSize="sm" color="gray.600" mb={1}>
                                    Periode yang dipilih:
                                </Text>
                                <Text fontSize="lg" fontWeight="semibold" color={COLORS.primary}>
                                    {months[selectedMonth]} {selectedYear}
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack spacing={3}>
                            <SecondaryButton onClick={handleClear}>
                                Reset
                            </SecondaryButton>
                            <PrimaryButton onClick={handleConfirm}>
                                Pilih
                            </PrimaryButton>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default MonthYearPicker; 