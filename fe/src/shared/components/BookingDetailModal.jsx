import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Badge,
    Icon,
    Box,
    Divider,
    Button,
    Link,
    Image,
    SimpleGrid,
    Tag,
    TagLabel,
    Heading,
    Flex
} from '@chakra-ui/react';
import {
    User,
    Building,
    Calendar,
    CreditCard,
    FileText,
    Download,
    ExternalLink,
    Mail,
    Phone,
    MapPin,
    Users,
    DollarSign,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock as ClockIcon
} from 'lucide-react';

const BookingDetailModal = ({ isOpen, onClose, booking }) => {
    if (!booking) return null;

    const getStatusConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
                return {
                    label: 'Disetujui',
                    bgColor: '#21D179',
                    textColor: 'white',
                    icon: CheckCircle
                };
            case 'PROCESSING':
                return {
                    label: 'Diproses',
                    bgColor: '#FF8C00',
                    textColor: 'white',
                    icon: ClockIcon
                };
            case 'REJECTED':
                return {
                    label: 'Ditolak',
                    bgColor: '#EF4444',
                    textColor: 'white',
                    icon: XCircle
                };
            case 'COMPLETED':
                return {
                    label: 'Selesai',
                    bgColor: '#9CA3AF',
                    textColor: 'white',
                    icon: CheckCircle
                };
            default:
                return {
                    label: status || 'Unknown',
                    bgColor: '#9CA3AF',
                    textColor: 'white',
                    icon: AlertCircle
                };
        }
    };

    const getPaymentStatusConfig = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
                return {
                    label: 'Sudah Dibayar',
                    bgColor: '#21D179',
                    textColor: 'white'
                };
            case 'UNPAID':
                return {
                    label: 'Belum Dibayar',
                    bgColor: '#EF4444',
                    textColor: 'white'
                };
            case 'PENDING':
                return {
                    label: 'Menunggu Pembayaran',
                    bgColor: '#FF8C00',
                    textColor: 'white'
                };
            default:
                return {
                    label: status || 'Unknown',
                    bgColor: '#9CA3AF',
                    textColor: 'white'
                };
        }
    };

    const getBorrowerTypeLabel = (type) => {
        switch (type) {
            case 'INTERNAL_UNAND':
                return 'Internal Unand';
            case 'EXTERNAL':
                return 'External';
            default:
                return type || 'Unknown';
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const statusConfig = getStatusConfig(booking.status);
    const paymentConfig = getPaymentStatusConfig(booking.detail?.payment?.paymentStatus);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered scrollBehavior="inside">
            <ModalOverlay
                bg="rgba(215, 215, 215, 0.5)"
                backdropFilter="blur(10px)"
            />
            <ModalContent
                bg="rgba(237, 255, 244, 0.5)"
                backdropFilter="blur(10px)"
                borderRadius="24px"
                border="1px solid #D7D7D7FF"
                boxShadow="0 8px 32px rgba(215, 215, 215, 0.5)"
                fontFamily="Inter, sans-serif"
                maxH="90vh"
            >
                <ModalHeader pb={2} pt={6}>
                    <Flex justify="space-between" align="center" w="full">
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="#2A2A2A" fontWeight="700">
                                Detail Peminjaman
                            </Heading>
                            <Text fontSize="sm" color="#666" fontFamily="monospace">
                                ID: {booking.bookingId}
                            </Text>
                        </VStack>
                        <Badge
                            bg={statusConfig.bgColor}
                            color={statusConfig.textColor}
                            borderRadius="full"
                            px={4}
                            py={2}
                            fontSize="sm"
                            fontWeight="600"
                            display="flex"
                            alignItems="center"
                            gap={2}
                        >
                            <Icon as={statusConfig.icon} size={16} />
                            {statusConfig.label}
                        </Badge>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6} px={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Basic Booking Info */}
                        <Box>
                            <Heading size="md" color="#2A2A2A" mb={4} display="flex" alignItems="center" gap={2}>
                                <Icon as={Calendar} color="#21D179" />
                                Informasi Peminjaman
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <Box
                                    bg="rgba(215, 215, 215, 0.5)"
                                    backdropFilter="blur(10px)"
                                    borderRadius="24px"
                                    p={4}
                                    border="1px solid #D7D7D7FF"
                                >
                                    <Text fontSize="sm" fontWeight="600" color="#2A2A2A" mb={2}>
                                        Nama Kegiatan
                                    </Text>
                                    <Text fontSize="sm" color="#2A2A2A">
                                        {booking.activityName || '-'}
                                    </Text>
                                </Box>
                                <Box
                                    bg="rgba(215, 215, 215, 0.5)"
                                    backdropFilter="blur(10px)"
                                    borderRadius="24px"
                                    p={4}
                                    border="1px solid #D7D7D7FF"
                                >
                                    <Text fontSize="sm" fontWeight="600" color="#2A2A2A" mb={2}>
                                        Tanggal & Waktu
                                    </Text>
                                    <Text fontSize="sm" color="#2A2A2A">
                                        {booking.startDate}
                                        {booking.endDate && booking.endDate !== booking.startDate &&
                                            ` - ${booking.endDate}`
                                        }
                                    </Text>
                                    <Text fontSize="sm" color="#2A2A2A" mt={1}>
                                        {booking.startTime} - {booking.endTime}
                                    </Text>
                                </Box>
                            </SimpleGrid>

                            {booking.rejectionReason && (
                                <Box
                                    bg="rgba(215, 215, 215, 0.5)"
                                    backdropFilter="blur(10px)"
                                    borderRadius="24px"
                                    p={4}
                                    border="1px solid #D7D7D7FF"
                                    mt={4}
                                >
                                    <HStack mb={2}>
                                        <Icon as={XCircle} color="#EF4444" size={16} />
                                        <Text fontSize="sm" fontWeight="600" color="#EF4444">
                                            Alasan Penolakan
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color="#2A2A2A">
                                        {booking.rejectionReason}
                                    </Text>
                                </Box>
                            )}
                        </Box>

                        <Divider borderColor="#D7D7D7FF" />

                        {/* Borrower Details */}
                        {booking.detail?.borrower && (
                            <Box>
                                <Heading size="md" color="#2A2A2A" mb={4} display="flex" alignItems="center" gap={2}>
                                    <Icon as={User} color="#21D179" />
                                    Informasi Peminjam
                                </Heading>
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                                    <VStack spacing={4}>
                                        <Box
                                            bg="rgba(215, 215, 215, 0.5)"
                                            backdropFilter="blur(10px)"
                                            borderRadius="24px"
                                            p={4}
                                            border="1px solid #D7D7D7FF"
                                            w="full"
                                        >
                                            <VStack align="start" spacing={3}>
                                                <HStack>
                                                    <Icon as={User} color="#21D179" size={16} />
                                                    <Text fontSize="sm" fontWeight="600" color="#2A2A2A">
                                                        {booking.detail.borrower.fullName}
                                                    </Text>
                                                </HStack>
                                                <HStack>
                                                    <Icon as={Mail} color="#21D179" size={16} />
                                                    <Text fontSize="sm" color="#2A2A2A">
                                                        {booking.detail.borrower.email}
                                                    </Text>
                                                </HStack>
                                                <HStack>
                                                    <Icon as={Phone} color="#21D179" size={16} />
                                                    <Text fontSize="sm" color="#2A2A2A">
                                                        {booking.detail.borrower.phoneNumber}
                                                    </Text>
                                                </HStack>
                                                <Tag colorScheme="green" size="sm">
                                                    <TagLabel>
                                                        {getBorrowerTypeLabel(booking.detail.borrower.borrowerType)}
                                                    </TagLabel>
                                                </Tag>
                                            </VStack>
                                        </Box>
                                    </VStack>
                                    {booking.detail.borrower.bankInfo && (
                                        <Box
                                            bg="rgba(215, 215, 215, 0.5)"
                                            backdropFilter="blur(10px)"
                                            borderRadius="24px"
                                            p={4}
                                            border="1px solid #D7D7D7FF"
                                        >
                                            <Text fontSize="sm" fontWeight="600" color="#2A2A2A" mb={3}>
                                                Informasi Bank
                                            </Text>
                                            <VStack align="start" spacing={2}>
                                                <Text fontSize="sm" color="#2A2A2A">
                                                    <strong>Bank:</strong> {booking.detail.borrower.bankInfo.bankName}
                                                </Text>
                                                <Text fontSize="sm" color="#2A2A2A" fontFamily="monospace">
                                                    <strong>Nomor:</strong> {booking.detail.borrower.bankInfo.bankNumber}
                                                </Text>
                                            </VStack>
                                        </Box>
                                    )}
                                </SimpleGrid>
                            </Box>
                        )}

                        {/* Building Details */}
                        {booking.detail?.building && (
                            <>
                                <Divider borderColor="#D7D7D7FF" />
                                <Box>
                                    <Heading size="md" color="#2A2A2A" mb={4} display="flex" alignItems="center" gap={2}>
                                        <Icon as={Building} color="#21D179" />
                                        Informasi Gedung
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                                        <VStack spacing={4}>
                                            <Box
                                                bg="rgba(215, 215, 215, 0.5)"
                                                backdropFilter="blur(10px)"
                                                borderRadius="24px"
                                                p={4}
                                                border="1px solid #D7D7D7FF"
                                                w="full"
                                            >
                                                <VStack align="start" spacing={3}>
                                                    <Text fontSize="lg" fontWeight="600" color="#2A2A2A">
                                                        {booking.detail.building.buildingName}
                                                    </Text>
                                                    <Text fontSize="sm" color="#666" lineHeight="1.5">
                                                        {booking.detail.building.description}
                                                    </Text>
                                                    <HStack>
                                                        <Icon as={MapPin} color="#21D179" size={16} />
                                                        <Text fontSize="sm" color="#2A2A2A">
                                                            {booking.detail.building.location}
                                                        </Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Icon as={Users} color="#21D179" size={16} />
                                                        <Text fontSize="sm" color="#2A2A2A">
                                                            Kapasitas: {booking.detail.building.capacity} orang
                                                        </Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Icon as={DollarSign} color="#21D179" size={16} />
                                                        <Text fontSize="sm" color="#2A2A2A">
                                                            {formatCurrency(booking.detail.building.rentalPrice)}
                                                        </Text>
                                                    </HStack>
                                                    <Tag colorScheme="blue" size="sm">
                                                        <TagLabel>{booking.detail.building.buildingType}</TagLabel>
                                                    </Tag>
                                                </VStack>
                                            </Box>
                                        </VStack>
                                        {booking.detail.building.buildingPhoto && (
                                            <Box>
                                                <Image
                                                    src={booking.detail.building.buildingPhoto}
                                                    alt={booking.detail.building.buildingName}
                                                    borderRadius="24px"
                                                    maxH="250px"
                                                    w="full"
                                                    objectFit="cover"
                                                />
                                            </Box>
                                        )}
                                    </SimpleGrid>
                                </Box>
                            </>
                        )}

                        {/* Payment Details */}
                        {booking.detail?.payment && (
                            <>
                                <Divider borderColor="#D7D7D7FF" />
                                <Box>
                                    <Heading size="md" color="#2A2A2A" mb={4} display="flex" alignItems="center" gap={2}>
                                        <Icon as={CreditCard} color="#21D179" />
                                        Informasi Pembayaran
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <Box
                                            bg="rgba(215, 215, 215, 0.5)"
                                            backdropFilter="blur(10px)"
                                            borderRadius="24px"
                                            p={4}
                                            border="1px solid #D7D7D7FF"
                                        >
                                            <VStack align="start" spacing={3}>
                                                <HStack justify="space-between" w="full">
                                                    <Text fontSize="sm" fontWeight="600" color="#2A2A2A">
                                                        Status Pembayaran
                                                    </Text>
                                                    <Badge
                                                        bg={paymentConfig.bgColor}
                                                        color={paymentConfig.textColor}
                                                        borderRadius="full"
                                                        px={2}
                                                        py={1}
                                                        fontSize="xs"
                                                    >
                                                        {paymentConfig.label}
                                                    </Badge>
                                                </HStack>
                                                <Text fontSize="lg" fontWeight="700" color="#2A2A2A">
                                                    {formatCurrency(booking.detail.payment.totalAmount)}
                                                </Text>
                                                <Text fontSize="sm" color="#666">
                                                    Metode: {booking.detail.payment.paymentMethod}
                                                </Text>
                                                <Text fontSize="sm" color="#666" fontFamily="monospace">
                                                    Invoice: {booking.detail.payment.invoiceNumber}
                                                </Text>
                                                <Text fontSize="sm" color="#666">
                                                    Tanggal: {booking.detail.payment.paymentDate}
                                                </Text>
                                            </VStack>
                                        </Box>
                                        {booking.detail.payment.paymentUrl && (
                                            <Box
                                                bg="rgba(215, 215, 215, 0.5)"
                                                backdropFilter="blur(10px)"
                                                borderRadius="24px"
                                                p={4}
                                                border="1px solid #D7D7D7FF"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Link
                                                    href={booking.detail.payment.paymentUrl}
                                                    isExternal
                                                    textDecoration="none"
                                                    _hover={{ textDecoration: 'none' }}
                                                >
                                                    <Button
                                                        leftIcon={<ExternalLink size={16} />}
                                                        colorScheme="blue"
                                                        size="lg"
                                                        borderRadius="9999px"
                                                    >
                                                        Buka Link Pembayaran
                                                    </Button>
                                                </Link>
                                            </Box>
                                        )}
                                    </SimpleGrid>
                                </Box>
                            </>
                        )}

                        {/* Proposal Letter */}
                        {(booking.proposalLetter || booking.detail?.documents?.proposalLetter) && (
                            <>
                                <Divider borderColor="#D7D7D7FF" />
                                <Box>
                                    <Heading size="md" color="#2A2A2A" mb={4} display="flex" alignItems="center" gap={2}>
                                        <Icon as={FileText} color="#21D179" />
                                        Dokumen Proposal
                                    </Heading>
                                    <Box
                                        bg="rgba(215, 215, 215, 0.5)"
                                        backdropFilter="blur(10px)"
                                        borderRadius="24px"
                                        p={4}
                                        border="1px solid #D7D7D7FF"
                                    >
                                        <VStack align="start" spacing={3}>
                                            <HStack>
                                                <Icon as={FileText} color="#21D179" size={16} />
                                                <Text fontSize="sm" fontWeight="600" color="#2A2A2A">
                                                    File Proposal
                                                </Text>
                                            </HStack>

                                            <Text fontSize="sm" color="#666" noOfLines={2}>
                                                {booking.proposalLetter || booking.detail?.documents?.proposalLetter?.url || 'File proposal tersedia'}
                                            </Text>

                                            <HStack spacing={3}>
                                                {booking.detail?.documents?.proposalLetter?.downloadUrl && (
                                                    <Link
                                                        href={booking.detail.documents.proposalLetter.downloadUrl}
                                                        isExternal
                                                        textDecoration="none"
                                                        _hover={{ textDecoration: 'none' }}
                                                    >
                                                        <Button
                                                            leftIcon={<Download size={16} />}
                                                            colorScheme="green"
                                                            variant="outline"
                                                            borderRadius="9999px"
                                                            size="sm"
                                                        >
                                                            Download
                                                        </Button>
                                                    </Link>
                                                )}

                                                {booking.detail?.documents?.proposalLetter?.previewUrl && (
                                                    <Link
                                                        href={booking.detail.documents.proposalLetter.previewUrl}
                                                        isExternal
                                                        textDecoration="none"
                                                        _hover={{ textDecoration: 'none' }}
                                                    >
                                                        <Button
                                                            leftIcon={<ExternalLink size={16} />}
                                                            colorScheme="blue"
                                                            variant="outline"
                                                            borderRadius="9999px"
                                                            size="sm"
                                                        >
                                                            Preview
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* Fallback jika hanya ada proposalLetter path tanpa detail.documents */}
                                                {booking.proposalLetter && !booking.detail?.documents?.proposalLetter && (
                                                    <Button
                                                        leftIcon={<FileText size={16} />}
                                                        colorScheme="gray"
                                                        variant="outline"
                                                        borderRadius="9999px"
                                                        size="sm"
                                                        isDisabled
                                                    >
                                                        File Tersedia
                                                    </Button>
                                                )}
                                            </HStack>
                                        </VStack>
                                    </Box>
                                </Box>
                            </>
                        )}

                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default BookingDetailModal; 