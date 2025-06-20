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
import { Plus } from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';

const BuildingHeader = ({
    title = "Manajemen Gedung",
    description = "Kelola data gedung dan ruangan untuk peminjaman",
    onAddNew
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