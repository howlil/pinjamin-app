import React, { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Badge,
    Divider,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    Spinner,
    Center
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCog,
    Wrench,
    History,
    CreditCard,
    LogOut,
    Menu as MenuIcon,
    ChevronLeft,
    ChevronRight,
    Bell,
    User,
    Settings,
    Home
} from 'lucide-react';
import { COLORS, GLASSMORPHISM, CORNER_RADIUS } from '../utils/designTokens';
import { useAuth } from '@/features/auth/api/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import logo from '@/assets/logo.png';

const SidebarItem = ({ to, children, icon: Icon, isActive, isCollapsed, badge }) => {
    return (
        <Button
            as={RouterLink}
            to={to}
            variant="ghost"
            leftIcon={!isCollapsed ? <Icon size={20} /> : undefined}
            justifyContent={isCollapsed ? "center" : "flex-start"}
            w="full"
            h="48px"
            bg={isActive ? `${COLORS.primary}15` : 'transparent'}
            color={isActive ? COLORS.primary : COLORS.text}
            fontWeight={isActive ? '600' : '500'}
            fontSize="sm"
            borderRadius="12px"
            position="relative"
            _hover={{
                bg: isActive ? `${COLORS.primary}20` : 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(2px)',
                textDecoration: 'none'
            }}
            transition="all 0.2s ease"
            px={isCollapsed ? 2 : 4}
        >
            {isCollapsed ? (
                <Icon size={20} />
            ) : (
                <>
                    {children}
                    {badge && (
                        <Badge
                            ml="auto"
                            bg={COLORS.primary}
                            color="white"
                            borderRadius="full"
                            fontSize="xs"
                            minW="20px"
                            h="20px"
                        >
                            {badge}
                        </Badge>
                    )}
                </>
            )}
        </Button>
    );
};

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isNotifOpen, onToggle: onNotifToggle, onClose: onNotifClose } = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Use real notification API
    const {
        notifications,
        unreadCount,
        loading: notificationLoading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        getNotificationIcon,
        isMarkingAsRead,
        refreshNotifications
    } = useNotifications();

    const sidebarItems = [
        {
            to: '/admin/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            to: '/admin/manage-building',
            label: 'Kelola Gedung',
            icon: Building2
        },
        {
            to: '/admin/manage-facility',
            label: 'Kelola Fasilitas',
            icon: Wrench
        },
        {
            to: '/admin/manage-building-manager',
            label: 'Kelola Building Manager',
            icon: UserCog
        },
        {
            to: '/admin/manage-borrower',
            label: 'Kelola Peminjam',
            icon: Users
        },
        {
            to: '/admin/history-borrower',
            label: 'Riwayat Peminjam',
            icon: History
        },
        {
            to: '/admin/history-transaction',
            label: 'Riwayat Transaksi',
            icon: CreditCard
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        if (notification.readStatus === 0) {
            await markAsRead(notification.id);
            // Force refresh unread count after marking as read
            setTimeout(() => {
                fetchUnreadCount();
            }, 500);
        }
    };

    // Load notifications when popup opens
    const handleNotificationToggle = async () => {
        if (!isNotifOpen) {
            // Always refresh both notifications and unread count when opening
            await Promise.all([
                fetchNotifications({ page: 1, limit: 10 }),
                fetchUnreadCount()
            ]);
        }
        onNotifToggle();
    };

    const currentPath = location.pathname;
    const currentItem = sidebarItems.find(item => item.to === currentPath);

    const SidebarContent = ({ onItemClick }) => (
        <VStack h="full" spacing={0} bg="rgba(255, 255, 255, 0.95)" backdropFilter="blur(15px)">
            {/* Logo Section */}
            <Box p={isCollapsed ? 4 : 6} w="full">
                <HStack justify="center">
                    <img
                        src={logo}
                        alt="logo"
                        style={{
                            width: isCollapsed ? '40px' : '60px',
                            height: isCollapsed ? '40px' : '60px',
                            objectFit: 'contain'
                        }}
                    />
                    {!isCollapsed && (
                        <VStack spacing={0} align="start">
                            <Text fontSize="lg" fontWeight="700" color={COLORS.primary}>
                                PINJAMIN
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontWeight="500">
                                Admin Panel
                            </Text>
                        </VStack>
                    )}
                </HStack>
            </Box>

            <Divider />

            {/* Navigation Items */}
            <VStack flex={1} spacing={2} p={4} w="full" align="stretch">
                {sidebarItems.map((item) => (
                    <SidebarItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        isActive={currentPath === item.to}
                        isCollapsed={isCollapsed}
                        badge={item.badge}
                        onClick={onItemClick}
                    >
                        {item.label}
                    </SidebarItem>
                ))}
            </VStack>
        </VStack>
    );

    return (
        <Flex h="100vh" overflow="hidden">
            {/* Desktop Sidebar */}
            <Box
                w={isCollapsed ? "80px" : "280px"}
                transition="width 0.3s ease"
                display={{ base: 'none', lg: 'block' }}
                position="relative"
                borderRight="1px solid rgba(215, 215, 215, 0.3)"
            >
                <SidebarContent />

                {/* Collapse Toggle Button */}
                <IconButton
                    icon={isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    size="sm"
                    position="absolute"
                    top="50%"
                    right="-12px"
                    transform="translateY(-50%)"
                    bg="white"
                    border="1px solid rgba(215, 215, 215, 0.3)"
                    borderRadius="full"
                    boxShadow="sm"
                    zIndex={10}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    _hover={{ bg: 'gray.50' }}
                />
            </Box>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody p={0}>
                        <SidebarContent onItemClick={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content Area */}
            <Flex flex={1} direction="column" overflow="hidden">
                {/* Header */}
                <Box
                    h="70px"
                    bg="rgba(255, 255, 255, 0.95)"
                    backdropFilter="blur(15px)"
                    borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                    px={6}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    position="relative"
                    zIndex={100}
                >
                    <HStack spacing={4}>
                        {/* Mobile Menu Button */}
                        <IconButton
                            icon={<MenuIcon size={20} />}
                            variant="ghost"
                            size="sm"
                            display={{ base: 'flex', lg: 'none' }}
                            onClick={onOpen}
                        />

                        {/* Page Title */}
                        <VStack spacing={0} align="start">
                            <Text fontSize="lg" fontWeight="700" color={COLORS.text}>
                                {currentItem?.label || 'Admin Panel'}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Kelola sistem peminjaman ruangan
                            </Text>
                        </VStack>
                    </HStack>

                    {/* Header Actions */}
                    <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                        {/* Bell Notification */}
                        <Popover
                            isOpen={isNotifOpen}
                            onClose={onNotifClose}
                            placement="bottom-end"
                            closeOnBlur={true}
                            boundary="clippingParents"
                            strategy="fixed"
                        >
                            <PopoverTrigger>
                                <Box position="relative">
                                    <IconButton
                                        icon={<Bell size={20} />}
                                        variant="ghost"
                                        size="md"
                                        onClick={handleNotificationToggle}
                                        bg="rgba(255, 255, 255, 0.6)"
                                        backdropFilter="blur(10px)"
                                        border="1px solid rgba(215, 215, 215, 0.5)"
                                        borderRadius="full"
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.8)",
                                            transform: "translateY(-1px)",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                                        }}
                                        transition="all 0.2s"
                                    />
                                    {unreadCount > 0 && (
                                        <Badge
                                            colorScheme="red"
                                            borderRadius="full"
                                            position="absolute"
                                            top="-2px"
                                            right="-2px"
                                            fontSize="xs"
                                            minW="18px"
                                            h="18px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </Badge>
                                    )}
                                </Box>
                            </PopoverTrigger>
                            <PopoverContent
                                w="350px"
                                bg="rgba(255, 255, 255, 0.95)"
                                backdropFilter="blur(15px)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                borderRadius="24px"
                                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                                _focus={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)" }}
                                zIndex={1000}
                            >
                                <PopoverHeader
                                    fontWeight="700"
                                    fontSize="lg"
                                    fontFamily="Inter, sans-serif"
                                    borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                                    py={4}
                                >
                                    <HStack justify="space-between">
                                        <Text>Notifikasi</Text>
                                        <HStack spacing={2}>
                                            {unreadCount > 0 && (
                                                <Badge colorScheme="red" borderRadius="full">
                                                    {unreadCount} baru
                                                </Badge>
                                            )}
                                            {unreadCount > 0 && (
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    colorScheme="green"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAllAsRead();
                                                    }}
                                                    isLoading={notificationLoading}
                                                    loadingText="Menandai..."
                                                    fontFamily="Inter, sans-serif"
                                                    fontSize="xs"
                                                    _hover={{
                                                        bg: "rgba(33, 209, 121, 0.1)"
                                                    }}
                                                    _disabled={{
                                                        opacity: 0.6,
                                                        cursor: "not-allowed"
                                                    }}
                                                    disabled={notificationLoading}
                                                >
                                                    Tandai Semua
                                                </Button>
                                            )}
                                        </HStack>
                                    </HStack>
                                </PopoverHeader>
                                <PopoverBody p={0} maxH="400px" overflowY="auto">
                                    {notificationLoading ? (
                                        <Center p={6}>
                                            <Spinner size="md" color={COLORS.primary} />
                                        </Center>
                                    ) : notifications.length > 0 ? (
                                        <VStack spacing={0} align="stretch">
                                            {notifications.map((notif, index) => (
                                                <Box
                                                    key={notif.id}
                                                    p={4}
                                                    borderBottom={index < notifications.length - 1 ? "1px solid rgba(215, 215, 215, 0.3)" : "none"}
                                                    cursor="pointer"
                                                    bg={notif.readStatus === 0 ? "rgba(33, 209, 121, 0.05)" : "transparent"}
                                                    _hover={{
                                                        bg: "rgba(33, 209, 121, 0.08)"
                                                    }}
                                                    transition="background 0.2s"
                                                    onClick={() => handleNotificationClick(notif)}
                                                    position="relative"
                                                    opacity={isMarkingAsRead(notif.id) ? 0.6 : 1}
                                                    pointerEvents={isMarkingAsRead(notif.id) ? "none" : "auto"}
                                                >
                                                    {isMarkingAsRead(notif.id) && (
                                                        <Box
                                                            position="absolute"
                                                            top="50%"
                                                            right={4}
                                                            transform="translateY(-50%)"
                                                            zIndex={1}
                                                        >
                                                            <Spinner size="xs" color={COLORS.primary} />
                                                        </Box>
                                                    )}
                                                    <HStack align="start" spacing={3}>
                                                        <Text fontSize="lg">
                                                            {getNotificationIcon(notif.notificationType)}
                                                        </Text>
                                                        <VStack align="start" spacing={1} flex="1">
                                                            <Text
                                                                fontWeight={notif.readStatus === 0 ? "700" : "500"}
                                                                fontSize="sm"
                                                                fontFamily="Inter, sans-serif"
                                                                color={COLORS.text}
                                                            >
                                                                {notif.title}
                                                            </Text>
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray.600"
                                                                fontFamily="Inter, sans-serif"
                                                                lineHeight="short"
                                                            >
                                                                {notif.message}
                                                            </Text>
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray.500"
                                                                fontFamily="Inter, sans-serif"
                                                            >
                                                                {notif.date}
                                                            </Text>
                                                        </VStack>
                                                        {notif.readStatus === 0 && (
                                                            <Box
                                                                w="8px"
                                                                h="8px"
                                                                bg={COLORS.primary}
                                                                borderRadius="full"
                                                                mt={1}
                                                            />
                                                        )}
                                                    </HStack>
                                                </Box>
                                            ))}
                                        </VStack>
                                    ) : (
                                        <Box p={6} textAlign="center">
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                Tidak ada notifikasi
                                            </Text>
                                        </Box>
                                    )}
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>

                        {/* Profile Menu */}
                        <Menu
                            placement="bottom-end"
                            strategy="fixed"
                        >
                            <MenuButton
                                as={Button}
                                variant="ghost"
                                p={2}
                                h="auto"
                                bg="rgba(255, 255, 255, 0.6)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                borderRadius="full"
                                _hover={{
                                    bg: "rgba(255, 255, 255, 0.8)",
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}
                                _active={{
                                    bg: "rgba(255, 255, 255, 0.9)"
                                }}
                                transition="all 0.2s"
                            >
                                <HStack spacing={3}>
                                    <Avatar
                                        size="sm"
                                        name={user?.fullName || user?.email}
                                        src={user?.avatar}
                                        bg={COLORS.primary}
                                        color="white"
                                    />
                                    <VStack spacing={0} align="start" display={{ base: "none", md: "flex" }}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            fontFamily="Inter, sans-serif"
                                            color={COLORS.text}
                                        >
                                            {user?.fullName || 'Admin'}
                                        </Text>
                                        <Text
                                            fontSize="xs"
                                            color="gray.600"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            Administrator
                                        </Text>
                                    </VStack>
                                </HStack>
                            </MenuButton>
                            <MenuList
                                bg="rgba(255, 255, 255, 0.95)"
                                backdropFilter="blur(15px)"
                                border="1px solid rgba(215, 215, 215, 0.5)"
                                borderRadius="24px"
                                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                                py={2}
                                minW="200px"
                                zIndex={1000}
                            >
                                <MenuItem
                                    icon={<User size={16} />}
                                    onClick={() => navigate('/profile')}
                                    bg="transparent"
                                    _hover={{
                                        bg: "rgba(33, 209, 121, 0.08)"
                                    }}
                                    borderRadius="12px"
                                    mx={2}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Profile
                                </MenuItem>

                                <MenuDivider borderColor="rgba(215, 215, 215, 0.5)" />
                                <MenuItem
                                    icon={<Home size={16} />}
                                    onClick={handleGoHome}
                                    bg="transparent"
                                    _hover={{
                                        bg: "rgba(33, 209, 121, 0.08)"
                                    }}
                                    borderRadius="12px"
                                    mx={2}
                                    fontFamily="Inter, sans-serif"
                                >
                                    Ke Beranda
                                </MenuItem>
                                <MenuItem
                                    icon={<LogOut size={16} />}
                                    onClick={handleLogout}
                                    bg="transparent"
                                    _hover={{
                                        bg: "rgba(239, 68, 68, 0.08)",
                                        color: "red.500"
                                    }}
                                    borderRadius="12px"
                                    mx={2}
                                    fontFamily="Inter, sans-serif"
                                    color="red.500"
                                >
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Box>

                {/* Main Content */}
                <Box
                    flex={1}
                    overflow="auto"
                    bg="rgba(248, 250, 252, 0.8)"
                    position="relative"
                >
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    );
};

export default AdminLayout; 