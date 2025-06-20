import React from 'react';
import {
    Center,
    VStack,
    Spinner,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { COLORS } from '@/utils/designTokens';
import { PrimaryButton } from '@/components/ui';

const DataStateHandler = ({
    loading,
    error,
    data,
    emptyMessage = "Belum ada data",
    emptySearchMessage = "Tidak ada data yang sesuai dengan pencarian",
    loadingMessage = "Memuat data...",
    isSearching = false,
    onAddNew,
    addNewLabel = "Tambah Data Pertama",
    EmptyIcon,
    children
}) => {
    if (loading) {
        return (
            <Center py={12}>
                <VStack spacing={4}>
                    <Spinner size="xl" color={COLORS.primary} thickness="4px" />
                    <Text color={COLORS.gray[500]}>{loadingMessage}</Text>
                </VStack>
            </Center>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Box>
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Box>
            </Alert>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Center py={12}>
                <VStack spacing={4}>
                    {EmptyIcon && (
                        <Box
                            w="80px"
                            h="80px"
                            borderRadius="full"
                            bg={`${COLORS.primary}10`}
                            display="flex"
                            align="center"
                            justify="center"
                        >
                            <EmptyIcon size={32} color={COLORS.primary} />
                        </Box>
                    )}
                    <Text color={COLORS.gray[500]} textAlign="center">
                        {isSearching ? emptySearchMessage : emptyMessage}
                    </Text>
                    {!isSearching && onAddNew && (
                        <PrimaryButton
                            leftIcon={<Plus size={16} />}
                            onClick={onAddNew}
                        >
                            {addNewLabel}
                        </PrimaryButton>
                    )}
                </VStack>
            </Center>
        );
    }

    return children;
};

export default DataStateHandler; 