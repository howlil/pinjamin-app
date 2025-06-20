import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Badge,
    Button,
    IconButton,
    Divider,
    Spinner,
    Alert,
    AlertIcon,
    Avatar,
    Tooltip,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverCloseButton,
    PopoverArrow
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, RefreshCw } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationItem = ({ notification, onMarkAsRead, getNotificationIcon, getNotificationColor, formatNotificationDate }) => {
    const isUnread = notification.readStatus === 0;

    const handleClick = () => {
        if (isUnread) {
            onMarkAsRead(notification.id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                p={3}
                cursor="pointer"
                bg={isUnread ? `${COLORS.primary}05` : 'transparent'}
                borderLeft={isUnread ? `3px solid ${COLORS.primary}` : '3px solid transparent'}
                _hover={{
                    bg: `${COLORS.primary}10`,
                    transform: 'translateX(2px)'
                }}
                transition="all 0.2s ease"
                onClick={handleClick}
            >
                <HStack spacing={3} align="start">
                    {/* Notification Icon */}
                    <Box
                        w={8}
                        h={8}
                        bg={`${getNotificationColor(notification.notificationType)}.100`}
                        rounded="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="sm"
                        flexShrink={0}
                    >
                        {getNotificationIcon(notification.notificationType)}
                    </Box>

                    {/* Notification Content */}
                    <VStack align="start" spacing={1} flex={1} minW={0}>
                        <HStack justify="space-between" w="full">
                            <Text
                                fontSize="sm"
                                fontWeight={isUnread ? "semibold" : "medium"}
                                color={COLORS.black}
                                noOfLines={1}
                            >
                                {notification.title}
                            </Text>
                            {isUnread && (
                                <Box
                                    w={2}
                                    h={2}
                                    bg={COLORS.primary}
                                    rounded="full"
                                    flexShrink={0}
                                />
                            )}
                        </HStack>

                        <Text
                            fontSize="xs"
                            color={COLORS.gray[600]}
                            noOfLines={2}
                            lineHeight="1.3"
                        >
                            {notification.message}
                        </Text>

                        <Text
                            fontSize="xs"
                            color={COLORS.gray[500]}
                            fontWeight="medium"
                        >
                            {formatNotificationDate(notification.date)}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        </motion.div>
    );
};

const NotificationPopup = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
        getNotificationIcon,
        getNotificationColor,
        formatNotificationDate
    } = useNotifications();

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleRefresh = () => {
        refreshNotifications();
    };

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement="bottom-end"
            closeOnBlur={true}
        >
            <PopoverTrigger>
                <Box position="relative" cursor="pointer">
                    {children}
                    {unreadCount > 0 && (
                        <Badge
                            position="absolute"
                            top="-2px"
                            right="-2px"
                            bg={COLORS.primary}
                            color="white"
                            borderRadius="full"
                            fontSize="xs"
                            px={1.5}
                            py={0.5}
                            fontWeight="bold"
                            minW="18px"
                            textAlign="center"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Box>
            </PopoverTrigger>

            <PopoverContent
                w="400px"
                maxH="500px"
                bg="white"
                border="1px"
                borderColor={`${COLORS.primary}20`}
                borderRadius="16px"
                shadow={SHADOWS.soft}
                overflow="hidden"
            >
                <PopoverArrow bg="white" />
                <PopoverCloseButton />

                {/* Header */}
                <PopoverHeader
                    bg={`${COLORS.primary}05`}
                    borderBottom="1px"
                    borderColor={`${COLORS.primary}20`}
                    p={4}
                >
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={0}>
                            <Text fontSize="lg" fontWeight="bold" color={COLORS.black}>
                                Notifikasi
                            </Text>
                            <Text fontSize="sm" color={COLORS.gray[600]}>
                                {unreadCount > 0 ? `${unreadCount} notifikasi baru` : 'Tidak ada notifikasi baru'}
                            </Text>
                        </VStack>

                        <HStack spacing={1}>
                            <Tooltip label="Refresh">
                                <IconButton
                                    icon={<RefreshCw size={16} />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="green"
                                    onClick={handleRefresh}
                                    isLoading={loading}
                                />
                            </Tooltip>
                            {unreadCount > 0 && (
                                <Tooltip label="Tandai semua sebagai dibaca">
                                    <IconButton
                                        icon={<CheckCheck size={16} />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="green"
                                        onClick={handleMarkAllAsRead}
                                    />
                                </Tooltip>
                            )}
                        </HStack>
                    </HStack>
                </PopoverHeader>

                {/* Body */}
                <PopoverBody p={0} maxH="350px" overflowY="auto">
                    {loading && (
                        <Box p={8} textAlign="center">
                            <VStack spacing={3}>
                                <Spinner size="lg" color={COLORS.primary} />
                                <Text fontSize="sm" color={COLORS.gray[600]}>
                                    Memuat notifikasi...
                                </Text>
                            </VStack>
                        </Box>
                    )}

                    {error && (
                        <Box p={4}>
                            <Alert status="error" rounded="lg" size="sm">
                                <AlertIcon />
                                <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" fontWeight="semibold">
                                        Gagal memuat notifikasi
                                    </Text>
                                    <Text fontSize="xs">{error}</Text>
                                </VStack>
                            </Alert>
                        </Box>
                    )}

                    {!loading && !error && notifications.length === 0 && (
                        <Box p={8} textAlign="center">
                            <VStack spacing={3}>
                                <Box
                                    w={16}
                                    h={16}
                                    bg={`${COLORS.primary}10`}
                                    rounded="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="2xl"
                                >
                                    🔔
                                </Box>
                                <VStack spacing={1}>
                                    <Text fontSize="sm" fontWeight="semibold" color={COLORS.black}>
                                        Tidak ada notifikasi
                                    </Text>
                                    <Text fontSize="xs" color={COLORS.gray[500]}>
                                        Notifikasi baru akan muncul di sini
                                    </Text>
                                </VStack>
                            </VStack>
                        </Box>
                    )}

                    {!loading && !error && notifications.length > 0 && (
                        <VStack spacing={0} align="stretch">
                            {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <NotificationItem
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                        getNotificationIcon={getNotificationIcon}
                                        getNotificationColor={getNotificationColor}
                                        formatNotificationDate={formatNotificationDate}
                                    />
                                    {index < notifications.length - 1 && (
                                        <Divider borderColor={`${COLORS.primary}10`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </VStack>
                    )}
                </PopoverBody>

                {/* Footer */}
                {!loading && !error && notifications.length > 0 && (
                    <PopoverFooter
                        bg={`${COLORS.primary}05`}
                        borderTop="1px"
                        borderColor={`${COLORS.primary}20`}
                        p={3}
                        textAlign="center"
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="green"
                            fontSize="xs"
                            fontWeight="medium"
                            onClick={onClose}
                        >
                            Lihat Semua Notifikasi
                        </Button>
                    </PopoverFooter>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPopup;
