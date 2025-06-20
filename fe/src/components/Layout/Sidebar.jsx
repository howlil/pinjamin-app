import React from 'react';
import { Box, VStack, HStack, Icon, Text, Heading, Divider } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';
import { COLORS, ANIMATIONS, GLASS_EFFECT, SHADOWS, RADII } from '@/utils/designTokens';
import { useAuth } from '@/hooks/useAuth';

const SidebarItem = ({ item, isActive, onClick }) => {
    return (
        <Box
            as={RouterLink}
            to={item.path}
            display="block"
            onClick={onClick}
            position="relative"
        >
            <HStack
                as={motion.div}
                align="center"
                py={3.5}
                px={4}
                mx={2}
                borderRadius={RADII.default}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                bg={isActive ? COLORS.primary : 'transparent'}
                color={isActive ? 'white' : COLORS.black}
                position="relative"
                overflow="hidden"
                _hover={{
                    bg: isActive ? COLORS.primary : `${COLORS.primary}10`,
                    transform: 'translateX(4px)',
                    boxShadow: isActive ? SHADOWS.primary : SHADOWS.sm,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: isActive
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)'
                        : 'linear-gradient(135deg, rgba(116,156,115,0.05), transparent)',
                    borderRadius: RADII.default,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.3s',
                    _groupHover: {
                        opacity: 1
                    }
                }}
                role="group"
            >
                <Icon
                    as={item.icon}
                    boxSize={5}
                    transition="all 0.3s"
                    _groupHover={{
                        transform: isActive ? 'scale(1.1)' : 'scale(1.05)',
                    }}
                />
                <Text
                    fontWeight={isActive ? 'semibold' : 'medium'}
                    ml={3}
                    fontSize="sm"
                    letterSpacing="0.01em"
                >
                    {item.name}
                </Text>
                {isActive && (
                    <Box
                        position="absolute"
                        left="-2px"
                        top="50%"
                        transform="translateY(-50%)"
                        w="4px"
                        h="70%"
                        bg="white"
                        borderRadius="full"
                        boxShadow="0 0 8px rgba(255,255,255,0.6)"
                    />
                )}
            </HStack>
        </Box>
    );
};

const Sidebar = ({ items, title = 'Admin Panel', onItemClick }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <VStack
            as={motion.div}
            align="stretch"
            h="full"
            spacing={0}
            bg="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(20px)"
            borderRadius={RADII.default}
            boxShadow={SHADOWS.glass}
            border="1px solid rgba(255, 255, 255, 0.5)"
            position="relative"
            overflow="hidden"
            {...ANIMATIONS.sidebar}
            _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: RADII.default,
                padding: '1px',
                background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.8) 0%, 
                    rgba(116, 156, 115, 0.2) 50%,
                    rgba(255, 255, 255, 0.5) 100%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                zIndex: -1
            }}
        >
            {/* Header */}
            <Box px={6} py={6}>
                <HStack spacing={2} align="center">
                    <Icon
                        as={Sparkles}
                        boxSize={6}
                        color={COLORS.primary}
                        animation="pulse 2s infinite"
                    />
                    <Heading
                        size="md"
                        color={COLORS.black}
                        fontWeight="bold"
                        letterSpacing="tight"
                    >
                        {title}
                    </Heading>
                </HStack>
            </Box>

            <Divider
                borderColor={`${COLORS.primary}20`}
                opacity={0.5}
                mx={4}
                mb={4}
            />

            {/* Navigation Items */}
            <VStack spacing={1} px={2} flex={1}>
                {items.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.div
                            key={item.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ width: '100%' }}
                        >
                            <SidebarItem
                                item={item}
                                isActive={isActive}
                                onClick={onItemClick}
                            />
                        </motion.div>
                    );
                })}
            </VStack>

            {/* Logout Option at Bottom */}
            <Box px={4} py={6}>
                <Divider
                    borderColor={`${COLORS.primary}20`}
                    opacity={0.5}
                    mb={4}
                />
                <HStack
                    as={motion.div}
                    spacing={3}
                    px={4}
                    py={3}
                    borderRadius={RADII.default}
                    color={COLORS.gray[600]}
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{
                        bg: 'red.50',
                        color: 'red.500',
                        transform: 'translateX(4px)',
                        boxShadow: SHADOWS.sm
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                >
                    <Icon as={LogOut} boxSize={5} />
                    <Text fontWeight="medium" fontSize="sm">Keluar</Text>
                </HStack>
            </Box>
        </VStack>
    );
};

export default Sidebar; 