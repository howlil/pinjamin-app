import { useState, useEffect } from 'react';
import {
    Box,
    Flex,
    Text,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    useDisclosure,
    Container,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    HStack,
} from '@chakra-ui/react';
import { useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutGrid,
    Building2,
    ClipboardList,
    CreditCard,
    Settings as SettingsIcon,
    History,
    Menu as MenuIcon,
    Bell,
    Settings,
    User,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { COLORS, ANIMATIONS, GLASS_EFFECT, SHADOWS, RADII } from '@/utils/designTokens';
import { GlassCard } from '@/components/ui';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

// Sidebar navigation items
const sidebarItems = [
    {
        name: 'Dashboard',
        icon: LayoutGrid,
        path: '/admin'
    },
    {
        name: 'Gedung',
        icon: Building2,
        path: '/admin/gedung'
    },
    {
        name: 'Peminjaman',
        icon: ClipboardList,
        path: '/admin/peminjaman'
    },
    {
        name: 'Transaksi',
        icon: CreditCard,
        path: '/admin/transaksi'
    },
    {
        name: 'Fasilitas',
        icon: SettingsIcon,
        path: '/admin/fasilitas'
    },
    {
        name: 'Riwayat',
        icon: History,
        path: '/admin/riwayat'
    },
];

const AdminLayout = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Check if the window is mobile size
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    // Get page title based on current route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/admin': return 'Dashboard';
            case '/admin/gedung': return 'Manajemen Gedung';
            case '/admin/peminjaman': return 'Data Peminjaman';
            case '/admin/transaksi': return 'Transaksi';
            case '/admin/fasilitas': return 'Manajemen Fasilitas';
            case '/admin/riwayat': return 'Riwayat';
            default: return 'Admin Panel';
        }
    };

    return (
        <Flex h="100vh" position="relative" overflow="hidden">
            {/* Enhanced background with gradient and pattern */}
            <Box
                position="absolute"
                inset="0"
                bg={`linear-gradient(135deg, ${COLORS.primaryLight}15 0%, ${COLORS.secondary}50 50%, ${COLORS.primaryLight}10 100%)`}
                zIndex="-2"
            />
            <Box
                position="absolute"
                inset="0"
                opacity={0.03}
                bgImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23749C73' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                zIndex="-1"
            />

            {/* Desktop Sidebar */}
            <Box
                display={{ base: 'none', md: 'block' }}
                w="260px"
                position="fixed"
                h="full"
                overflow="auto"
                zIndex="10"
                p={3}
            >
                <Box h="full">
                    <Sidebar items={sidebarItems} title="Admin Panel" />
                </Box>
            </Box>

            {/* Mobile Drawer */}
            <Drawer placement="left" isOpen={isOpen} onClose={onClose} size="xs">
                <DrawerOverlay backdropFilter="blur(10px)" bg="blackAlpha.300" />
                <DrawerContent bg="transparent" boxShadow="none">
                    <DrawerBody p={3}>
                        <Sidebar items={sidebarItems} title="Admin Panel" onItemClick={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <Box
                ml={{ base: 0, md: '260px' }}
                w="full"
                h="full"
                position="relative"
            >
                {/* Enhanced Header */}
                <Box
                    as={motion.div}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: '0.4s' }}
                    position="sticky"
                    top={0}
                    zIndex={20}
                    p={{ base: 3, md: 4 }}
                >
                    <GlassCard
                        h={{ base: "65px", md: "75px" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={{ base: 4, md: 6 }}
                        borderRadius={RADII.default}
                        bg="rgba(255, 255, 255, 0.85)"
                        boxShadow={SHADOWS.glass}
                        hoverEffect={false}
                        border="1px solid rgba(255, 255, 255, 0.5)"
                        backdropFilter="blur(20px)"
                    >
                        <Flex align="center" gap={4} w="full">
                            {/* Mobile Menu Button */}
                            <IconButton
                                display={{ base: 'flex', md: 'none' }}
                                aria-label="Open menu"
                                icon={<MenuIcon size={20} />}
                                onClick={onOpen}
                                variant="ghost"
                                color={COLORS.black}
                                size="md"
                                borderRadius="lg"
                                _hover={{
                                    bg: `${COLORS.primary}15`,
                                    transform: 'scale(1.02)'
                                }}
                                transition="all 0.2s"
                            />

                            {/* Page Title */}
                            <Box flex={1}>
                                <Text
                                    fontSize={{ base: "lg", md: "xl" }}
                                    fontWeight="bold"
                                    color={COLORS.black}
                                    letterSpacing="tight"
                                    lineHeight="1.2"
                                >
                                    {getPageTitle()}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    color={COLORS.gray[500]}
                                    display={{ base: 'none', md: 'block' }}
                                >
                                    {new Date().toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </Box>

                            {/* Right-side header items */}
                            <HStack ml="auto" spacing={{ base: 2, md: 3 }}>
                                {/* Notification Button with Badge */}
                                <Box position="relative">
                                    <IconButton
                                        aria-label="Notifications"
                                        icon={<Bell size={18} />}
                                        variant="ghost"
                                        size="md"
                                        color={COLORS.gray[600]}
                                        borderRadius="lg"
                                        _hover={{
                                            bg: `${COLORS.primary}10`,
                                            color: COLORS.primary,
                                            transform: 'translateY(-1px)'
                                        }}
                                        transition="all 0.2s"
                                    />
                                    <Box
                                        position="absolute"
                                        top="6px"
                                        right="6px"
                                        w="10px"
                                        h="10px"
                                        bg={COLORS.primary}
                                        borderRadius="full"
                                        border="2px solid white"
                                        boxShadow="0 0 0 1px rgba(255,255,255,0.8)"
                                    />
                                </Box>

                                {/* Settings Button */}
                                <IconButton
                                    aria-label="Settings"
                                    icon={<Settings size={18} />}
                                    variant="ghost"
                                    size="md"
                                    color={COLORS.gray[600]}
                                    borderRadius="lg"
                                    _hover={{
                                        bg: `${COLORS.primary}10`,
                                        color: COLORS.primary,
                                        transform: 'rotate(90deg)'
                                    }}
                                    transition="all 0.3s"
                                />

                                {/* User Menu */}
                                <Menu>
                                    <MenuButton
                                        as={motion.div}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <HStack
                                            spacing={3}
                                            px={3}
                                            py={2}
                                            borderRadius="xl"
                                            bg={`${COLORS.primary}08`}
                                            cursor="pointer"
                                            transition="all 0.2s"
                                            border="1px solid transparent"
                                            _hover={{
                                                bg: `${COLORS.primary}15`,
                                                borderColor: `${COLORS.primary}30`,
                                                boxShadow: SHADOWS.sm
                                            }}
                                        >
                                            <Avatar
                                                size="sm"
                                                name={user?.name || "Admin User"}
                                                bg={COLORS.primary}
                                                color="white"
                                                fontSize="xs"
                                            />
                                            <Text
                                                fontSize="sm"
                                                fontWeight="semibold"
                                                color={COLORS.black}
                                                display={{ base: 'none', lg: 'block' }}
                                            >
                                                {user?.name || "Admin"}
                                            </Text>
                                            <ChevronDown size={14} color={COLORS.gray[500]} />
                                        </HStack>
                                    </MenuButton>
                                    <MenuList
                                        bg="white"
                                        borderColor={`${COLORS.primary}20`}
                                        boxShadow={SHADOWS.lg}
                                        borderRadius={RADII.default}
                                        overflow="hidden"
                                        mt={2}
                                        minW="180px"
                                    >
                                        <MenuItem
                                            icon={<User size={16} />}
                                            _hover={{ bg: `${COLORS.primary}10` }}
                                            borderRadius="md"
                                            mx={1}
                                            my={1}
                                        >
                                            Profile
                                        </MenuItem>
                                        <MenuItem
                                            icon={<Settings size={16} />}
                                            _hover={{ bg: `${COLORS.primary}10` }}
                                            borderRadius="md"
                                            mx={1}
                                            my={1}
                                        >
                                            Settings
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem
                                            icon={<LogOut size={16} />}
                                            _hover={{ bg: 'red.50' }}
                                            color="red.500"
                                            onClick={logout}
                                            borderRadius="md"
                                            mx={1}
                                            my={1}
                                        >
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </Flex>
                    </GlassCard>
                </Box>

                {/* Content Area */}
                <Box
                    as={motion.div}
                    {...ANIMATIONS.default}
                    p={{ base: 3, md: 4, lg: 6 }}
                    overflowY="auto"
                    h="calc(100vh - 100px)"
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: `${COLORS.primary}40`,
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: `${COLORS.primary}60`,
                        },
                    }}
                >
                    <Container maxW="8xl" px={0}>
                        <Outlet />
                    </Container>
                </Box>
            </Box>
        </Flex>
    );
};

export default AdminLayout; 