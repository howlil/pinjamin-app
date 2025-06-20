import React from 'react';
import { HStack, Text, Icon } from '@chakra-ui/react';
import { Users, Plus } from 'lucide-react';
import { PrimaryButton } from '@/components/ui';
import { COLORS } from '@/utils/designTokens';

const BuildingManagerHeader = ({ onAddNew }) => {
    return (
        <HStack justify="space-between" align="center" mb={6}>
            <HStack spacing={3} align="center">
                <Icon as={Users} boxSize={8} color={COLORS.primary} />
                <div>
                    <Text fontSize="2xl" fontWeight="bold" color={COLORS.black}>
                        Kelola Pengelola Gedung
                    </Text>
                    <Text fontSize="md" color={COLORS.gray[600]}>
                        Manajemen pengelola dan penugasan gedung
                    </Text>
                </div>
            </HStack>

            <PrimaryButton
                leftIcon={<Plus size={18} />}
                onClick={onAddNew}
                size="lg"
            >
                Tambah Pengelola
            </PrimaryButton>
        </HStack>
    );
};

export default BuildingManagerHeader; 