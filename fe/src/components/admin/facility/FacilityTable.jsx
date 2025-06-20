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
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Button
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    Wifi,
    Mic2,
    Projector,
    AirVent,
    Users,
    PenTool,
    Volume2,
    Bath,
    Armchair,
    School2,
    Settings
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/utils/designTokens';

// Icon mapping for facilities
const FACILITY_ICONS = {
    'Wifi': Wifi,
    'Mic2': Mic2,
    'Projector': Projector,
    'AirConditioning': AirVent,
    'PenTool': PenTool,
    'Speaker': Volume2,
    'Bath': Bath,
    'Armchair': Armchair,
    'School2': School2,
    'PodiumLecture': Users,
    'Settings': Settings
};

const FacilityTable = ({
    facilities = [],
    onView,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange
}) => {
    // Get icon component
    const getIconComponent = (iconName) => {
        const IconComponent = FACILITY_ICONS[iconName] || Settings;
        return IconComponent;
    };

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

    return (
        <Box>
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Ikon
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Nama Fasilitas
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Dibuat
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Diperbarui
                            </Th>
                            <Th color={COLORS.gray[600]} fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" borderColor={`${COLORS.primary}20`}>
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {facilities.map((facility, index) => {
                            const IconComponent = getIconComponent(facility.iconUrl);
                            return (
                                <motion.tr
                                    key={facility.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Flex align="center" justify="center">
                                            <Box
                                                p={3}
                                                borderRadius="lg"
                                                bg={`${COLORS.primary}15`}
                                                border={`1px solid ${COLORS.primary}30`}
                                                display="flex"
                                                align="center"
                                                justify="center"
                                            >
                                                <Icon
                                                    as={IconComponent}
                                                    boxSize={6}
                                                    color={COLORS.primary}
                                                />
                                            </Box>
                                        </Flex>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color={COLORS.black}
                                        >
                                            {facility.facilityName}
                                        </Text>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Text fontSize="sm" color={COLORS.gray[600]}>
                                            {formatDate(facility.createdAt)}
                                        </Text>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Text fontSize="sm" color={COLORS.gray[600]}>
                                            {formatDate(facility.updatedAt)}
                                        </Text>
                                    </Td>
                                    <Td borderColor={`${COLORS.primary}10`} py={4}>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<MoreVertical size={16} />}
                                                variant="ghost"
                                                size="sm"
                                                borderRadius="lg"
                                                _hover={{ bg: `${COLORS.primary}10` }}
                                            />
                                            <MenuList
                                                bg="white"
                                                borderColor={`${COLORS.primary}20`}
                                                boxShadow={SHADOWS.lg}
                                                borderRadius="lg"
                                                overflow="hidden"
                                            >
                                                <MenuItem
                                                    icon={<Eye size={16} />}
                                                    onClick={() => onView(facility)}
                                                    _hover={{ bg: `${COLORS.primary}10` }}
                                                >
                                                    Lihat Detail
                                                </MenuItem>
                                                <MenuItem
                                                    icon={<Edit3 size={16} />}
                                                    onClick={() => onEdit(facility)}
                                                    _hover={{ bg: `${COLORS.primary}10` }}
                                                >
                                                    Edit
                                                </MenuItem>
                                                <MenuItem
                                                    icon={<Trash2 size={16} />}
                                                    onClick={() => onDelete(facility)}
                                                    _hover={{ bg: 'red.50' }}
                                                    color="red.500"
                                                >
                                                    Hapus
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Td>
                                </motion.tr>
                            );
                        })}
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
                            borderRadius="lg"
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
                                borderRadius="lg"
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
                            borderRadius="lg"
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

export default FacilityTable; 