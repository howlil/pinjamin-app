import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
    Text,
    VStack,
    HStack,
    Badge,
    Button,
    Icon,
    Divider,
    useBreakpointValue,
    Code,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    Bell,
    Calendar,
    CreditCard,
    CheckCircle,
    AlertTriangle,
    Info,
    User,
    Clock,
    Database,
    Hash,
    Type,
    MessageSquare,
    Eye,
    EyeOff
} from 'lucide-react';
import { COLORS } from '../../utils/designTokens';

const MotionBox = motion(Box);

// Get notification icon and color
const getNotificationConfig = (type) => {
    const configs = {
        'BOOKING_APPROVED': {
            icon: CheckCircle,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            title: 'Peminjaman Disetujui'
        },
        'BOOKING_REJECTED': {
            icon: AlertTriangle,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            title: 'Peminjaman Ditolak'
        },
        'BOOKING_REMINDER': {
            icon: Clock,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            title: 'Pengingat Peminjaman'
        },
        'PAYMENT_SUCCESS': {
            icon: CreditCard,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            title: 'Pembayaran Berhasil'
        },
        'PAYMENT_FAILED': {
            icon: AlertTriangle,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            title: 'Pembayaran Gagal'
        },
        'SYSTEM_MAINTENANCE': {
            icon: Info,
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            title: 'Pemberitahuan Sistem'
        },
        'DEFAULT': {
            icon: Bell,
            color: COLORS.primary,
            bg: 'rgba(116, 156, 115, 0.15)',
            border: '1px solid rgba(116, 156, 115, 0.2)',
            title: 'Notifikasi'
        }
    };

    return configs[type] || configs.DEFAULT;
};

// Format date
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return {
            full: date.toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            short: date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        };
    } catch (error) {
        return { full: dateString, short: dateString };
    }
};

const NotificationDetailModal = ({
    isOpen,
    onClose,
    notification,
    onMarkAsRead
}) => {
    const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });

    if (!notification) return null;

    const config = getNotificationConfig(notification.notificationType);
    const IconComponent = config.icon;
    const formattedDate = formatDate(notification.date);

    const handleMarkAsRead = () => {
        if (onMarkAsRead && notification.notificationId && !notification.readStatus) {
            onMarkAsRead(notification.notificationId);
        }
    };

    // Fields untuk ditampilkan
    const notificationFields = [
        {
            key: 'notificationId',
            label: 'ID Notifikasi',
            value: notification.notificationId,
            icon: Hash,
            type: 'text'
        },
        {
            key: 'title',
            label: 'Judul',
            value: notification.title,
            icon: Type,
            type: 'text'
        },
        {
            key: 'message',
            label: 'Pesan',
            value: notification.message,
            icon: MessageSquare,
            type: 'textarea'
        },
        {
            key: 'notificationType',
            label: 'Tipe Notifikasi',
            value: notification.notificationType,
            icon: Database,
            type: 'badge'
        },
        {
            key: 'date',
            label: 'Tanggal',
            value: formattedDate.full,
            icon: Calendar,
            type: 'text'
        },
        {
            key: 'readStatus',
            label: 'Status Baca',
            value: notification.readStatus,
            icon: notification.readStatus ? Eye : EyeOff,
            type: 'boolean'
        }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={modalSize} scrollBehavior="inside">
            <ModalOverlay
                bg="blackAlpha.300"
                backdropFilter="blur(10px)"
            />
            <ModalContent
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="20px"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            >
                <ModalHeader>
                    <HStack spacing={3}>
                        <Box
                            w={12}
                            h={12}
                            bg={config.bg}
                            border={config.border}
                            borderRadius="16px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={IconComponent} boxSize={6} color={config.color} />
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Text fontSize="lg" fontWeight="bold" color="#444444">
                                Detail Notifikasi
                            </Text>
                            <Text fontSize="sm" color="#666666">
                                Informasi lengkap notifikasi
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody>
                    <VStack spacing={6} align="stretch">
                        {/* Status Badge */}
                        <HStack justify="center" spacing={3}>
                            <Badge
                                bg={notification.readStatus ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)"}
                                color={notification.readStatus ? "#10b981" : "#ef4444"}
                                border={notification.readStatus ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)"}
                                px={4}
                                py={2}
                                borderRadius="full"
                                fontWeight="bold"
                                fontSize="sm"
                            >
                                {notification.readStatus ? "✅ Sudah Dibaca" : "🔔 Belum Dibaca"}
                            </Badge>

                            <Badge
                                bg={config.bg}
                                color={config.color}
                                border={config.border}
                                px={4}
                                py={2}
                                borderRadius="full"
                                fontWeight="bold"
                                fontSize="sm"
                            >
                                {config.title}
                            </Badge>
                        </HStack>

                        <Divider />

                        {/* Main Content */}
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            p={4}
                            bg="rgba(255, 255, 255, 0.5)"
                            borderRadius="12px"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                        >
                            <VStack spacing={4} align="stretch">
                                <Text fontSize="lg" fontWeight="bold" color="#444444" textAlign="center">
                                    {notification.title}
                                </Text>

                                <Text fontSize="md" color="#444444" lineHeight="1.6" textAlign="center">
                                    {notification.message}
                                </Text>

                                <Text fontSize="sm" color="#666666" textAlign="center">
                                    📅 {formattedDate.short}
                                </Text>
                            </VStack>
                        </MotionBox>

                        {/* Technical Details */}
                        <Accordion allowToggle>
                            <AccordionItem border="none">
                                <AccordionButton
                                    bg="rgba(116, 156, 115, 0.05)"
                                    borderRadius="12px"
                                    p={4}
                                    _hover={{
                                        bg: "rgba(116, 156, 115, 0.1)"
                                    }}
                                >
                                    <Box flex="1" textAlign="left">
                                        <HStack spacing={2}>
                                            <Icon as={Database} boxSize={4} color={COLORS.primary} />
                                            <Text fontWeight="semibold" color="#444444">
                                                Detail Teknis
                                            </Text>
                                        </HStack>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    <VStack spacing={3} align="stretch">
                                        {notificationFields.map((field) => {
                                            const FieldIcon = field.icon;

                                            return (
                                                <HStack
                                                    key={field.key}
                                                    justify="space-between"
                                                    p={3}
                                                    bg="rgba(255, 255, 255, 0.3)"
                                                    borderRadius="8px"
                                                    border="1px solid rgba(255, 255, 255, 0.2)"
                                                >
                                                    <HStack spacing={2} flex="0 0 auto">
                                                        <Icon as={FieldIcon} boxSize={4} color="#666666" />
                                                        <Text fontSize="sm" fontWeight="medium" color="#666666">
                                                            {field.label}:
                                                        </Text>
                                                    </HStack>

                                                    <Box flex="1" textAlign="right">
                                                        {field.type === 'badge' ? (
                                                            <Badge
                                                                variant="outline"
                                                                colorScheme="green"
                                                                fontSize="xs"
                                                            >
                                                                {field.value}
                                                            </Badge>
                                                        ) : field.type === 'boolean' ? (
                                                            <Badge
                                                                colorScheme={field.value ? "green" : "red"}
                                                                fontSize="xs"
                                                            >
                                                                {field.value ? "True" : "False"}
                                                            </Badge>
                                                        ) : field.type === 'textarea' ? (
                                                            <Text fontSize="sm" color="#444444" textAlign="right">
                                                                "{field.value}"
                                                            </Text>
                                                        ) : (
                                                            <Code fontSize="xs" bg="rgba(116, 156, 115, 0.1)">
                                                                {field.value}
                                                            </Code>
                                                        )}
                                                    </Box>
                                                </HStack>
                                            );
                                        })}
                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                        {/* Raw Data */}
                        <Accordion allowToggle>
                            <AccordionItem border="none">
                                <AccordionButton
                                    bg="rgba(59, 130, 246, 0.05)"
                                    borderRadius="12px"
                                    p={4}
                                    _hover={{
                                        bg: "rgba(59, 130, 246, 0.1)"
                                    }}
                                >
                                    <Box flex="1" textAlign="left">
                                        <HStack spacing={2}>
                                            <Icon as={Database} boxSize={4} color="blue.500" />
                                            <Text fontWeight="semibold" color="#444444">
                                                Raw JSON Data
                                            </Text>
                                        </HStack>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    <Box
                                        p={4}
                                        bg="rgba(0, 0, 0, 0.05)"
                                        borderRadius="8px"
                                        border="1px solid rgba(0, 0, 0, 0.1)"
                                        overflowX="auto"
                                    >
                                        <Code
                                            display="block"
                                            whiteSpace="pre-wrap"
                                            fontSize="xs"
                                            bg="transparent"
                                        >
                                            {JSON.stringify(notification, null, 2)}
                                        </Code>
                                    </Box>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3}>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            color="#666666"
                            _hover={{
                                bg: "rgba(116, 156, 115, 0.1)",
                                color: COLORS.primary
                            }}
                        >
                            Tutup
                        </Button>

                        {!notification.readStatus && (
                            <Button
                                leftIcon={<Eye size={16} />}
                                bg="rgba(116, 156, 115, 0.15)"
                                color={COLORS.primary}
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                _hover={{
                                    bg: "rgba(116, 156, 115, 0.25)",
                                    borderColor: "rgba(116, 156, 115, 0.3)"
                                }}
                                onClick={handleMarkAsRead}
                            >
                                Tandai Dibaca
                            </Button>
                        )}
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NotificationDetailModal; 