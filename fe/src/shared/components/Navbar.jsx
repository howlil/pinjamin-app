import React, { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Icon,
    IconButton,
    Badge,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    Spinner,
    Center
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    User,
    LogOut,
    MenuIcon,
    Bell
} from 'lucide-react';
import { COLORS, GLASSMORPHISM, CORNER_RADIUS } from '../utils/designTokens';
import { useAuth } from '@/features/auth/api/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import logo from '@/assets/logo.png';

const NavItem = ({ to, children, icon: Icon, isActive, isExternal, onClick }) => {
    const hoverBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'gray.700');
    const activeBg = useColorModeValue(`${COLORS.primary}20`, 'green.900');
    const activeColor = COLORS.primary;

    if (onClick) {
        return (
            <Button
                variant="ghost"
                leftIcon={Icon ? <Icon size={18} /> : undefined}
                justifyContent="flex-start"
                w="full"
                h="44px"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : COLORS.text}
                fontWeight={isActive ? '600' : '500'}
                fontSize="sm"
                borderRadius={`${CORNER_RADIUS.components.button}px`}
                _hover={{
                    bg: isActive ? activeBg : hoverBg,
                    transform: 'translateX(4px)',
                }}
                transition="all 0.2s ease"
                onClick={onClick}
            >
                {children}
            </Button>
        );
    }

    return (
        <Button
            as={RouterLink}
            to={to}
            variant="ghost"
            leftIcon={Icon ? <Icon size={18} /> : undefined}
            justifyContent="flex-start"
            w="full"
            h="44px"
            bg={isActive ? activeBg : 'transparent'}
            color={isActive ? activeColor : COLORS.text}
            fontWeight={isActive ? '600' : '500'}
            fontSize="sm"
            borderRadius={`${CORNER_RADIUS.components.button}px`}
            _hover={{
                bg: isActive ? activeBg : hoverBg,
                transform: 'translateX(4px)',
                textDecoration: 'none'
            }}
            transition="all 0.2s ease"
        >
            {children}
        </Button>
    );
};

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isNotifOpen, onToggle: onNotifToggle, onClose: onNotifClose } = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [scrollY, setScrollY] = useState(0);

    // Use notification API for authenticated users
    const {
        notifications,
        unreadCount,
        loading: notificationLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        getNotificationIcon,
        isMarkingAsRead
    } = useNotifications();

    // Track scroll position for navbar transparency effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { to: '/', label: 'Beranda' },
        { to: '/schedule', label: 'Jadwal' },
        ...(isAuthenticated && user?.role !== 'ADMIN' ? [
            { to: '/transaction', label: 'Transaksi' },
            { to: '/history', label: 'Riwayat' },
        ] : [])
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            onClose();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
        onClose();
    };

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        if (notification.readStatus === 0) {
            await markAsRead(notification.id);
        }
    };

    // Load notifications when popup opens
    const handleNotificationToggle = () => {
        if (!isNotifOpen && isAuthenticated) {
            fetchNotifications({ page: 1, limit: 10 });
        }
        onNotifToggle();
    };

    // Dynamic navbar styles based on scroll position
    const navbarBg = scrollY > 0 ? 'rgba(255, 255, 255, 0.9)' : 'transparent';
    const navbarBlur = scrollY > 0 ? 'blur(15px)' : 'none';
    const navbarBorder = scrollY > 0 ? '1px solid rgba(215, 215, 215, 0.3)' : 'none';

    return (
        <>
            <Box
                as="nav"
                position="fixed"
                top={0}
                left={0}
                right={0}
                background={navbarBg}
                backdropFilter={navbarBlur}
                border={navbarBorder}
                borderTop="none"
                zIndex={1000}
                h="70px"
                transition="all 0.3s ease"
            >
                <Flex
                    maxW="7xl"
                    mx="auto"
                    px={6}
                    h="full"
                    align="center"
                    justify="space-between"
                >

                    <img
                        src={logo}
                        alt="logo"
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain'
                        }}
                    />

                    <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
                        {menuItems.map((item) => (
                            <NavItem
                                key={item.to}
                                to={item.to}
                                isActive={location.pathname === item.to}
                            >
                                {item.label}
                            </NavItem>
                        ))}
                    </HStack>

                    <HStack spacing={3}>
                        {isAuthenticated && user ? (
                            <>
                                {/* Desktop Notification Bell */}
                                {user.role !== 'ADMIN' && (
                                    <Popover
                                        isOpen={isNotifOpen}
                                        onClose={onNotifClose}
                                        placement="bottom-end"
                                        closeOnBlur={true}
                                    >
                                        <PopoverTrigger>
                                            <Box position="relative" display={{ base: 'none', md: 'block' }}>
                                                <IconButton
                                                    icon={<Bell size={18} />}
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleNotificationToggle}
                                                    bg="rgba(255, 255, 255, 0.6)"
                                                    backdropFilter="blur(10px)"
                                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                                    borderRadius="full"
                                                    _hover={{
                                                        bg: "rgba(255, 255, 255, 0.8)",
                                                        transform: "translateY(-1px)"
                                                    }}
                                                    transition="all 0.2s"
                                                />
                                                {unreadCount > 0 && (
                                                    <Badge
                                                        colorScheme="red"
                                                        borderRadius="full"
                                                        position="absolute"
                                                        top="-1px"
                                                        right="-1px"
                                                        fontSize="xs"
                                                        minW="16px"
                                                        h="16px"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        {unreadCount > 9 ? '9+' : unreadCount}
                                                    </Badge>
                                                )}
                                            </Box>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            w="320px"
                                            bg="rgba(255, 255, 255, 0.95)"
                                            backdropFilter="blur(15px)"
                                            border="1px solid rgba(215, 215, 215, 0.5)"
                                            borderRadius="20px"
                                            boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                                            _focus={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)" }}
                                        >
                                            <PopoverHeader
                                                fontWeight="600"
                                                fontSize="md"
                                                fontFamily="Inter, sans-serif"
                                                borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                                                py={3}
                                            >
                                                <HStack justify="space-between">
                                                    <Text>Notifikasi</Text>
                                                    <HStack spacing={2}>
                                                        {unreadCount > 0 && (
                                                            <Badge colorScheme="red" borderRadius="full" fontSize="xs">
                                                                {unreadCount}
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
                                                                loadingText="..."
                                                                fontFamily="Inter, sans-serif"
                                                                fontSize="xs"
                                                                _hover={{
                                                                    bg: "rgba(33, 209, 121, 0.1)"
                                                                }}
                                                            >
                                                                Tandai Semua
                                                            </Button>
                                                        )}
                                                    </HStack>
                                                </HStack>
                                            </PopoverHeader>
                                            <PopoverBody p={0} maxH="350px" overflowY="auto">
                                                {notificationLoading ? (
                                                    <Center p={4}>
                                                        <Spinner size="sm" color={COLORS.primary} />
                                                    </Center>
                                                ) : notifications.length > 0 ? (
                                                    <VStack spacing={0} align="stretch">
                                                        {notifications.map((notif, index) => (
                                                            <Box
                                                                key={notif.id}
                                                                p={3}
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
                                                                        right={3}
                                                                        transform="translateY(-50%)"
                                                                        zIndex={1}
                                                                    >
                                                                        <Spinner size="xs" color={COLORS.primary} />
                                                                    </Box>
                                                                )}
                                                                <HStack align="start" spacing={3}>
                                                                    <Text fontSize="md">
                                                                        {getNotificationIcon(notif.notificationType)}
                                                                    </Text>
                                                                    <VStack align="start" spacing={0.5} flex="1">
                                                                        <Text
                                                                            fontWeight={notif.readStatus === 0 ? "600" : "500"}
                                                                            fontSize="sm"
                                                                            fontFamily="Inter, sans-serif"
                                                                            color={COLORS.text}
                                                                            lineHeight="short"
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
                                                                            w="6px"
                                                                            h="6px"
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
                                                    <Box p={4} textAlign="center">
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
                                )}

                                {/* Desktop Profile Menu */}
                                <Menu>
                                    <MenuButton display={{ base: 'none', md: 'flex' }}>
                                        <HStack spacing={2}>
                                            <Avatar
                                                size="sm"
                                                name={user.fullName || user.email}
                                                src={user.avatar}
                                                bg={COLORS.primary}
                                            />
                                            <VStack spacing={0} align="start">
                                                <Text fontSize="sm" fontWeight="600" color={COLORS.text}>
                                                    {user.fullName || 'User'}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </MenuButton>
                                    <MenuList
                                        background="rgba(255, 255, 255, 0.9)"
                                        backdropFilter="blur(15px)"
                                        border="1px solid rgba(215, 215, 215, 0.3)"
                                        borderRadius={`${CORNER_RADIUS.components.modal}px`}
                                    >
                                        {user.role === 'ADMIN' && (
                                            <>
                                                <MenuItem
                                                    icon={<Icon as={() => <span>📊</span>} />}
                                                    onClick={() => {
                                                        navigate('/admin');
                                                        onClose();
                                                    }}
                                                >
                                                    Dashboard Admin
                                                </MenuItem>
                                                <MenuDivider />
                                            </>
                                        )}
                                        <MenuItem icon={<User size={16} />} onClick={handleProfileClick}>
                                            Profil Saya
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem
                                            icon={<LogOut size={16} />}
                                            onClick={handleLogout}
                                            color="red.500"
                                        >
                                            Keluar
                                        </MenuItem>
                                    </MenuList>
                                </Menu>

                                {/* Mobile Menu Button */}
                                <Button
                                    display={{ base: 'flex', md: 'none' }}
                                    variant="ghost"
                                    size="sm"
                                    borderRadius="full"
                                    p={0}
                                    minW="auto"
                                    h="40px"
                                    w="40px"
                                    onClick={onOpen}
                                >
                                    <MenuIcon size={20} />
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Desktop Auth Buttons */}
                                <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
                                    <Button
                                        as={RouterLink}
                                        to="/auth"
                                        variant="ghost"
                                        size="sm"
                                        borderRadius={`${CORNER_RADIUS.components.button}px`}
                                    >
                                        Masuk
                                    </Button>
                                    <Button
                                        as={RouterLink}
                                        to="/auth?tab=register"
                                        bg={COLORS.primary}
                                        color="white"
                                        size="sm"
                                        borderRadius={`${CORNER_RADIUS.components.button}px`}
                                        _hover={{
                                            bg: COLORS.primary,
                                            opacity: 0.9,
                                        }}
                                    >
                                        Daftar
                                    </Button>
                                </HStack>

                                {/* Mobile Menu for Unauthenticated */}
                                <Button
                                    display={{ base: 'flex', md: 'none' }}
                                    variant="ghost"
                                    size="sm"
                                    borderRadius="full"
                                    p={0}
                                    minW="auto"
                                    h="40px"
                                    w="40px"
                                    onClick={onOpen}
                                >
                                    <MenuIcon size={20} />
                                </Button>
                            </>
                        )}
                    </HStack>
                </Flex>
            </Box>

            {/* Mobile Menu Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="slideInBottom">
                <ModalOverlay
                    bg="rgba(0, 0, 0, 0.4)"
                    backdropFilter="blur(8px)"
                />
                <ModalContent
                    background="transparent"
                    display="flex"
                    alignItems="flex-end"
                    justifyContent="center"
                    p={0}
                    m={0}
                >
                    <ModalCloseButton
                        position="absolute"
                        top={4}
                        right={4}
                        zIndex={1001}
                        color="white"
                        bg="rgba(0, 0, 0, 0.3)"
                        borderRadius="full"
                        size="lg"
                        _hover={{
                            bg: "rgba(0, 0, 0, 0.5)"
                        }}
                    />

                    <Box
                        w="100%"
                        maxH="85vh"
                        background="rgba(255, 255, 255, 0.95)"
                        backdropFilter="blur(20px)"
                        borderTopRadius="24px"
                        border="1px solid rgba(215, 215, 215, 0.3)"
                        boxShadow="0 -10px 40px rgba(0, 0, 0, 0.15)"
                        p={6}
                        pb={8}
                        overflow="auto"
                    >
                        {/* Modal Header */}
                        <Box textAlign="center" mb={6}>
                            <Box
                                w={12}
                                h={1}
                                bg="gray.300"
                                borderRadius="full"
                                mx="auto"
                                mb={4}
                            />
                            <Text
                                fontSize="lg"
                                fontWeight="700"
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Menu
                            </Text>
                        </Box>

                        <VStack spacing={6} align="stretch">
                            {/* User Profile Section - Only for authenticated users */}
                            {isAuthenticated && user && (
                                <Box
                                    background="rgba(255, 255, 255, 0.8)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(215, 215, 215, 0.3)"
                                    borderRadius="20px"
                                    p={4}
                                >
                                    <HStack spacing={4}>
                                        <Avatar
                                            size="lg"
                                            name={user.fullName || user.email}
                                            src={user.avatar}
                                            bg={COLORS.primary}
                                        />
                                        <VStack spacing={1} align="start" flex={1}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="600"
                                                color={COLORS.text}
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {user.fullName || 'User'}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {user.email}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color={COLORS.primary}
                                                fontWeight="500"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {user.role === 'BORROWER' ? 'Peminjam' : 'Admin'}
                                            </Text>
                                        </VStack>
                                        {/* Mobile Notification Bell */}
                                        {user.role !== 'ADMIN' && (
                                            <Box position="relative">
                                                <IconButton
                                                    icon={<Bell size={18} />}
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleNotificationToggle}
                                                    bg="rgba(255, 255, 255, 0.6)"
                                                    backdropFilter="blur(10px)"
                                                    border="1px solid rgba(215, 215, 215, 0.5)"
                                                    borderRadius="full"
                                                />
                                                {unreadCount > 0 && (
                                                    <Badge
                                                        colorScheme="red"
                                                        borderRadius="full"
                                                        position="absolute"
                                                        top="-1px"
                                                        right="-1px"
                                                        fontSize="xs"
                                                        minW="16px"
                                                        h="16px"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        {unreadCount > 9 ? '9+' : unreadCount}
                                                    </Badge>
                                                )}
                                            </Box>
                                        )}
                                    </HStack>

                                    {/* Mobile Notifications Section */}
                                    {user.role !== 'ADMIN' && isNotifOpen && (
                                        <Box mt={4} p={3} bg="rgba(248, 250, 252, 0.8)" borderRadius="12px">
                                            <HStack justify="space-between" mb={2}>
                                                <Text fontSize="sm" fontWeight="600" color={COLORS.text}>
                                                    Notifikasi {unreadCount > 0 && `(${unreadCount} baru)`}
                                                </Text>
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
                                                        loadingText="..."
                                                        fontFamily="Inter, sans-serif"
                                                        fontSize="xs"
                                                        _hover={{
                                                            bg: "rgba(33, 209, 121, 0.1)"
                                                        }}
                                                    >
                                                        Tandai Semua
                                                    </Button>
                                                )}
                                            </HStack>
                                            {notificationLoading ? (
                                                <Center py={4}>
                                                    <Spinner size="sm" color={COLORS.primary} />
                                                </Center>
                                            ) : notifications.length > 0 ? (
                                                <VStack spacing={2} align="stretch" maxH="200px" overflowY="auto">
                                                    {notifications.slice(0, 3).map((notif) => (
                                                        <Box
                                                            key={notif.id}
                                                            p={2}
                                                            bg={notif.readStatus === 0 ? "rgba(33, 209, 121, 0.05)" : "transparent"}
                                                            borderRadius="8px"
                                                            cursor="pointer"
                                                            onClick={() => handleNotificationClick(notif)}
                                                            position="relative"
                                                            opacity={isMarkingAsRead(notif.id) ? 0.6 : 1}
                                                            pointerEvents={isMarkingAsRead(notif.id) ? "none" : "auto"}
                                                        >
                                                            {isMarkingAsRead(notif.id) && (
                                                                <Box
                                                                    position="absolute"
                                                                    top="50%"
                                                                    right={3}
                                                                    transform="translateY(-50%)"
                                                                    zIndex={1}
                                                                >
                                                                    <Spinner size="xs" color={COLORS.primary} />
                                                                </Box>
                                                            )}
                                                            <HStack align="start" spacing={2}>
                                                                <Text fontSize="sm">
                                                                    {getNotificationIcon(notif.notificationType)}
                                                                </Text>
                                                                <VStack align="start" spacing={0.5} flex="1">
                                                                    <Text
                                                                        fontSize="xs"
                                                                        fontWeight={notif.readStatus === 0 ? "600" : "500"}
                                                                        color={COLORS.text}
                                                                        lineHeight="short"
                                                                    >
                                                                        {notif.title}
                                                                    </Text>
                                                                    <Text
                                                                        fontSize="xs"
                                                                        color="gray.600"
                                                                        lineHeight="short"
                                                                    >
                                                                        {notif.message.length > 50
                                                                            ? `${notif.message.substring(0, 50)}...`
                                                                            : notif.message}
                                                                    </Text>
                                                                </VStack>
                                                                {notif.readStatus === 0 && (
                                                                    <Box
                                                                        w="4px"
                                                                        h="4px"
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
                                                <Text fontSize="xs" color="gray.500" textAlign="center" py={2}>
                                                    Tidak ada notifikasi
                                                </Text>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Menu Items */}
                            <VStack spacing={3} align="stretch">
                                {menuItems.map((item) => {
                                    const isActive = location.pathname === item.to;
                                    return (
                                        <Button
                                            key={item.to}
                                            as={RouterLink}
                                            to={item.to}
                                            onClick={onClose}
                                            variant="ghost"
                                            justifyContent="flex-start"
                                            h="56px"
                                            bg={isActive ? `${COLORS.primary}20` : 'transparent'}
                                            color={isActive ? COLORS.primary : COLORS.text}
                                            fontWeight={isActive ? '600' : '500'}
                                            fontSize="md"
                                            borderRadius="16px"
                                            _hover={{
                                                bg: isActive ? `${COLORS.primary}20` : 'rgba(0, 0, 0, 0.05)',
                                                transform: 'translateX(4px)'
                                            }}
                                            transition="all 0.2s ease"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </VStack>

                            {/* Action Buttons */}
                            <VStack spacing={4} pt={4}>
                                {isAuthenticated ? (
                                    <>
                                        {user.role === 'ADMIN' && (
                                            <Button
                                                onClick={() => {
                                                    navigate('/admin');
                                                    onClose();
                                                }}
                                                variant="solid"
                                                w="full"
                                                h="50px"
                                                borderRadius="16px"
                                                bg={COLORS.primary}
                                                color="white"
                                                leftIcon={<Icon as={() => <span>📊</span>} />}
                                                _hover={{
                                                    bg: COLORS.primary,
                                                    opacity: 0.9,
                                                    transform: 'translateY(-2px)'
                                                }}
                                                transition="all 0.2s ease"
                                                fontFamily="Inter, sans-serif"
                                                fontWeight="600"
                                            >
                                                Dashboard Admin
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleProfileClick}
                                            variant="outline"
                                            w="full"
                                            h="50px"
                                            borderRadius="16px"
                                            borderColor={COLORS.primary}
                                            color={COLORS.primary}
                                            leftIcon={<User size={20} />}
                                            _hover={{
                                                bg: `${COLORS.primary}10`,
                                                transform: 'translateY(-2px)'
                                            }}
                                            transition="all 0.2s ease"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                        >
                                            Profil Saya
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            w="full"
                                            h="50px"
                                            borderRadius="16px"
                                            borderColor="red.300"
                                            color="red.500"
                                            leftIcon={<LogOut size={20} />}
                                            _hover={{
                                                bg: 'red.50',
                                                transform: 'translateY(-2px)'
                                            }}
                                            transition="all 0.2s ease"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                        >
                                            Keluar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            as={RouterLink}
                                            to="/auth"
                                            onClick={onClose}
                                            variant="outline"
                                            w="full"
                                            h="50px"
                                            borderRadius="16px"
                                            borderColor={COLORS.primary}
                                            color={COLORS.primary}
                                            _hover={{
                                                bg: `${COLORS.primary}10`,
                                                transform: 'translateY(-2px)'
                                            }}
                                            transition="all 0.2s ease"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="500"
                                        >
                                            Masuk
                                        </Button>
                                        <Button
                                            as={RouterLink}
                                            to="/auth?tab=register"
                                            onClick={onClose}
                                            bg={COLORS.primary}
                                            color="white"
                                            w="full"
                                            h="50px"
                                            borderRadius="16px"
                                            _hover={{
                                                bg: COLORS.primary,
                                                opacity: 0.9,
                                                transform: 'translateY(-2px)'
                                            }}
                                            transition="all 0.2s ease"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="600"
                                        >
                                            Daftar Sekarang
                                        </Button>
                                    </>
                                )}
                            </VStack>
                        </VStack>
                    </Box>
                </ModalContent>
            </Modal>

        </>
    );
};

export default Navbar; 