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
    useDisclosure,
    IconButton
} from '@chakra-ui/react';
import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@shared/components/Button';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';

const DashboardMonthYearPicker = ({ value, onChange, placeholder = "Semua Periode" }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Initialize state
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [yearRange, setYearRange] = useState({ start: currentYear - 5, end: currentYear + 2 });

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
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    const fullMonths = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Generate years based on current range
    const years = Array.from(
        { length: yearRange.end - yearRange.start + 1 },
        (_, i) => yearRange.start + i
    );

    const handlePreviousYears = () => {
        setYearRange(prev => ({
            start: prev.start - 8,
            end: prev.end - 8
        }));
    };

    const handleNextYears = () => {
        setYearRange(prev => ({
            start: prev.start + 8,
            end: prev.end + 8
        }));
    };

    const handleResetRange = () => {
        setYearRange({ start: currentYear - 5, end: currentYear + 2 });
    };

    const handleConfirm = () => {
        onChange(`${selectedMonth + 1}-${selectedYear}`);
        onClose();
    };

    const handleReset = () => {
        onChange('');
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
        onClose();
    };

    const formatDisplayValue = () => {
        if (!value) return placeholder;
        const [month, year] = value.split('-');
        return `${fullMonths[parseInt(month) - 1]} ${year}`;
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
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(215, 215, 215, 0.5)"
                borderRadius={`${CORNER_RADIUS.components.input}px`}
                color={COLORS.text}
                fontFamily="Inter, sans-serif"
                fontWeight="500"
                minW="220px"
                h="40px"
                fontSize="sm"
                justifyContent="space-between"
                _hover={{
                    bg: "rgba(255, 255, 255, 0.9)",
                    borderColor: COLORS.primary,
                    transform: "translateY(-1px)"
                }}
                _active={{
                    transform: "translateY(0)"
                }}
                transition="all 0.2s ease"
            >
                <Text>{formatDisplayValue()}</Text>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
                <ModalOverlay
                    bg="rgba(0, 0, 0, 0.4)"
                    backdropFilter="blur(8px)"
                />
                <ModalContent
                    bg="rgba(255, 255, 255, 0.95)"
                    backdropFilter="blur(15px)"
                    border="1px solid rgba(215, 215, 215, 0.5)"
                    borderRadius={`${CORNER_RADIUS.components.modal}px`}
                    boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
                    maxW="480px"
                >
                    <ModalHeader
                        pb={2}
                        fontFamily="Inter, sans-serif"
                        fontWeight="700"
                        color={COLORS.text}
                        borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                        fontSize="lg"
                    >
                        Filter Periode Dashboard
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={6}>
                        <VStack spacing={6}>
                            {/* Year Selector */}
                            <Box w="full">
                                <HStack justify="space-between" align="center" mb={3}>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color={COLORS.text}
                                        fontFamily="Inter, sans-serif"
                                    >
                                        Tahun
                                    </Text>
                                    <HStack spacing={1}>
                                        <IconButton
                                            icon={<ChevronLeft size={14} />}
                                            size="xs"
                                            variant="ghost"
                                            onClick={handlePreviousYears}
                                            borderRadius="full"
                                            _hover={{ bg: `${COLORS.primary}20` }}
                                            color={COLORS.primary}
                                        />
                                        <IconButton
                                            icon={<RotateCcw size={14} />}
                                            size="xs"
                                            variant="ghost"
                                            onClick={handleResetRange}
                                            borderRadius="full"
                                            _hover={{ bg: `${COLORS.primary}20` }}
                                            color={COLORS.primary}
                                            title="Reset ke tahun saat ini"
                                        />
                                        <IconButton
                                            icon={<ChevronRight size={14} />}
                                            size="xs"
                                            variant="ghost"
                                            onClick={handleNextYears}
                                            borderRadius="full"
                                            _hover={{ bg: `${COLORS.primary}20` }}
                                            color={COLORS.primary}
                                        />
                                    </HStack>
                                </HStack>

                                <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                                    {years.map(year => (
                                        <Button
                                            key={year}
                                            size="sm"
                                            h="36px"
                                            bg={selectedYear === year
                                                ? COLORS.primary
                                                : "rgba(255, 255, 255, 0.6)"
                                            }
                                            color={selectedYear === year ? 'white' : COLORS.text}
                                            border="1px solid rgba(215, 215, 215, 0.3)"
                                            borderRadius={`${CORNER_RADIUS.components.button}px`}
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="600"
                                            fontSize="sm"
                                            onClick={() => setSelectedYear(year)}
                                            _hover={{
                                                bg: selectedYear === year
                                                    ? COLORS.primary
                                                    : "rgba(255, 255, 255, 0.8)",
                                                transform: "translateY(-1px)",
                                                borderColor: COLORS.primary
                                            }}
                                            _active={{
                                                transform: "translateY(0)"
                                            }}
                                            transition="all 0.2s ease"
                                        >
                                            {year}
                                        </Button>
                                    ))}
                                </Grid>
                            </Box>

                            {/* Month Selector */}
                            <Box w="full">
                                <Text
                                    fontSize="sm"
                                    mb={3}
                                    fontWeight="600"
                                    color={COLORS.text}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Bulan
                                </Text>
                                <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                                    {months.map((month, index) => (
                                        <Button
                                            key={month}
                                            size="sm"
                                            h="36px"
                                            bg={selectedMonth === index
                                                ? COLORS.primary
                                                : "rgba(255, 255, 255, 0.6)"
                                            }
                                            color={selectedMonth === index ? 'white' : COLORS.text}
                                            border="1px solid rgba(215, 215, 215, 0.3)"
                                            borderRadius={`${CORNER_RADIUS.components.button}px`}
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                            fontSize="xs"
                                            onClick={() => setSelectedMonth(index)}
                                            _hover={{
                                                bg: selectedMonth === index
                                                    ? COLORS.primary
                                                    : "rgba(255, 255, 255, 0.8)",
                                                transform: "translateY(-1px)",
                                                borderColor: COLORS.primary
                                            }}
                                            _active={{
                                                transform: "translateY(0)"
                                            }}
                                            transition="all 0.2s ease"
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
                                bg="rgba(33, 209, 121, 0.1)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(33, 209, 121, 0.3)"
                                borderRadius={`${CORNER_RADIUS.components.cards}px`}
                                textAlign="center"
                            >
                                <Text
                                    fontSize="xs"
                                    color="gray.600"
                                    mb={1}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Filter aktif:
                                </Text>
                                <Text
                                    fontSize="lg"
                                    fontWeight="700"
                                    color={COLORS.primary}
                                    fontFamily="Inter, sans-serif"
                                >
                                    {fullMonths[selectedMonth]} {selectedYear}
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter pt={4} borderTop="1px solid rgba(215, 215, 215, 0.3)">
                        <HStack spacing={3}>
                            <SecondaryButton
                                onClick={handleReset}
                                fontFamily="Inter, sans-serif"
                                size="sm"
                            >
                                Reset Filter
                            </SecondaryButton>
                            <PrimaryButton
                                onClick={handleConfirm}
                                fontFamily="Inter, sans-serif"
                                size="sm"
                            >
                                Terapkan
                            </PrimaryButton>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DashboardMonthYearPicker; 