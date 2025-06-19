import {
    Box,
    Container,
    Heading,
    VStack,
    FormControl,
    FormLabel,
    Switch,
    Text,
    Divider,
    Card,
    CardBody,
    Button,
    HStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

const SettingsPage = () => {
    const toast = useToast();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        reminderDays: 2,
        autoRenew: false
    });

    const handleToggle = (field) => {
        setSettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = () => {
        toast({
            title: 'Pengaturan disimpan',
            description: 'Preferensi Anda telah berhasil disimpan.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box py={8}>
            <Container maxW="4xl">
                <VStack spacing={6} align="stretch">
                    <Heading size="lg" color="gray.800">
                        Pengaturan
                    </Heading>

                    <Card>
                        <CardBody>
                            <VStack spacing={6} align="stretch">
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" mb={4}>
                                        Notifikasi
                                    </Text>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <FormLabel htmlFor="email-notif" mb="0">
                                                    Notifikasi Email
                                                </FormLabel>
                                                <Text fontSize="sm" color="gray.600">
                                                    Terima pemberitahuan melalui email
                                                </Text>
                                            </Box>
                                            <Switch
                                                id="email-notif"
                                                colorScheme="green"
                                                isChecked={settings.emailNotifications}
                                                onChange={() => handleToggle('emailNotifications')}
                                            />
                                        </FormControl>

                                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <FormLabel htmlFor="sms-notif" mb="0">
                                                    Notifikasi SMS
                                                </FormLabel>
                                                <Text fontSize="sm" color="gray.600">
                                                    Terima pemberitahuan melalui SMS
                                                </Text>
                                            </Box>
                                            <Switch
                                                id="sms-notif"
                                                colorScheme="green"
                                                isChecked={settings.smsNotifications}
                                                onChange={() => handleToggle('smsNotifications')}
                                            />
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <Divider />

                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" mb={4}>
                                        Peminjaman
                                    </Text>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <FormLabel htmlFor="auto-renew" mb="0">
                                                    Perpanjangan Otomatis
                                                </FormLabel>
                                                <Text fontSize="sm" color="gray.600">
                                                    Perpanjang otomatis jika memungkinkan
                                                </Text>
                                            </Box>
                                            <Switch
                                                id="auto-renew"
                                                colorScheme="green"
                                                isChecked={settings.autoRenew}
                                                onChange={() => handleToggle('autoRenew')}
                                            />
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <HStack justify="flex-end" mt={4}>
                                    <Button variant="outline">
                                        Batal
                                    </Button>
                                    <Button colorScheme="green" onClick={handleSave}>
                                        Simpan Pengaturan
                                    </Button>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    );
};

export default SettingsPage; 