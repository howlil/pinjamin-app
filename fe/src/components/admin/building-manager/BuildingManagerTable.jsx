import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Button,
    Badge,
    Avatar
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    Phone,
    Building,
    UserCheck,
    UserX
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';

const BuildingManagerTable = ({
    buildingManagers = [],
    onView,
    onEdit,
    onDelete,
    onAssign,
    currentPage,
    totalPages,
    onPageChange
}) => {
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge
    const getStatusBadge = (manager) => {
        if (manager.buildingId && manager.buildingName) {
            return (
                <Badge
                    colorScheme="green"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="semibold"
                >
                    <HStack spacing={1}>
                        <UserCheck size={12} />
                        <Text>Ditugaskan</Text>
                    </HStack>
                </Badge>
            );
        } else {
            return (
                <Badge
                    colorScheme="gray"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="semibold"
                >
                    <HStack spacing={1}>
                        <UserX size={12} />
                        <Text>Tersedia</Text>
                    </HStack>
                </Badge>
            );
        }
    };

    return (
        <Box>
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Pengelola
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Kontak
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Status
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Gedung Ditugaskan
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Dibuat
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {buildingManagers.map((manager, index) => (
                            <motion.tr
                                key={manager.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={manager.managerName}
                                            bg={`${COLORS.primary}20`}
                                            color={COLORS.primary}
                                        />
                                        <Box>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="semibold"
                                                color={COLORS.black}
                                            >
                                                {manager.managerName}
                                            </Text>
                                            <Text fontSize="xs" color={COLORS.gray[500]}>
                                                ID: {manager.id.slice(0, 8)}...
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <HStack spacing={2}>
                                        <Phone size={14} color={COLORS.gray[500]} />
                                        <Text fontSize="sm" color={COLORS.gray[600]}>
                                            {manager.phoneNumber}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    {getStatusBadge(manager)}
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    {manager.buildingName ? (
                                        <HStack spacing={2}>
                                            <Building size={14} color={COLORS.primary} />
                                            <Text fontSize="sm" color={COLORS.black} fontWeight="medium">
                                                {manager.buildingName}
                                            </Text>
                                        </HStack>
                                    ) : (
                                        <Text fontSize="sm" color={COLORS.gray[400]} fontStyle="italic">
                                            Belum ditugaskan
                                        </Text>
                                    )}
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Text fontSize="sm" color={COLORS.gray[600]}>
                                        {formatDate(manager.createdAt)}
                                    </Text>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Menu>
                                        <MenuButton
                                            as={IconButton}
                                            icon={<MoreVertical size={16} />}
                                            variant="ghost"
                                            size="sm"
                                            borderRadius="full"
                                            _hover={{ bg: `${COLORS.primary}10` }}
                                        />
                                        <MenuList
                                            bg="white"
                                            borderColor={`${COLORS.primary}20`}
                                            boxShadow={SHADOWS.lg}
                                            borderRadius="xl"
                                            overflow="hidden"
                                        >
                                            <MenuItem
                                                icon={<Eye size={16} />}
                                                onClick={() => onView(manager)}
                                                _hover={{ bg: `${COLORS.primary}10` }}
                                            >
                                                Lihat Detail
                                            </MenuItem>
                                            <MenuItem
                                                icon={<Edit3 size={16} />}
                                                onClick={() => onEdit(manager)}
                                                _hover={{ bg: `${COLORS.primary}10` }}
                                            >
                                                Edit
                                            </MenuItem>
                                            <MenuItem
                                                icon={<Building size={16} />}
                                                onClick={() => onAssign(manager)}
                                                _hover={{ bg: `${COLORS.primary}10` }}
                                            >
                                                Kelola Penugasan
                                            </MenuItem>
                                            <MenuItem
                                                icon={<Trash2 size={16} />}
                                                onClick={() => onDelete(manager)}
                                                _hover={{ bg: 'red.50' }}
                                                color="red.500"
                                            >
                                                Hapus
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </motion.tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Flex justify="center" mt={6}>
                    <HStack spacing={2}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onPageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                            borderRadius="full"
                            borderColor={`${COLORS.primary}30`}
                            _hover={{
                                bg: `${COLORS.primary}10`,
                                borderColor: COLORS.primary
                            }}
                        >
                            Sebelumnya
                        </Button>

                        {[...Array(totalPages)].map((_, i) => (
                            <Button
                                key={i + 1}
                                size="sm"
                                variant={currentPage === i + 1 ? "solid" : "outline"}
                                bg={currentPage === i + 1 ? COLORS.primary : "transparent"}
                                color={currentPage === i + 1 ? "white" : COLORS.primary}
                                borderColor={`${COLORS.primary}30`}
                                onClick={() => onPageChange(i + 1)}
                                borderRadius="full"
                                _hover={{
                                    bg: currentPage === i + 1 ? COLORS.primaryDark : `${COLORS.primary}10`,
                                    borderColor: COLORS.primary
                                }}
                            >
                                {i + 1}
                            </Button>
                        ))}

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onPageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                            borderRadius="full"
                            borderColor={`${COLORS.primary}30`}
                            _hover={{
                                bg: `${COLORS.primary}10`,
                                borderColor: COLORS.primary
                            }}
                        >
                            Selanjutnya
                        </Button>
                    </HStack>
                </Flex>
            )}
        </Box>
    );
};

export default BuildingManagerTable; 