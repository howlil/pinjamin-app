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
    Box,
    Button,
    useBreakpointValue
} from '@chakra-ui/react';
import { Plus, AlertCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '../../../utils/designTokens';

const MotionBox = motion(Box);

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
    const padding = useBreakpointValue({ base: 8, md: 12 });

    if (loading) {
        return (
            <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Box
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    p={padding}
                >
                    <Center>
                        <VStack spacing={6}>
                            <Box
                                w={16}
                                h={16}
                                borderRadius="16px"
                                bg="rgba(116, 156, 115, 0.15)"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                            >
                                <Spinner
                                    size="lg"
                                    color={COLORS.primary}
                                    thickness="3px"
                                    speed="0.8s"
                                />
                            </Box>
                            <Text
                                color="#666666"
                                fontSize="sm"
                                fontWeight="medium"
                                textAlign="center"
                            >
                                {loadingMessage}
                            </Text>
                        </VStack>
                    </Center>
                </Box>
            </MotionBox>
        );
    }

    if (error) {
        return (
            <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Box
                    bg="rgba(239, 68, 68, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(239, 68, 68, 0.2)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(239, 68, 68, 0.1)"
                    p={padding}
                >
                    <VStack spacing={4}>
                        <Box
                            w={14}
                            h={14}
                            borderRadius="16px"
                            bg="rgba(239, 68, 68, 0.15)"
                            border="1px solid rgba(239, 68, 68, 0.2)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <AlertCircle size={24} color="#ef4444" />
                        </Box>
                        <Box textAlign="center">
                            <Text
                                fontSize="md"
                                fontWeight="bold"
                                color="#ef4444"
                                mb={2}
                            >
                                Terjadi Kesalahan
                            </Text>
                            <Text
                                fontSize="sm"
                                color="#dc2626"
                                fontWeight="medium"
                            >
                                {error}
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            </MotionBox>
        );
    }

    if (!data || data.length === 0) {
        return (
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    p={padding}
                >
                    <Center>
                        <VStack spacing={6}>
                            <Box
                                w={20}
                                h={20}
                                borderRadius="20px"
                                bg="rgba(116, 156, 115, 0.15)"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                                _before={{
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bg: 'linear-gradient(135deg, rgba(116, 156, 115, 0.2), rgba(116, 156, 115, 0.05))',
                                    borderRadius: '20px'
                                }}
                            >
                                {EmptyIcon ? (
                                    <EmptyIcon
                                        size={32}
                                        color={COLORS.primary}
                                        style={{ position: 'relative', zIndex: 1 }}
                                    />
                                ) : (
                                    <Database
                                        size={32}
                                        color={COLORS.primary}
                                        style={{ position: 'relative', zIndex: 1 }}
                                    />
                                )}
                            </Box>

                            <VStack spacing={4}>
                                <Text
                                    color="#666666"
                                    textAlign="center"
                                    fontSize="md"
                                    fontWeight="medium"
                                    lineHeight="1.6"
                                >
                                    {isSearching ? emptySearchMessage : emptyMessage}
                                </Text>

                                {!isSearching && onAddNew && (
                                    <Button
                                        leftIcon={<Plus size={16} />}
                                        bg={COLORS.primary}
                                        color="white"
                                        size="md"
                                        borderRadius="12px"
                                        px={6}
                                        py={3}
                                        fontSize="sm"
                                        fontWeight="bold"
                                        _hover={{
                                            bg: COLORS.primary,
                                            transform: 'translateY(-2px)',
                                            boxShadow: "0 8px 25px rgba(116, 156, 115, 0.3)"
                                        }}
                                        _active={{
                                            transform: 'translateY(0)'
                                        }}
                                        transition="all 0.2s ease"
                                        onClick={onAddNew}
                                    >
                                        {addNewLabel}
                                    </Button>
                                )}
                            </VStack>
                        </VStack>
                    </Center>
                </Box>
            </MotionBox>
        );
    }

    return children;
};

export default DataStateHandler; 