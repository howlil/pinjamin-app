import {
    Box,
    Flex,
    HStack,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    IconButton,
    Container,
    Badge
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Settings, Users, Building, BookOpen, DollarSign, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../utils/store';
import { useRole } from '../../hooks/auth';
import { AdminOnly, UserOnly, AuthenticatedOnly, GuestOnly, RoleGuard } from '../auth/RoleGuard';
import { NotificationPopup } from '../common';
import logoUnand from '../../assets/logo.png';

const RoleBasedNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { isAdmin, isUser, currentRole } = useRole();
    const [scrollY, setScrollY] = useState(0);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Define navigation links based on roles
    const getNavLinks = () => {
        if (!isAuthenticated) {
            return [
                { name: 'Beranda', path: '/' },
                { name: 'Jadwal', path: '/schedule' }
            ];
        }

        if (isAdmin()) {
            return [
                { name: 'Dashboard', path: '/admin/dashboard' },
                { name: 'Gedung', path: '/admin/gedung', icon: Building },
                { name: 'Fasilitas', path: '/admin/fasilitas', icon: Settings },
                { name: 'Pengelola', path: '/admin/pengelola', icon: Users },
                { name: 'Peminjaman', path: '/admin/peminjaman', icon: BookOpen },
                { name: 'Transaksi', path: '/admin/transaksi', icon: DollarSign },
                { name: 'Riwayat', path: '/admin/riwayat', icon: History },
            ];
        } else if (isUser()) {
            return [
                { name: 'Jadwal', path: '/schedule' },
                { name: 'Riwayat', path: '/history' },
                { name: 'Transaksi', path: '/transactions' },
            ];
        }

        return [];
    };

    const navLinks = getNavLinks();
    const isActiveLink = (path) => location.pathname === path;

    // Calculate glassmorphism opacity based on scroll
    const isScrolled = scrollY > 0;
    const glassOpacity = Math.min(scrollY / 100, 1); // Gradually increase opacity up to 100px scroll

    return (
        <Box
            bg={isScrolled ? `rgba(255, 255, 255, ${0.25 * glassOpacity})` : 'transparent'}
            backdropFilter={isScrolled ? `blur(${20 * glassOpacity}px)` : 'none'}
            border={isScrolled ? `1px solid rgba(255, 255, 255, ${0.3 * glassOpacity})` : 'none'}
            px={4}
            position="sticky"
            top={0}
            zIndex={100}
            boxShadow={isScrolled ? `0 4px 20px rgba(116, 156, 115, ${0.1 * glassOpacity})` : 'none'}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
            <Container maxW="7xl">
                <Flex h={16} alignItems="center" justifyContent="space-between">
                    {/* Logo and Role Badge */}
                    <Flex alignItems="center">
                        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                            <img src={logoUnand} alt="Logo" width={50} height={50} />
                        </Link>

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

                    {/* Navigation Links */}
                    <HStack spacing={8} flex={1} justifyContent="center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                as={RouterLink}
                                to={link.path}
                                fontSize="sm"
                                fontWeight="medium"
                                color={isActiveLink(link.path) ? '#749C73' : '#444444'}
                                display="flex"
                                alignItems="center"
                                gap={1}
                                transition="color 0.2s ease"
                                _hover={{
                                    textDecoration: 'none',
                                    color: '#749C73'
                                }}
                            >
                                {link.icon && <link.icon size={16} />}
                                {link.name}
                            </Link>
                        ))}
                    </HStack>

                    {/* Right Section */}
                    <HStack spacing={4}>
                        <AuthenticatedOnly>
                            {/* Admin Quick Actions */}
                            <AdminOnly>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        bg={isScrolled ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}
                                        backdropFilter={isScrolled ? "blur(10px)" : "none"}
                                        border={isScrolled ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)"}
                                        borderRadius="full"
                                        icon={<Settings size={18} />}
                                        aria-label="Admin Actions"
                                        size="sm"
                                        transition="all 0.3s ease"
                                        _hover={{ bg: "rgba(116, 156, 115, 0.2)" }}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => navigate('/admin/users')}>
                                            <Users size={16} style={{ marginRight: '8px' }} />
                                            Manage Users
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </AdminOnly>

                            {/* Notifications */}
                            <NotificationPopup>
                                <IconButton
                                    bg={isScrolled ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}
                                    backdropFilter={isScrolled ? "blur(10px)" : "none"}
                                    border={isScrolled ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)"}
                                    borderRadius="full"
                                    icon={<Bell size={18} />}
                                    size="sm"
                                    transition="all 0.3s ease"
                                    _hover={{ bg: "rgba(116, 156, 115, 0.2)" }}
                                />
                            </NotificationPopup>

                            {/* User Menu */}
                            <Menu>
                                <MenuButton>
                                    <Avatar
                                        size="sm"
                                        name={user?.name || user?.fullName || 'User'}
                                        bg={isAdmin() ? "#dc2626" : "#749C73"}
                                        color="white"
                                    />
                                </MenuButton>
                                <MenuList>
                                    <UserOnly>
                                        <MenuItem onClick={() => navigate('/profile')}>
                                            Profil Saya
                                        </MenuItem>
                                    </UserOnly>

                                    <AdminOnly>
                                        <MenuItem onClick={() => navigate('/admin/profile')}>
                                            Admin Profile
                                        </MenuItem>
                                        <MenuDivider />
                                    </AdminOnly>

                                    <MenuDivider />
                                    <MenuItem onClick={handleLogout} color="#749C73">
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
                                borderRadius="full"
                                transition="transform 0.2s ease"
                                _hover={{ transform: "translateY(-2px)" }}
                            >
                                Masuk / Daftar
                            </Button>
                        </GuestOnly>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default RoleBasedNavbar;