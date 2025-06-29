import React, { useState } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useColorModeValue,
    Flex
} from '@chakra-ui/react';
import { User, Lock, Settings } from 'lucide-react';
import { ProfileForm } from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import { COLORS } from '@utils/designTokens';
import AnimatedGridPattern from '@shared/components/AnimatedGridPattern';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabData = [
        {
            id: 'profile',
            label: 'Informasi Profile',
            icon: User,
            component: ProfileForm
        },
        {
            id: 'password',
            label: 'Keamanan',
            icon: Lock,
            component: ChangePasswordForm
        }
    ];

    return (
        <Box
            minH="100vh"
            bg={COLORS.background}
            position="relative"
            fontFamily="Inter, sans-serif"
            py={8}
        >
            <AnimatedGridPattern />

            <Container maxW="container.lg" position="relative" zIndex={2}>
                <VStack spacing={8} align="stretch">
                    {/* Header */}
                    <Box
                        bg="rgba(255, 255, 255, 0.95)"
                        backdropFilter="blur(15px)"
                        borderRadius="24px"
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        p={8}
                        textAlign="center"
                    >
                        <VStack spacing={3}>
                            <Box
                                p={3}
                                borderRadius="16px"
                                bg="rgba(33, 209, 121, 0.1)"
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Settings size={32} color="#21D179" />
                            </Box>
                            <Text
                                fontSize="2xl"
                                fontWeight="700"
                                color={COLORS.text}
                                fontFamily="Inter, sans-serif"
                            >
                                Pengaturan Akun
                            </Text>
                            <Text
                                fontSize="sm"
                                color="#666"
                                fontFamily="Inter, sans-serif"
                                maxW="md"
                                lineHeight="1.6"
                            >
                                Kelola informasi pribadi dan keamanan akun Anda untuk pengalaman yang lebih baik
                            </Text>
                        </VStack>
                    </Box>

                    {/* Main Content */}
                    <Box
                        bg="rgba(255, 255, 255, 0.95)"
                        backdropFilter="blur(15px)"
                        borderRadius="24px"
                        border="1px solid rgba(215, 215, 215, 0.5)"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        overflow="hidden"
                    >
                        <Tabs
                            index={activeTab}
                            onChange={setActiveTab}
                            variant="unstyled"
                            isLazy
                        >
                            {/* Custom Tab List */}
                            <Box
                                bg="rgba(248, 250, 252, 0.8)"
                                borderBottom="1px solid rgba(215, 215, 215, 0.3)"
                                px={8}
                                py={4}
                            >
                                <TabList gap={0}>
                                    {tabData.map((tab, index) => {
                                        const IconComponent = tab.icon;
                                        const isActive = activeTab === index;

                                        return (
                                            <Tab
                                                key={tab.id}
                                                px={6}
                                                py={3}
                                                mr={2}
                                                borderRadius="9999px"
                                                fontFamily="Inter, sans-serif"
                                                fontWeight="600"
                                                fontSize="sm"
                                                transition="all 0.2s ease"
                                                bg={isActive ? COLORS.primary : "transparent"}
                                                color={isActive ? "white" : "#666"}
                                                border={isActive ? "none" : "1px solid rgba(215, 215, 215, 0.5)"}
                                                _hover={{
                                                    bg: isActive ? "#1BAE66" : "rgba(33, 209, 121, 0.1)",
                                                    color: isActive ? "white" : COLORS.primary,
                                                    transform: "translateY(-1px)",
                                                    boxShadow: isActive
                                                        ? "0 4px 12px rgba(33, 209, 121, 0.3)"
                                                        : "0 2px 8px rgba(0, 0, 0, 0.1)"
                                                }}
                                                _active={{
                                                    transform: "translateY(0)"
                                                }}
                                                _focus={{
                                                    outline: "none"
                                                }}
                                            >
                                                <HStack spacing={2}>
                                                    <IconComponent size={16} />
                                                    <Text>{tab.label}</Text>
                                                </HStack>
                                            </Tab>
                                        );
                                    })}
                                </TabList>
                            </Box>

                            {/* Tab Panels */}
                            <TabPanels>
                                <TabPanel p={8}>
                                    <ProfileForm />
                                </TabPanel>
                                <TabPanel p={8}>
                                    <ChangePasswordForm />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default ProfilePage; 