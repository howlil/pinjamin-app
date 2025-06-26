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
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    User,
    LogOut,
    MenuIcon
} from 'lucide-react';
import { COLORS, GLASSMORPHISM, CORNER_RADIUS } from '../utils/designTokens';
import { useAuth } from '@/features/auth/api/useAuth';
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
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [scrollY, setScrollY] = useState(0);

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
                                    </HStack>
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