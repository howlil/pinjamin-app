import React from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    Divider,
    Card,
    CardBody
} from '@chakra-ui/react';
import NotificationSettings from '@/components/settings/NotificationSettings';
import BookingSettings from '@/components/settings/BookingSettings';
import SettingsActions from '@/components/settings/SettingsActions';
import { useSettings } from '@/hooks/useSettings';

const SettingsPage = () => {
    const { settings, handleToggle, handleSave, handleCancel } = useSettings();

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
                                <NotificationSettings
                                    settings={settings}
                                    handleToggle={handleToggle}
                                />

                                <Divider />

                                <BookingSettings
                                    settings={settings}
                                    handleToggle={handleToggle}
                                />

                                <SettingsActions
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    );
};

export default SettingsPage; 