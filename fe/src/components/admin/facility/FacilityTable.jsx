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
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    VStack,
    useBreakpointValue
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
    Settings,
    Grid3X3,
    Calendar,
    Clock
} from 'lucide-react';
import { COLORS } from '../../../utils/designTokens';
import AdminPagination from '../common/AdminPagination';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

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
    totalItems,
    onPageChange
}) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });

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
            year: 'numeric'
        });
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
                                            <Grid3X3 size={12} />
                                            <Text>Ikon</Text>
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
                                            <Settings size={12} />
                                            <Text>Fasilitas</Text>
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
                                        <HStack spacing={2}>
                                            <Clock size={12} />
                                            <Text>Update</Text>
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
                                {facilities.map((facility, index) => {
                                    const IconComponent = getIconComponent(facility.iconUrl);
                                    return (
                                        <MotionTr
                                            key={facility.id}
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
                                                <Box display="flex" justifyContent="center">
                                                    <Box
                                                        w={12}
                                                        h={12}
                                                        borderRadius="12px"
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
                                                            borderRadius: '12px'
                                                        }}
                                                        _hover={{
                                                            transform: "scale(1.1)",
                                                            borderColor: "rgba(116, 156, 115, 0.4)"
                                                        }}
                                                        transition="all 0.2s ease"
                                                    >
                                                        <Icon
                                                            as={IconComponent}
                                                            boxSize={6}
                                                            color={COLORS.primary}
                                                            style={{ position: 'relative', zIndex: 1 }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color="#444444"
                                                >
                                                    {facility.facilityName}
                                                </Text>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Text
                                                    fontSize="sm"
                                                    color="#666666"
                                                    fontWeight="medium"
                                                >
                                                    {formatDate(facility.createdAt)}
                                                </Text>
                                            </Td>
                                            <Td borderBottom="1px solid rgba(255, 255, 255, 0.05)" py={4}>
                                                <Text
                                                    fontSize="sm"
                                                    color="#666666"
                                                    fontWeight="medium"
                                                >
                                                    {formatDate(facility.updatedAt)}
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
                                                            onClick={() => onView(facility)}
                                                            borderRadius="8px"
                                                            fontWeight="medium"
                                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                            transition="all 0.2s ease"
                                                        >
                                                            Lihat Detail
                                                        </MenuItem>
                                                        <MenuItem
                                                            icon={<Edit3 size={16} />}
                                                            onClick={() => onEdit(facility)}
                                                            borderRadius="8px"
                                                            fontWeight="medium"
                                                            _hover={{ bg: "rgba(116, 156, 115, 0.1)" }}
                                                            transition="all 0.2s ease"
                                                        >
                                                            Edit
                                                        </MenuItem>
                                                        <MenuItem
                                                            icon={<Trash2 size={16} />}
                                                            onClick={() => onDelete(facility)}
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

                    {facilities.length === 0 && (
                        <Box
                            textAlign="center"
                            py={12}
                            color="#666666"
                        >
                            <Text fontSize="sm" fontWeight="medium">
                                Belum ada data fasilitas
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

export default FacilityTable; 