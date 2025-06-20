import React from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    HStack,
    Flex
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Download, Map } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';

const BuildingHeader = ({
    title = "Manajemen Gedung",
    description = "Kelola data gedung dan ruangan untuk peminjaman",
    onRefresh,
    onAddNew,
    onExport,
    onViewMap
}) => {
    return (
        <Box
            as={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            mb={8}
        >
            <Flex
                justify="space-between"
                align={{ base: 'start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                gap={4}
                mb={6}
            >
                <Box>
                    <Heading
                        size="xl"
                        color={COLORS.black}
                        fontWeight="bold"
                        mb={2}
                    >
                        {title}
                    </Heading>
                    <Text color={COLORS.gray[600]} fontSize="md">
                        {description}
                    </Text>
                </Box>

                <HStack spacing={3}>
                    <Button
                        leftIcon={<RefreshCw size={16} />}
                        variant="outline"
                        borderColor={`${COLORS.primary}30`}
                        color={COLORS.primary}
                        borderRadius="lg"
                        _hover={{
                            bg: `${COLORS.primary}10`,
                            borderColor: COLORS.primary
                        }}
                        onClick={onRefresh}
                    >
                        Refresh
                    </Button>
                    {onViewMap && (
                        <Button
                            leftIcon={<Map size={16} />}
                            variant="outline"
                            borderColor={`${COLORS.primary}30`}
                            color={COLORS.primary}
                            borderRadius="lg"
                            _hover={{
                                bg: `${COLORS.primary}10`,
                                borderColor: COLORS.primary
                            }}
                            onClick={onViewMap}
                        >
                            Peta
                        </Button>
                    )}
                    {onExport && (
                        <Button
                            leftIcon={<Download size={16} />}
                            variant="outline"
                            borderColor={`${COLORS.primary}30`}
                            color={COLORS.primary}
                            borderRadius="lg"
                            _hover={{
                                bg: `${COLORS.primary}10`,
                                borderColor: COLORS.primary
                            }}
                            onClick={onExport}
                        >
                            Export
                        </Button>
                    )}
                    <Button
                        leftIcon={<Plus size={18} />}
                        bg={COLORS.primary}
                        color="white"
                        size="lg"
                        borderRadius="xl"
                        _hover={{
                            bg: COLORS.primaryDark,
                            transform: 'translateY(-2px)',
                            boxShadow: SHADOWS.lg
                        }}
                        transition="all 0.3s"
                        onClick={onAddNew}
                    >
                        Tambah Gedung
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
};

export default BuildingHeader; 