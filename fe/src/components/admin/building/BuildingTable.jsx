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
    MenuItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    DollarSign
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';
import AdminPagination from '../common/AdminPagination';

// Building type constants
const BUILDING_TYPES = {
    SEMINAR: 'Seminar',
    LABORATORY: 'Laboratorium',
    PKM: 'PKM',
    MULTIFUNCTION: 'Multifungsi'
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
        const colors = {
            'SEMINAR': 'blue',
            'LABORATORY': 'purple',
            'PKM': 'green',
            'MULTIFUNCTION': 'orange'
        };
        return colors[type] || 'gray';
    };

    return (
        <Box>
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Foto
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Nama Gedung
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Tipe
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Harga Sewa
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {buildings.map((building, index) => (
                            <motion.tr
                                key={building.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Image
                                        src={building.buildingPhoto}
                                        alt={building.buildingName}
                                        boxSize="60px"
                                        objectFit="cover"
                                        borderRadius="xl"
                                        fallbackSrc="https://via.placeholder.com/60x60?text=No+Image"
                                        border={`1px solid ${COLORS.primary}20`}
                                    />
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <VStack align="start" spacing={1}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color={COLORS.black}
                                        >
                                            {building.buildingName}
                                        </Text>
                                        <Text
                                            fontSize="xs"
                                            color={COLORS.gray[600]}
                                            noOfLines={2}
                                            maxW="200px"
                                        >
                                            {building.description}
                                        </Text>
                                    </VStack>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <Badge
                                        colorScheme={getBuildingTypeColor(building.buildingType)}
                                        variant="subtle"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="medium"
                                    >
                                        {BUILDING_TYPES[building.buildingType] || building.buildingType}
                                    </Badge>
                                </Td>
                                <Td borderColor={`${COLORS.primary}10`} py={4}>
                                    <HStack spacing={1}>
                                        <DollarSign size={14} color={COLORS.primary} />
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color={COLORS.black}
                                        >
                                            {formatCurrency(building.rentalPrice)}
                                        </Text>
                                    </HStack>
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
                                                onClick={() => onView(building)}
                                                _hover={{ bg: `${COLORS.primary}10` }}
                                            >
                                                Lihat Detail
                                            </MenuItem>
                                            <MenuItem
                                                icon={<Edit3 size={16} />}
                                                onClick={() => onEdit(building)}
                                                _hover={{ bg: `${COLORS.primary}10` }}
                                            >
                                                Edit
                                            </MenuItem>
                                            <MenuItem
                                                icon={<Trash2 size={16} />}
                                                onClick={() => onDelete(building)}
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
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={onPageChange}
            />
        </Box>
    );
};

export default BuildingTable; 