import {
    Box,
    Flex,
    HStack,
    Link,
    Button,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    IconButton,
    Container,
    useDisclosure,
    VStack,
    Collapse,
    Badge
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu as MenuIcon, X, Settings, Users, Building, BookOpen } from 'lucide-react';
import { useAuthStore } from '../utils/store';
import { useRole } from '../hooks/useAuth';
import { AdminOnly, UserOnly, AuthenticatedOnly, GuestOnly, RoleGuard } from './auth/RoleGuard';
import logoUnand from '../assets/logo.png';

const NavbarWithRoles = () => {
    const { isOpen, onToggle } = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { isAdmin, isUser, currentRole } = useRole();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Define navigation links based on authentication status and roles
    const getNavLinks = () => {
        if (!isAuthenticated) {
            return [
                { name: 'Beranda', path: '/', icon: null },
                { name: 'Jadwal', path: '/schedule', icon: null }
            ];
        }

        const baseLinks = [
            { name: 'Dashboard', path: isAdmin() ? '/admin' : '/dashboard', icon: null }
        ];

        if (isAdmin()) {
            return [
                ...baseLinks,
                { name: 'Gedung', path: '/admin/gedung', icon: Building },
                { name: 'Fasilitas', path: '/admin/fasilitas', icon: Settings },
                { name: 'Peminjaman', path: '/admin/peminjaman', icon: BookOpen },
                { name: 'Transaksi', path: '/admin/transaksi', icon: null },
                { name: 'Riwayat', path: '/admin/riwayat', icon: null }
            ];
        } else if (currentRole === 'BORROWER') { // Explicitly check for BORROWER
            return [
                ...baseLinks,
                { name: 'Jadwal', path: '/schedule', icon: null },
                { name: 'Peminjaman', path: '/bookings', icon: BookOpen },
                { name: 'Riwayat', path: '/history', icon: null },
                { name: 'Transaksi', path: '/transactions', icon: null }
            ];
        }

        return baseLinks;
    };

    const navLinks = getNavLinks();

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    return (
        <Box
            bg="rgba(255, 255, 255, 0.25)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.3)"
            px={4}
            position="sticky"
            top={0}
            zIndex={100}
            boxShadow="0 4px 20px rgba(116, 156, 115, 0.1)"
        >
            <Container maxW="7xl">
                <Flex h={16} alignItems="center" justifyContent="space-between">
                    {/* Logo */}
                    <Flex alignItems="center">
                        <Link
                            as={RouterLink}
                            to="/"
                            _hover={{ textDecoration: 'none' }}
                        >
                            <img src={logoUnand} alt="Logo" width={50} height={50} />
                        </Link>

                        {/* Role Badge */}
                        <AuthenticatedOnly>
                            <Badge
                                ml={3}
                                colorScheme={isAdmin() ? 'red' : 'green'}
                                variant="subtle"
                                borderRadius="full"
                                px={2}
                                fontSize="xs"
                            >
                                {currentRole}
                            </Badge>
                        </AuthenticatedOnly>
                    </Flex>

                    {/* Desktop Navigation */}
                    <HStack
                        as="nav"
                        spacing={8}
                        display={{ base: 'none', md: 'flex' }}
                        flex={1}
                        justifyContent="center"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                as={RouterLink}
                                to={link.path}
                                fontSize="sm"
                                fontWeight="medium"
                                color={isActiveLink(link.path) ? '#749C73' : '#444444'}
                                position="relative"
                                display="flex"
                                alignItems="center"
                                gap={1}
                                _hover={{
                                    textDecoration: 'none',
                                    color: '#749C73'
                                }}
                                _after={{
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-20px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    bg: '#749C73',
                                    transform: isActiveLink(link.path) ? 'scaleX(1)' : 'scaleX(0)',
                                    transition: 'transform 0.2s ease-in-out'
                                }}
                            >
                                {link.icon && <link.icon size={16} />}
                                {link.name}
                            </Link>
                        ))}
                    </HStack>

                    {/* Right Section */}
                    <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                        <AuthenticatedOnly>
                            {/* Admin Quick Actions */}
                            <AdminOnly>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        bg="rgba(255, 255, 255, 0.3)"
                                        backdropFilter="blur(10px)"
                                        border="1px solid rgba(255, 255, 255, 0.3)"
                                        borderRadius="full"
                                        icon={<Settings size={18} />}
                                        aria-label="Admin Actions"
                                        size="sm"
                                        color="#444444"
                                        _hover={{
                                            bg: "rgba(116, 156, 115, 0.2)",
                                            transform: "translateY(-1px)"
                                        }}
                                        transition="all 0.3s ease"
                                    />
                                    <MenuList
                                        bg="rgba(255, 255, 255, 0.25)"
                                        backdropFilter="blur(20px)"
                                        border="1px solid rgba(255, 255, 255, 0.3)"
                                        borderRadius="20px"
                                        boxShadow="0 8px 32px rgba(116, 156, 115, 0.15)"
                                    >
                                        <MenuItem
                                            onClick={() => navigate('/admin/settings')}
                                            bg="transparent"
                                            color="#444444"
                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                        >
                                            <Settings size={16} style={{ marginRight: '8px' }} />
                                            System Settings
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => navigate('/admin/users')}
                                            bg="transparent"
                                            color="#444444"
                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                        >
                                            <Users size={16} style={{ marginRight: '8px' }} />
                                            Manage Users
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </AdminOnly>

                            {/* Notification Bell */}
                            <Box position="relative">
                                <IconButton
                                    bg="rgba(255, 255, 255, 0.3)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    borderRadius="full"
                                    icon={<Bell size={18} />}
                                    aria-label="Notifications"
                                    size="sm"
                                    color="#444444"
                                    _hover={{
                                        bg: "rgba(116, 156, 115, 0.2)",
                                        transform: "translateY(-1px)"
                                    }}
                                    transition="all 0.3s ease"
                                />
                                <RoleGuard requiredRoles={['ADMIN', 'USER', 'MEMBER']}>
                                    <Badge
                                        position="absolute"
                                        top="0"
                                        right="0"
                                        bg="#749C73"
                                        color="white"
                                        borderRadius="full"
                                        fontSize="xs"
                                        px={1.5}
                                    >
                                        {isAdmin() ? '5' : '3'}
                                    </Badge>
                                </RoleGuard>
                            </Box>

                            {/* User Menu */}
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    bg="rgba(255, 255, 255, 0.3)"
                                    backdropFilter="blur(10px)"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    borderRadius="full"
                                    variant="unstyled"
                                    cursor="pointer"
                                    minW={0}
                                    p={1}
                                    _hover={{
                                        bg: "rgba(116, 156, 115, 0.2)",
                                        transform: "translateY(-1px)"
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    <Avatar
                                        size="sm"
                                        name={user?.name || user?.fullName || 'User'}
                                        bg={isAdmin() ? "#dc2626" : "#749C73"}
                                        color="white"
                                    />
                                </MenuButton>
                                <MenuList
                                    bg="rgba(255, 255, 255, 0.25)"
                                    backdropFilter="blur(20px)"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    borderRadius="20px"
                                    boxShadow="0 8px 32px rgba(116, 156, 115, 0.15)"
                                >
                                    {/* Role-specific menu items */}
                                    <UserOnly>
                                        <MenuItem
                                            onClick={() => navigate('/profile')}
                                            bg="transparent"
                                            color="#444444"
                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                        >
                                            Profil Saya
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => navigate('/settings')}
                                            bg="transparent"
                                            color="#444444"
                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                        >
                                            Pengaturan
                                        </MenuItem>
                                    </UserOnly>

                                    <AdminOnly>
                                        <MenuItem
                                            onClick={() => navigate('/admin/profile')}
                                            bg="transparent"
                                            color="#444444"
                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                        >
                                            Admin Profile
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => navigate('/admin/settings')}
                                            bg="transparent"
                                            color="#444444"
                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                        >
                                            System Settings
                                        </MenuItem>
                                        <MenuDivider borderColor="rgba(116, 156, 115, 0.2)" />
                                        <MenuItem
                                            onClick={() => navigate('/dashboard')}
                                            bg="transparent"
                                            color="#444444"
                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                        >
                                            View as User
                                        </MenuItem>
                                    </AdminOnly>

                                    <MenuDivider borderColor="rgba(116, 156, 115, 0.2)" />
                                    <MenuItem
                                        onClick={handleLogout}
                                        color="#749C73"
                                        bg="transparent"
                                        _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                    >
                                        Keluar
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </AuthenticatedOnly>

                        <GuestOnly>
                            <Button
                                as={RouterLink}
                                to="/login"
                                size="sm"
                                bg="#749C73"
                                color="white"
                                fontWeight="medium"
                                px={6}
                                borderRadius="full"
                                boxShadow="0 4px 15px rgba(116, 156, 115, 0.3)"
                                _hover={{
                                    bg: "#749C73",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 20px rgba(116, 156, 115, 0.4)"
                                }}
                                transition="all 0.3s ease"
                            >
                                Masuk / Daftar
                            </Button>
                        </GuestOnly>
                    </HStack>

                    {/* Mobile menu button */}
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        onClick={onToggle}
                        icon={isOpen ? <X size={20} /> : <MenuIcon size={24} />}
                        bg="rgba(255, 255, 255, 0.3)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(255, 255, 255, 0.3)"
                        borderRadius="full"
                        color="#444444"
                        aria-label="Toggle Navigation"
                        _hover={{
                            bg: "rgba(116, 156, 115, 0.2)",
                            transform: "translateY(-1px)"
                        }}
                        transition="all 0.3s ease"
                    />
                </Flex>

                {/* Mobile Navigation */}
                <Collapse in={isOpen} animateOpacity>
                    <VStack
                        bg="rgba(255, 255, 255, 0.25)"
                        backdropFilter="blur(20px)"
                        border="1px solid rgba(255, 255, 255, 0.3)"
                        borderRadius="20px"
                        boxShadow="0 8px 32px rgba(116, 156, 115, 0.15)"
                        p={4}
                        display={{ md: 'none' }}
                        spacing={4}
                        align="stretch"
                        mt={2}
                        mx={4}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                as={RouterLink}
                                to={link.path}
                                fontSize="sm"
                                fontWeight="medium"
                                color={isActiveLink(link.path) ? '#749C73' : '#444444'}
                                onClick={onToggle}
                                display="flex"
                                alignItems="center"
                                gap={2}
                                _hover={{
                                    textDecoration: 'none',
                                    color: '#749C73'
                                }}
                            >
                                {link.icon && <link.icon size={16} />}
                                {link.name}
                            </Link>
                        ))}

                        <AuthenticatedOnly>
                            <UserOnly>
                                <Link
                                    as={RouterLink}
                                    to="/profile"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="#444444"
                                    onClick={onToggle}
                                    _hover={{
                                        textDecoration: 'none',
                                        color: '#749C73'
                                    }}
                                >
                                    Profil Saya
                                </Link>
                            </UserOnly>

                            <Button
                                size="sm"
                                bg="rgba(116, 156, 115, 0.1)"
                                color="#749C73"
                                border="1px solid rgba(116, 156, 115, 0.3)"
                                borderRadius="full"
                                onClick={() => {
                                    handleLogout();
                                    onToggle();
                                }}
                                _hover={{
                                    bg: "rgba(116, 156, 115, 0.2)"
                                }}
                            >
                                Keluar
                            </Button>
                        </AuthenticatedOnly>

                        <GuestOnly>
                            <Button
                                as={RouterLink}
                                to="/login"
                                size="sm"
                                bg="#749C73"
                                color="white"
                                fontWeight="medium"
                                borderRadius="full"
                                onClick={onToggle}
                                _hover={{
                                    bg: "#749C73",
                                    transform: "translateY(-1px)"
                                }}
                                transition="all 0.3s ease"
                            >
                                Masuk / Daftar
                            </Button>
                        </GuestOnly>
                    </VStack>
                </Collapse>
            </Container>
        </Box>
    );
};

export default NavbarWithRoles; 