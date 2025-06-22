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
    Tooltip,
    useBreakpointValue
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
import { useAuthStore } from '../../utils/store';
import { motion } from 'framer-motion';
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';
import logoUnand from '../../assets/logo.png';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Responsive values
    const sidebarWidth = useBreakpointValue({ base: "280px", xl: "300px" });
    const contentPadding = useBreakpointValue({ base: 2, sm: 3, md: 4 });
    const headerPadding = useBreakpointValue({ base: 4, md: 6 });

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
        <VStack spacing={0} align="stretch" h="100%" position="relative" zIndex={1}>
            {/* Logo Section */}
            <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                p={5}
            >
                <HStack spacing={3}>
                    <MotionBox
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        w={10}
                        h={10}
                        bg="rgba(116, 156, 115, 0.15)"
                        borderRadius="12px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid rgba(116, 156, 115, 0.2)"
                        overflow="hidden"
                    >
                        <img src={logoUnand} alt="Logo" width={24} height={24} />
                    </MotionBox>
                    <VStack align="start" spacing={0}>
                        <Text fontSize="md" fontWeight="bold" color="#444444">
                            Admin Panel
                        </Text>
                        <Text fontSize="xs" color="#666666">
                            Building Rental System
                        </Text>
                    </VStack>
                </HStack>
            </MotionBox>

            {/* Navigation */}
            <VStack spacing={1} px={4} flex={1} align="stretch">
                {adminNavItems.map((item, index) => {
                    const isActive = isActiveLink(item.path);
                    return (
                        <MotionButton
                            key={item.name}
                            as={RouterLink}
                            to={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={item.icon} size={16} />}
                            bg={isActive ? 'rgba(116, 156, 115, 0.15)' : 'transparent'}
                            color={isActive ? COLORS.primary : '#666666'}
                            _hover={{
                                bg: isActive ? 'rgba(116, 156, 115, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                color: isActive ? COLORS.primary : '#444444',
                                backdropFilter: "blur(8px)",
                                boxShadow: `0 4px 12px ${isActive ? 'rgba(116, 156, 115, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
                            }}
                            borderRadius="10px"
                            h={10}
                            fontSize="sm"
                            fontWeight={isActive ? "semibold" : "medium"}
                            onClick={onClose}
                            transition="all 0.2s ease"
                            boxShadow={isActive ? '0 2px 8px rgba(116, 156, 115, 0.2)' : 'none'}
                            border={isActive ? `1px solid rgba(116, 156, 115, 0.3)` : 'none'}
                            w="100%"
                        >
                            {item.name}
                        </MotionButton>
                    );
                })}
            </VStack>

            {/* Logout */}
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                p={4}
            >
                <MotionButton
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    variant="ghost"
                    justifyContent="flex-start"
                    leftIcon={<Icon as={LogOut} size={16} />}
                    color="#ef4444"
                    _hover={{
                        bg: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        backdropFilter: "blur(8px)",
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                    }}
                    borderRadius="10px"
                    h={10}
                    fontSize="sm"
                    fontWeight="medium"
                    onClick={handleLogout}
                    w="100%"
                    transition="all 0.2s ease"
                >
                    Keluar
                </MotionButton>
            </MotionBox>
        </VStack>
    );

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            position="relative"
            overflow="hidden"
        >
            {/* Global Background Pattern */}
     

            <Flex h="100vh" position="relative" zIndex={1} p={contentPadding}>
                {/* Desktop Sidebar */}
                <MotionBox
                    initial={{ x: -280, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    w={sidebarWidth}
                    h="100%"
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    position="relative"
                    borderRadius="20px"
                    mr={4}
                    display={{ base: 'none', lg: 'block' }}
                    overflow="hidden"
                >
                 
                    <SidebarContent />
                </MotionBox>

                {/* Mobile Drawer */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay backdropFilter="blur(4px)" bg="rgba(0, 0, 0, 0.3)" />
                    <DrawerContent
                        bg="rgba(255, 255, 255, 0.08)"
                        backdropFilter="blur(16px)"
                        border="1px solid rgba(255, 255, 255, 0.12)"
                        boxShadow="0 20px 60px rgba(116, 156, 115, 0.15)"
                        borderRadius="0 20px 20px 0"
                        ml={contentPadding}
                        mt={contentPadding}
                        mb={contentPadding}
                        h={`calc(100vh - ${contentPadding * 2 * 4}px)`}
                        overflow="hidden"
                        position="relative"
                    >
                        <AnimatedGridPattern
                            numSquares={20}
                            maxOpacity={0.04}
                            duration={5}
                            repeatDelay={2.5}
                            className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                        />
                        <DrawerCloseButton
                            borderRadius="8px"
                            bg="rgba(255, 255, 255, 0.1)"
                            backdropFilter="blur(8px)"
                            border="1px solid rgba(255, 255, 255, 0.15)"
                            color="#666666"
                            _hover={{
                                bg: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                transform: 'scale(1.05)'
                            }}
                            transition="all 0.2s ease"
                            zIndex={2}
                        />
                        <SidebarContent />
                    </DrawerContent>
                </Drawer>

                {/* Main Content */}
                <Flex
                    direction="column"
                    flex={1}
                    overflow="hidden"
                >
                    {/* Header */}
                    <MotionBox
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        bg="rgba(255, 255, 255, 0.08)"
                        backdropFilter="blur(16px)"
                        border="1px solid rgba(255, 255, 255, 0.12)"
                        borderRadius="20px"
                        boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                        px={headerPadding}
                        py={4}
                        mb={4}
                        position="relative"
                        overflow="hidden"
                    >
                     

                        <Flex justify="space-between" align="center" position="relative" zIndex={1}>
                            {/* Mobile Menu Button */}
                            <HStack spacing={4}>
                                <IconButton
                                    display={{ base: 'flex', lg: 'none' }}
                                    onClick={onOpen}
                                    variant="ghost"
                                    icon={<MenuIcon size={18} />}
                                    aria-label="Open menu"
                                    bg="rgba(255, 255, 255, 0.1)"
                                    backdropFilter="blur(8px)"
                                    border="1px solid rgba(255, 255, 255, 0.15)"
                                    borderRadius="10px"
                                    color="#666666"
                                    _hover={{
                                        bg: "rgba(116, 156, 115, 0.15)",
                                        borderColor: "rgba(116, 156, 115, 0.3)",
                                        color: COLORS.primary,
                                        transform: 'scale(1.05)'
                                    }}
                                    transition="all 0.2s ease"
                                />
                            </HStack>

                            {/* Header Right */}
                            <HStack spacing={3}>
                                {/* Notifications */}
                                <Tooltip label="Notifikasi" placement="bottom">
                                    <IconButton
                                        variant="ghost"
                                        icon={<Bell size={18} />}
                                        aria-label="Notifications"
                                        position="relative"
                                        bg="rgba(255, 255, 255, 0.1)"
                                        backdropFilter="blur(8px)"
                                        border="1px solid rgba(255, 255, 255, 0.15)"
                                        borderRadius="10px"
                                        color="#666666"
                                        _hover={{
                                            bg: "rgba(59, 130, 246, 0.15)",
                                            borderColor: "rgba(59, 130, 246, 0.3)",
                                            color: "#3b82f6",
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                                        }}
                                        transition="all 0.2s ease"
                                    />
                                </Tooltip>

                                {/* User Info */}
                                <HStack spacing={3}>
                                    <VStack align="end" spacing={0} display={{ base: 'none', md: 'flex' }}>
                                        <Text fontSize="sm" fontWeight="semibold" color="#444444">
                                            {user?.name || user?.fullName || 'Admin'}
                                        </Text>
                                        <Text fontSize="xs" color="#666666">
                                            Administrator
                                        </Text>
                                    </VStack>
                                    <Avatar
                                        size="sm"
                                        name={user?.name || user?.fullName || 'Admin'}
                                        bg="rgba(116, 156, 115, 0.15)"
                                        color={COLORS.primary}
                                        border="2px solid rgba(116, 156, 115, 0.2)"
                                        cursor="pointer"
                                        _hover={{
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 12px rgba(116, 156, 115, 0.3)',
                                            borderColor: "rgba(116, 156, 115, 0.4)"
                                        }}
                                        transition="all 0.2s ease"
                                    />
                                </HStack>
                            </HStack>
                        </Flex>
                    </MotionBox>

                    {/* Page Content */}
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        flex={1}
                        overflow="auto"
                        bg="rgba(255, 255, 255, 0.05)"
                        backdropFilter="blur(8px)"
                        border="1px solid rgba(255, 255, 255, 0.08)"
                        borderRadius="20px"
                        boxShadow="0 20px 60px rgba(116, 156, 115, 0.05)"
                        position="relative"
                    >
                        {/* Content Background Pattern */}
                    
                        <Box position="relative" zIndex={1} p={4}>
                            <Outlet />
                        </Box>
                    </MotionBox>
                </Flex>
            </Flex>
        </Box>
    );
};

export default AdminLayout; 