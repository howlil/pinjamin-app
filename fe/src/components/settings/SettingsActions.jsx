import React from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { COLORS } from '@/utils/designTokens';

const SettingsActions = ({ onSave, onCancel }) => {
    return (
        <HStack justify="flex-end" mt={4}>
            <Button
                variant="outline"
                onClick={onCancel}
            >
                Batal
            </Button>
            <Button
                colorScheme="green"
                onClick={onSave}
                bg={COLORS.primary}
                _hover={{ bg: COLORS.primaryDark }}
            >
                Simpan Pengaturan
            </Button>
        </HStack>
    );
};

export default SettingsActions; 