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

const BookingSettings = ({ settings, handleToggle }) => {
    return (
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
    );
};

export default BookingSettings; 