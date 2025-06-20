import React from 'react';
import {
    Box,
    Text,
    VStack,
    FormControl,
    FormLabel,
    Switch
} from '@chakra-ui/react';
import { COLORS } from '@/utils/designTokens';

const NotificationSettings = ({ settings, handleToggle }) => {
    return (
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
    );
};

export default NotificationSettings; 