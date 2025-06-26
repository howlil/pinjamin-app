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
    Divider
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
    ChevronRight
} from 'lucide-react';
import { COLORS, GLASSMORPHISM, CORNER_RADIUS } from '../utils/designTokens';
import { useAuth } from '@/features/auth/api/useAuth';
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
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

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
                    <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
                        <Menu>
                            <MenuButton>
                                <HStack spacing={2}>
                                    <Avatar
                                        size="sm"
                                        name={user?.fullName || user?.email}
                                        src={user?.avatar}
                                        bg={COLORS.primary}
                                    />
                                    <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
                                        <Text fontSize="sm" fontWeight="600" color={COLORS.text}>
                                            {user?.fullName || 'Admin'}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            Administrator
                                        </Text>
                                    </VStack>
                                </HStack>
                            </MenuButton>
                            <MenuList>
                                <MenuItem
                                    icon={<LogOut size={16} />}
                                    onClick={handleLogout}
                                    color="red.500"
                                >
                                    Keluar
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