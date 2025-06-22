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
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Badge,
    Avatar,
    VStack,
    useBreakpointValue
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
    UserX,
    User,
    Calendar
} from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const BuildingManagerTable = ({
    buildingManagers = [],
    onView,
    onEdit,
    onDelete,
    onAssign,
    currentPage,
    totalPages,
    totalItems,
    onPageChange
}) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (manager) => {
        if (manager.buildingId && manager.buildingName) {
            return (
                <Badge
                    bg="rgba(34, 197, 94, 0.15)"
                    color="#22c55e"
                    border="1px solid rgba(34, 197, 94, 0.2)"
                    px={3}
                    py={1}
                    borderRadius="8px"
                    fontSize="xs"
                    fontWeight="bold"
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
                    bg="rgba(156, 163, 175, 0.15)"
                    color="#6b7280"
                    border="1px solid rgba(156, 163, 175, 0.2)"
                    px={3}
                    py={1}
                    borderRadius="8px"
                    fontSize="xs"
                    fontWeight="bold"
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
        <VStack spacing={6} align="stretch">
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Box
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    p={padding}
                    _hover={{
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
                    }}
                    transition="all 0.3s ease"
                >
                    <Box
                        overflowX="auto"
                        css={{
                            '&::-webkit-scrollbar': {
                                height: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(116, 156, 115, 0.3)',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: 'rgba(116, 156, 115, 0.5)',
                            },
                        }}
                    >
                        <Table variant="unstyled" size="md">
                            <Thead>
                                <Tr>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <User size={12} />
                                            <Text>Pengelola</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <Phone size={12} />
                                            <Text>Kontak</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        Status
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <Building size={12} />
                                            <Text>Gedung</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        <HStack spacing={2}>
                                            <Calendar size={12} />
                                            <Text>Dibuat</Text>
                                        </HStack>
                                    </Th>
                                    <Th
                                        color="#666666"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                        pb={4}
                                    >
                                        Aksi
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {buildingManagers.map((manager, index) => (
                                    <MotionTr
                                        key={manager.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                        whileHover={{
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            scale: 1.005
                                        }}
                                        borderRadius="12px"
                                    >
                                        <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                            <HStack spacing={3}>
                                                <Avatar
                                                    size="sm"
                                                    name={manager.managerName}
                                                    bg="rgba(116, 156, 115, 0.2)"
                                                    color={COLORS.primary}
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                />
                                                <Box>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="bold"
                                                        color="#444444"
                                                    >
                                                        {manager.managerName}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="#666666"
                                                        fontWeight="medium"
                                                    >
                                                        ID: {manager.id.slice(0, 8)}...
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </Td>
                                        <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                            <HStack spacing={2}>
                                                <Box
                                                    w={6}
                                                    h={6}
                                                    borderRadius="6px"
                                                    bg="rgba(116, 156, 115, 0.15)"
                                                    border="1px solid rgba(116, 156, 115, 0.2)"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Phone size={12} color={COLORS.primary} />
                                                </Box>
                                                <Text
                                                    fontSize="sm"
                                                    color="#444444"
                                                    fontWeight="medium"
                                                >
                                                    {manager.phoneNumber}
                                                </Text>
                                            </HStack>
                                        </Td>
                                        <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                            {getStatusBadge(manager)}
                                        </Td>
                                        <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                            {manager.buildingName ? (
                                                <HStack spacing={2}>
                                                    <Box
                                                        w={6}
                                                        h={6}
                                                        borderRadius="6px"
                                                        bg="rgba(116, 156, 115, 0.15)"
                                                        border="1px solid rgba(116, 156, 115, 0.2)"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Building size={12} color={COLORS.primary} />
                                                    </Box>
                                                    <Text
                                                        fontSize="sm"
                                                        color="#444444"
                                                        fontWeight="bold"
                                                    >
                                                        {manager.buildingName}
                                                    </Text>
                                                </HStack>
                                            ) : (
                                                <Text
                                                    fontSize="sm"
                                                    color="#999999"
                                                    fontStyle="italic"
                                                    fontWeight="medium"
                                                >
                                                    Belum ditugaskan
                                                </Text>
                                            )}
                                        </Td>
                                        <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                            <Text
                                                fontSize="sm"
                                                color="#666666"
                                                fontWeight="medium"
                                            >
                                                {formatDate(manager.createdAt)}
                                            </Text>
                                        </Td>
                                        <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                            <Menu>
                                                <MenuButton
                                                    as={IconButton}
                                                    icon={<MoreVertical size={16} />}
                                                    variant="ghost"
                                                    size="sm"
                                                    borderRadius="10px"
                                                    bg="rgba(255, 255, 255, 0.1)"
                                                    color="#444444"
                                                    border="1px solid rgba(255, 255, 255, 0.15)"
                                                    _hover={{
                                                        bg: "rgba(116, 156, 115, 0.1)",
                                                        borderColor: "rgba(116, 156, 115, 0.3)",
                                                        transform: "translateY(-1px)"
                                                    }}
                                                    transition="all 0.2s ease"
                                                />
                                                <MenuList
                                                    bg="rgba(255, 255, 255, 0.95)"
                                                    backdropFilter="blur(16px)"
                                                    border="1px solid rgba(255, 255, 255, 0.2)"
                                                    boxShadow="0 12px 40px rgba(116, 156, 115, 0.15)"
                                                    borderRadius="12px"
                                                    overflow="hidden"
                                                    p={2}
                                                >
                                                    <MenuItem
                                                        icon={<Eye size={16} />}
                                                        onClick={() => onView(manager)}
                                                        borderRadius="8px"
                                                        fontWeight="medium"
                                                        _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                        transition="all 0.2s ease"
                                                    >
                                                        Lihat Detail
                                                    </MenuItem>
                                                    <MenuItem
                                                        icon={<Edit3 size={16} />}
                                                        onClick={() => onEdit(manager)}
                                                        borderRadius="8px"
                                                        fontWeight="medium"
                                                        _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                        transition="all 0.2s ease"
                                                    >
                                                        Edit
                                                    </MenuItem>
                                                    <MenuItem
                                                        icon={<Building size={16} />}
                                                        onClick={() => onAssign(manager)}
                                                        borderRadius="8px"
                                                        fontWeight="medium"
                                                        _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                        transition="all 0.2s ease"
                                                    >
                                                        Kelola Penugasan
                                                    </MenuItem>
                                                    <MenuItem
                                                        icon={<Trash2 size={16} />}
                                                        onClick={() => onDelete(manager)}
                                                        borderRadius="8px"
                                                        fontWeight="medium"
                                                        _hover={{ bg: 'rgba(239, 68, 68, 0.1)' }}
                                                        color="red.500"
                                                        transition="all 0.2s ease"
                                                    >
                                                        Hapus
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                    </MotionTr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>

                    {buildingManagers.length === 0 && (
                        <Box
                            textAlign="center"
                            py={12}
                            color="#666666"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                Belum ada data pengelola gedung
                            </Text>
                        </Box>
                    )}
                </Box>
            </MotionBox>

            {/* Pagination */}
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={onPageChange}
            />
        </VStack>
    );
};

export default BuildingManagerTable; 