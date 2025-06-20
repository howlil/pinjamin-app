import React from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Icon,
    Text,
    Avatar,
    Button,
    Container,
    Heading,
    Divider,
    IconButton,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Tooltip
} from '@chakra-ui/react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building,
    Settings,
    BookOpen,
    DollarSign,
    History,
    Users,
    LogOut,
    Menu as MenuIcon,
    Bell
} from 'lucide-react';
import { useAuthStore } from '@/utils/store';
import { motion } from 'framer-motion';
import logoUnand from '@/assets/logo.png';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adminNavItems = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Gedung',
            path: '/admin/gedung',
            icon: Building
        },
        {
            name: 'Fasilitas',
            path: '/admin/fasilitas',
            icon: Settings
        },
        {
            name: 'Pengelola',
            path: '/admin/pengelola',
            icon: Users
        },
        {
            name: 'Peminjaman',
            path: '/admin/peminjaman',
            icon: BookOpen
        },
        {
            name: 'Transaksi',
            path: '/admin/transaksi',
            icon: DollarSign
        },
        {
            name: 'Riwayat',
            path: '/admin/riwayat',
            icon: History
        }
    ];

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const SidebarContent = () => (
        <VStack spacing={0} align="stretch" h="100%">
            {/* Logo Section */}
            <Box p={6}>
                <HStack spacing={3}>
                    <img src={logoUnand} alt="Logo" width={40} height={40} />
                    <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800">
                            Admin Panel
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Building Rental System
                        </Text>
                    </VStack>
                </HStack>
            </Box>

            <Divider />

            {/* Navigation */}
            <VStack spacing={2} p={4} flex={1} align="stretch">
                {adminNavItems.map((item, index) => {
                    const isActive = isActiveLink(item.path);
                    return (
                        <Button
                            key={item.name}
                            as={RouterLink}
                            to={item.path}
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={item.icon} />}
                            bg={isActive ? '#749C73' : 'transparent'}
                            color={isActive ? 'white' : 'gray.700'}
                            _hover={{
                                bg: isActive ? '#5a7c59' : 'gray.100',
                                color: isActive ? 'white' : 'gray.800',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(116, 156, 115, 0.3)'
                            }}
                            borderRadius="full"
                            h={12}
                            fontSize="sm"
                            fontWeight="medium"
                            onClick={onClose}
                            transition="all 0.3s ease"
                            boxShadow={isActive ? '0 4px 12px rgba(116, 156, 115, 0.4)' : 'none'}
                            w="100%"
                        >
                            {item.name}
                        </Button>
                    );
                })}
            </VStack>

            {/* Logout */}
            <Box p={4}>
                <Divider mb={4} />
                <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    leftIcon={<Icon as={LogOut} />}
                    color="red.500"
                    _hover={{
                        bg: 'red.50',
                        color: 'red.600',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                    borderRadius="full"
                    h={12}
                    fontSize="sm"
                    fontWeight="medium"
                    onClick={handleLogout}
                    w="100%"
                    transition="all 0.3s ease"
                >
                    Keluar
                </Button>
            </Box>
        </VStack>
    );

    return (
        <Flex h="100vh" bg="gray.50">
            {/* Desktop Sidebar */}
            <Box
                w="280px"
                h="calc(100vh - 32px)"
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(20px)"
                borderRight="1px"
                borderColor="gray.200"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                position="relative"
                borderRadius="20px"
                m={2}
                display={{ base: 'none', lg: 'block' }}
            >
                <SidebarContent />
            </Box>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent
                    bg="rgba(255, 255, 255, 0.95)"
                    backdropFilter="blur(20px)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    borderRadius="0 20px 20px 0"
                    ml={2}
                    mt={2}
                    mb={2}
                    h="calc(100vh - 16px)"
                >
                    <DrawerCloseButton
                        borderRadius="full"
                        _hover={{
                            transform: 'scale(1.1)',
                            bg: 'gray.100'
                        }}
                        transition="all 0.3s ease"
                    />
                    <SidebarContent />
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <Flex
                direction="column"
                flex={1}
                overflow="hidden"
                mr={2}
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box
                        bg="rgba(255, 255, 255, 0.95)"
                        backdropFilter="blur(20px)"
                        borderBottom="1px"
                        borderColor="gray.200"
                        px={6}
                        py={4}
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        position="relative"
                        zIndex={5}
                        borderRadius="20px"
                        mx={4}
                        mt={2}
                        mb={2}
                    >
                        <Flex justify="space-between" align="center">
                            {/* Mobile Menu Button & Title */}
                            <HStack spacing={4}>
                                <IconButton
                                    display={{ base: 'flex', lg: 'none' }}
                                    onClick={onOpen}
                                    variant="ghost"
                                    icon={<MenuIcon size={20} />}
                                    aria-label="Open menu"
                                    borderRadius="full"
                                    _hover={{
                                        bg: 'gray.100',
                                        transform: 'scale(1.05)'
                                    }}
                                    transition="all 0.3s ease"
                                />

                            </HStack>

                            {/* Header Right */}
                            <HStack spacing={4}>
                                {/* Notifications */}
                                <IconButton
                                    variant="ghost"
                                    icon={<Bell size={20} />}
                                    aria-label="Notifications"
                                    position="relative"
                                    borderRadius="full"
                                    _hover={{
                                        bg: 'gray.100',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                    }}
                                    transition="all 0.3s ease"
                                />

                                {/* User Info */}
                                <HStack spacing={3}>
                                    <VStack align="end" spacing={0} display={{ base: 'none', md: 'flex' }}>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                            {user?.name || user?.fullName || 'Admin'}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            Administrator
                                        </Text>
                                    </VStack>
                                    <Avatar
                                        size="sm"
                                        name={user?.name || user?.fullName || 'Admin'}
                                        bg="#749C73"
                                        color="white"
                                        cursor="pointer"
                                        _hover={{
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 12px rgba(116, 156, 115, 0.3)'
                                        }}
                                        transition="all 0.3s ease"
                                    />
                                </HStack>
                            </HStack>
                        </Flex>
                    </Box>
                </motion.div>

                {/* Page Content */}
                <Box
                    flex={1}
                    overflow="auto"
                    p={4}
                >
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    );
};

export default AdminLayout; 