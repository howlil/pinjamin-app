import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    useColorModeValue
} from '@chakra-ui/react';
import { User, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

import { useProfile } from '../../hooks/profile';
import { ProfileForm, ChangePasswordForm } from '../../components/profile';
import { PageWrapper } from '../../components/admin/common';

const MotionBox = motion(Box);

const AdminProfilePage = () => {
    const {
        profile,
        loading,
        updating,
        changingPassword,
        error,
        fetchProfile,
        updateProfile,
        changePassword,
        clearError
    } = useProfile();

    const [activeTab, setActiveTab] = useState(0);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    // Handle profile update
    const handleUpdateProfile = async (profileData) => {
        const success = await updateProfile(profileData);
        return success;
    };

    // Handle password change
    const handleChangePassword = async (passwordData) => {
        const success = await changePassword(passwordData);
        return success;
    };

    // Handle refresh
    const handleRefresh = () => {
        clearError();
        fetchProfile();
    };

    if (loading && !profile) {
        return (
            <PageWrapper>
                <VStack spacing={8} align="center" justify="center" minH="400px">
                    <Spinner size="xl" color="primary.500" thickness="4px" />
                    <Text color="gray.600">Memuat data profil...</Text>
                </VStack>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper bg={bgColor}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <Box mb={8}>
                    <HStack justify="space-between" align="center" mb={4}>
                        <VStack align="start" spacing={1}>
                            <Heading size="lg" color="gray.800">
                                Profil Admin
                            </Heading>
                            <Text color="gray.600">
                                Kelola informasi profil dan keamanan akun admin Anda
                            </Text>
                        </VStack>

                        <Button
                            leftIcon={<RefreshCw size={18} />}
                            variant="outline"
                            onClick={handleRefresh}
                            isLoading={loading}
                            loadingText="Memuat..."
                            borderRadius="full"
                        >
                            Refresh
                        </Button>
                    </HStack>

                    {/* Profile Summary */}
                    {profile && (
                        <MotionBox
                            bg={cardBg}
                            p={6}
                            borderRadius="2xl"
                            shadow="sm"
                            border="1px"
                            borderColor="gray.200"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <HStack spacing={4}>
                                <Box
                                    bg="red.100"
                                    p={3}
                                    borderRadius="full"
                                    color="red.600"
                                >
                                    <Shield size={24} />
                                </Box>
                                <VStack align="start" spacing={1}>
                                    <Heading size="md" color="gray.800">
                                        {profile.fullName || 'Nama belum diatur'}
                                    </Heading>
                                    <Text color="gray.600" fontSize="sm">
                                        {profile.email} • {profile.role}
                                    </Text>
                                    <Text color="red.500" fontSize="xs" fontWeight="semibold">
                                        Administrator System
                                    </Text>
                                </VStack>
                            </HStack>
                        </MotionBox>
                    )}
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert status="error" borderRadius="lg" mb={6}>
                        <AlertIcon />
                        <VStack align="start" spacing={1} flex={1}>
                            <Text fontWeight="semibold">Terjadi Kesalahan</Text>
                            <Text fontSize="sm">{error}</Text>
                        </VStack>
                        <Button size="sm" variant="ghost" onClick={clearError}>
                            Tutup
                        </Button>
                    </Alert>
                )}

                {/* Main Content */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Tabs
                        index={activeTab}
                        onChange={setActiveTab}
                        variant="enclosed"
                        colorScheme="primary"
                    >
                        <TabList bg={cardBg} borderRadius="xl" p={1} shadow="sm">
                            <Tab
                                borderRadius="lg"
                                _selected={{
                                    bg: 'primary.500',
                                    color: 'white',
                                    shadow: 'md'
                                }}
                                _hover={{
                                    bg: activeTab === 0 ? 'primary.500' : 'gray.100'
                                }}
                            >
                                <HStack spacing={2}>
                                    <User size={18} />
                                    <Text>Informasi Profil</Text>
                                </HStack>
                            </Tab>
                            <Tab
                                borderRadius="lg"
                                _selected={{
                                    bg: 'orange.500',
                                    color: 'white',
                                    shadow: 'md'
                                }}
                                _hover={{
                                    bg: activeTab === 1 ? 'orange.500' : 'gray.100'
                                }}
                            >
                                <HStack spacing={2}>
                                    <Shield size={18} />
                                    <Text>Keamanan</Text>
                                </HStack>
                            </Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel px={0} py={6}>
                                <MotionBox
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {profile ? (
                                        <ProfileForm
                                            profile={profile}
                                            onUpdate={handleUpdateProfile}
                                            updating={updating}
                                        />
                                    ) : (
                                        <Alert status="warning" borderRadius="lg">
                                            <AlertIcon />
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="semibold">Data Profil Tidak Tersedia</Text>
                                                <Text fontSize="sm">
                                                    Silakan refresh halaman atau coba lagi nanti.
                                                </Text>
                                            </VStack>
                                        </Alert>
                                    )}
                                </MotionBox>
                            </TabPanel>

                            <TabPanel px={0} py={6}>
                                <MotionBox
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChangePasswordForm
                                        onChangePassword={handleChangePassword}
                                        changingPassword={changingPassword}
                                    />
                                </MotionBox>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </MotionBox>
            </MotionBox>
        </PageWrapper>
    );
};

export default AdminProfilePage; 