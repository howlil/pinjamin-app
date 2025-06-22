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
    Badge,
    Image,
    VStack,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    DollarSign
} from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

// Building type constants
const BUILDING_TYPES = {
    CLASSROOM: 'Ruang Kelas',
    PKM: 'PKM',
    LABORATORY: 'Laboratorium',
    MULTIFUNCTION: 'Multifungsi',
    SEMINAR: 'Seminar'
};

const BuildingTable = ({
    buildings = [],
    onView,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    totalItems,
    onPageChange
}) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });

    // Format currency to Indonesian Rupiah
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Get building type badge color
    const getBuildingTypeColor = (type) => {
        const colorMap = {
            'CLASSROOM': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' },
            'PKM': { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' },
            'LABORATORY': { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.2)' },
            'MULTIFUNCTION': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', border: '1px solid rgba(251, 146, 60, 0.2)' },
            'SEMINAR': { bg: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.2)' }
        };
        return colorMap[type] || { bg: 'rgba(156, 163, 175, 0.15)', color: '#6b7280', border: '1px solid rgba(156, 163, 175, 0.2)' };
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
                                        Foto
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
                                        Nama Gedung
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
                                        Tipe
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
                                        Harga Sewa
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
                                {buildings.map((building, index) => {
                                    const badgeConfig = getBuildingTypeColor(building.buildingType);

                                    return (
                                        <MotionTr
                                            key={building.id}
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
                                                <Image
                                                    src={building.imageUrl}
                                                    alt={building.buildingName}
                                                    boxSize="60px"
                                                    objectFit="cover"
                                                    borderRadius="12px"
                                                    fallbackSrc="https://via.placeholder.com/60x60?text=No+Image"
                                                    border="1px solid rgba(255, 255, 255, 0.2)"
                                                    _hover={{
                                                        transform: "scale(1.05)",
                                                        borderColor: "rgba(116, 156, 115, 0.3)"
                                                    }}
                                                    transition="all 0.2s ease"
                                                />
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="bold"
                                                        color="#444444"
                                                    >
                                                        {building.buildingName}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="#666666"
                                                        noOfLines={2}
                                                        maxW="200px"
                                                        fontWeight="medium"
                                                    >
                                                        {building.description}
                                                    </Text>
                                                </VStack>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Badge
                                                    bg={badgeConfig.bg}
                                                    color={badgeConfig.color}
                                                    border={badgeConfig.border}
                                                    px={3}
                                                    py={1}
                                                    borderRadius="8px"
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                >
                                                    {BUILDING_TYPES[building.buildingType] || building.buildingType}
                                                </Badge>
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
                                                        <DollarSign size={12} color={COLORS.primary} />
                                                    </Box>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="bold"
                                                        color="#444444"
                                                    >
                                                        {formatCurrency(building.rentalPrice)}
                                                    </Text>
                                                </HStack>
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
                                                            onClick={() => onView(building)}
                                                            borderRadius="8px"
                                                            fontWeight="medium"
                                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                            transition="all 0.2s ease"
                                                        >
                                                            Lihat Detail
                                                        </MenuItem>
                                                        <MenuItem
                                                            icon={<Edit3 size={16} />}
                                                            onClick={() => onEdit(building)}
                                                            borderRadius="8px"
                                                            fontWeight="medium"
                                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                            transition="all 0.2s ease"
                                                        >
                                                            Edit
                                                        </MenuItem>
                                                        <MenuItem
                                                            icon={<Trash2 size={16} />}
                                                            onClick={() => onDelete(building)}
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
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </Box>

                    {buildings.length === 0 && (
                        <Box
                            textAlign="center"
                            py={12}
                            color="#666666"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                Belum ada data gedung
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

export default BuildingTable; 