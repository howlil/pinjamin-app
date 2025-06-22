import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Icon,
    Badge,
    Button,
    IconButton,
    Flex,
    ScaleFade,
    useDisclosure,
    Portal,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    X,
    Calendar,
    CreditCard,
    CheckCircle,
    AlertTriangle,
    Info,
    User,
    Building,
    Clock
} from 'lucide-react';
import { COLORS } from '../../utils/designTokens';

const MotionBox = motion(Box);

// Notification type configurations
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
            icon: X,
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
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

const NotificationPopup = ({
    notification,
    isVisible,
    onClose,
    onMarkAsRead,
    autoHideDelay = 8000
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (isVisible && !isHovered && autoHideDelay > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDelay);

            return () => clearTimeout(timer);
        }
    }, [isVisible, isHovered, autoHideDelay, onClose]);

    if (!notification || !isVisible) return null;

    const config = getNotificationConfig(notification.notificationType);
    const IconComponent = config.icon;

    const handleMarkAsRead = () => {
        if (onMarkAsRead && notification.notificationId) {
            onMarkAsRead(notification.notificationId);
        }
        onClose();
    };

    return (
        <Portal>
            <AnimatePresence>
                {isVisible && (
                    <Box
                        position="fixed"
                        top={4}
                        right={4}
                        zIndex={9999}
                        maxW={isMobile ? "calc(100vw - 32px)" : "400px"}
                        w="full"
                    >
                        <MotionBox
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                            bg="rgba(255, 255, 255, 0.95)"
                            backdropFilter="blur(20px)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            borderRadius="16px"
                            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            p={4}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            _hover={{
                                transform: "scale(1.02)",
                                boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.35)"
                            }}
                            style={{ transition: "all 0.3s ease" }}
                        >
                            {/* Header */}
                            <Flex justify="space-between" align="flex-start" mb={3}>
                                <HStack spacing={3} flex={1}>
                                    <Box
                                        w={10}
                                        h={10}
                                        bg={config.bg}
                                        border={config.border}
                                        borderRadius="12px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                    >
                                        <Icon as={IconComponent} boxSize={5} color={config.color} />
                                    </Box>

                                    <VStack align="start" spacing={0} flex={1} minW={0}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="#444444"
                                            noOfLines={1}
                                        >
                                            {notification.title || config.title}
                                        </Text>
                                        <HStack spacing={2}>
                                            <Text
                                                fontSize="xs"
                                                color="#666666"
                                                fontWeight="medium"
                                            >
                                                {formatDate(notification.date)}
                                            </Text>
                                            {!notification.readStatus && (
                                                <Badge
                                                    bg="rgba(239, 68, 68, 0.15)"
                                                    color="#ef4444"
                                                    fontSize="xs"
                                                    px={2}
                                                    py={0.5}
                                                    borderRadius="full"
                                                    fontWeight="semibold"
                                                >
                                                    Baru
                                                </Badge>
                                            )}
                                        </HStack>
                                    </VStack>
                                </HStack>

                                <IconButton
                                    icon={<X size={16} />}
                                    size="sm"
                                    variant="ghost"
                                    color="#666666"
                                    _hover={{
                                        bg: "rgba(239, 68, 68, 0.1)",
                                        color: "#ef4444"
                                    }}
                                    borderRadius="8px"
                                    onClick={onClose}
                                    flexShrink={0}
                                />
                            </Flex>

                            {/* Message */}
                            <Text
                                fontSize="sm"
                                color="#444444"
                                lineHeight="1.5"
                                mb={4}
                                pl={13}
                            >
                                {notification.message}
                            </Text>

                            {/* Actions */}
                            <Flex justify="flex-end" gap={2} pl={13}>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    color="#666666"
                                    _hover={{
                                        bg: "rgba(116, 156, 115, 0.1)",
                                        color: COLORS.primary
                                    }}
                                    borderRadius="8px"
                                    onClick={onClose}
                                    fontSize="xs"
                                >
                                    Tutup
                                </Button>

                                {!notification.readStatus && (
                                    <Button
                                        size="sm"
                                        bg="rgba(116, 156, 115, 0.15)"
                                        color={COLORS.primary}
                                        border="1px solid rgba(116, 156, 115, 0.2)"
                                        _hover={{
                                            bg: "rgba(116, 156, 115, 0.25)",
                                            borderColor: "rgba(116, 156, 115, 0.3)"
                                        }}
                                        borderRadius="8px"
                                        onClick={handleMarkAsRead}
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        Tandai Dibaca
                                    </Button>
                                )}
                            </Flex>

                            {/* Progress bar for auto-hide */}
                            {autoHideDelay > 0 && !isHovered && (
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    h="2px"
                                    bg="rgba(116, 156, 115, 0.1)"
                                    borderRadius="0 0 16px 16px"
                                    overflow="hidden"
                                >
                                    <MotionBox
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{
                                            duration: autoHideDelay / 1000,
                                            ease: "linear"
                                        }}
                                        h="full"
                                        bg={COLORS.primary}
                                    />
                                </Box>
                            )}
                        </MotionBox>
                    </Box>
                )}
            </AnimatePresence>
        </Portal>
    );
};

// Notification queue manager
export const NotificationQueue = ({ notifications, onClose, onMarkAsRead }) => {
    const [currentNotification, setCurrentNotification] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        if (notifications.length > 0) {
            setQueue(prev => [...prev, ...notifications]);
        }
    }, [notifications]);

    useEffect(() => {
        if (!currentNotification && queue.length > 0) {
            setCurrentNotification(queue[0]);
            setQueue(prev => prev.slice(1));
        }
    }, [currentNotification, queue]);

    const handleClose = () => {
        setCurrentNotification(null);
        if (onClose) {
            onClose();
        }
    };

    const handleMarkAsRead = (notificationId) => {
        if (onMarkAsRead) {
            onMarkAsRead(notificationId);
        }
        setCurrentNotification(null);
    };

    return (
        <NotificationPopup
            notification={currentNotification}
            isVisible={!!currentNotification}
            onClose={handleClose}
            onMarkAsRead={handleMarkAsRead}
        />
    );
};

export default NotificationPopup;
