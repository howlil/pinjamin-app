import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  Badge,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
  Divider,
  Avatar,
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  DollarSign,
  Building,
  Phone,
  Calendar,
  Armchair,
  Bath,
  Speaker,
  Mic2,
  Wifi,
  MonitorSpeaker,
  Camera,
  Lightbulb
} from 'lucide-react';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';

const MotionBox = motion(Box);

// Icon mapping for facilities
const facilityIconMap = {
  'Armchair': Armchair,
  'Bath': Bath,
  'Speaker': Speaker,
  'Mic2': Mic2,
  'Wifi': Wifi,
  'MonitorSpeaker': MonitorSpeaker,
  'Camera': Camera,
  'Lightbulb': Lightbulb,
  'TableMeetingBoard': Building,
  'School2': Building
};

const RoomInfo = ({
  roomData,
  loading = false,
  error = null,
  formatCurrency,
  getBuildingTypeText
}) => {
  // Loading state
  if (loading) {
    return (
      <Box
        bg={GLASS.background}
        backdropFilter={GLASS.backdropFilter}
        border={GLASS.border}
        borderRadius="20px"
        boxShadow={SHADOWS.glass}
        p={8}
        mb={6}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color={COLORS.primary} />
          <Text color={COLORS.black}>Memuat detail gedung...</Text>
        </VStack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert status="error" borderRadius="20px" mb={6}>
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium">Gagal memuat detail gedung</Text>
          <Text fontSize="sm">{error}</Text>
        </VStack>
      </Alert>
    );
  }

  // No data state
  if (!roomData) {
    return (
      <Alert status="warning" borderRadius="20px" mb={6}>
        <AlertIcon />
        <Text>Data gedung tidak ditemukan</Text>
      </Alert>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      bg={GLASS.background}
      backdropFilter={GLASS.backdropFilter}
      border={GLASS.border}
      borderRadius="20px"
      boxShadow={SHADOWS.glass}
      overflow="hidden"
      mb={6}
    >
      <VStack align="stretch" spacing={0}>
        {/* Header Section */}
        <Box p={6} pb={4}>
          <VStack align="start" spacing={4}>
            <HStack justify="space-between" align="start" w="full">
              <VStack align="start" spacing={2} flex={1}>
                <Heading size="lg" color={COLORS.black}>
                  {roomData.name}
                </Heading>
                {roomData.buildingType && (
                  <Badge
                    colorScheme="blue"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                  >
                    {getBuildingTypeText ? getBuildingTypeText(roomData.buildingType) : roomData.buildingType}
                  </Badge>
                )}
              </VStack>

              {roomData.price && (
                <Box textAlign="right">
                  <Text fontSize="sm" color={COLORS.gray[600]}>
                    Harga Sewa
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color={COLORS.primary}>
                    {formatCurrency ? formatCurrency(roomData.price) : `Rp ${roomData.price?.toLocaleString()}`}
                  </Text>
                </Box>
              )}
            </HStack>

            <Text color={COLORS.gray[700]} fontSize="md" lineHeight="tall">
              {roomData.description}
            </Text>
          </VStack>
        </Box>

        {/* Building Image */}
        <Box
          h="300px"
          bgImage={`url(${roomData.image})`}
          bgSize="cover"
          bgPosition="center"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
            zIndex: 1
          }}
        >
          <Box
            position="absolute"
            bottom={4}
            left={4}
            color="white"
            zIndex={2}
          >
            <HStack spacing={2}>
              <Icon as={MapPin} size="16" />
              <Text fontSize="sm" fontWeight="medium">
                {roomData.location || 'Lokasi tidak tersedia'}
              </Text>
            </HStack>
          </Box>
        </Box>

        {/* Building Specifications */}
        <Box p={6}>
          <VStack spacing={6} align="stretch">
            {/* Basic Info Table */}
            <Box>
              <Heading size="md" color={COLORS.black} mb={4}>
                Informasi Gedung
              </Heading>
              <Table size="sm" variant="simple">
                <Tbody>
                  <Tr>
                    <Td fontWeight="medium" color={COLORS.black} width="30%" pl={0}>
                      <HStack spacing={2}>
                        <Icon as={Building} size="16" color={COLORS.primary} />
                        <Text>Gedung</Text>
                      </HStack>
                    </Td>
                    <Td color={COLORS.black}>{roomData.building}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="medium" color={COLORS.black} pl={0}>
                      <HStack spacing={2}>
                        <Icon as={Users} size="16" color={COLORS.primary} />
                        <Text>Kapasitas</Text>
                      </HStack>
                    </Td>
                    <Td color={COLORS.black}>{roomData.capacity}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="medium" color={COLORS.black} pl={0}>
                      <HStack spacing={2}>
                        <Icon as={MapPin} size="16" color={COLORS.primary} />
                        <Text>Lokasi</Text>
                      </HStack>
                    </Td>
                    <Td color={COLORS.black}>{roomData.location}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Divider />

            {/* Facilities Section */}
            {roomData.facilities && roomData.facilities.length > 0 && (
              <Box>
                <Heading size="md" color={COLORS.black} mb={4}>
                  Fasilitas
                </Heading>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                  {roomData.facilities.map((facility) => {
                    const IconComponent = facilityIconMap[facility.iconUrl] || Building;

                    return (
                      <MotionBox
                        key={facility.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        bg="rgba(255, 255, 255, 0.5)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(255, 255, 255, 0.3)"
                        borderRadius="12px"
                        p={3}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: SHADOWS.lg
                        }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3}>
                          <Box
                            p={2}
                            bg={`${COLORS.primary}20`}
                            borderRadius="lg"
                          >
                            <Icon
                              as={IconComponent}
                              size="20"
                              color={COLORS.primary}
                            />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={COLORS.black}
                          >
                            {facility.facilityName}
                          </Text>
                        </HStack>
                      </MotionBox>
                    );
                  })}
                </SimpleGrid>
              </Box>
            )}

            <Divider />

            {/* Building Managers Section */}
            {roomData.managers && roomData.managers.length > 0 && (
              <Box>
                <Heading size="md" color={COLORS.black} mb={4}>
                  Pengelola Gedung
                </Heading>
                <VStack spacing={3} align="stretch">
                  {roomData.managers.map((manager) => (
                    <MotionBox
                      key={manager.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      bg="rgba(255, 255, 255, 0.5)"
                      backdropFilter="blur(10px)"
                      border="1px solid rgba(255, 255, 255, 0.3)"
                      borderRadius="12px"
                      p={4}
                    >
                      <HStack spacing={4}>
                        <Avatar
                          size="md"
                          name={manager.managerName}
                          bg={COLORS.primary}
                          color="white"
                        />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="semibold" color={COLORS.black}>
                            {manager.managerName}
                          </Text>
                          <HStack spacing={2}>
                            <Icon as={Phone} size="16" color={COLORS.gray[500]} />
                            <Text fontSize="sm" color={COLORS.gray[600]}>
                              {manager.phoneNumber}
                            </Text>
                          </HStack>
                        </VStack>
                        <Tooltip label="Hubungi Manager">
                          <Box
                            as="a"
                            href={`tel:${manager.phoneNumber}`}
                            p={2}
                            bg={`${COLORS.primary}20`}
                            borderRadius="lg"
                            _hover={{
                              bg: `${COLORS.primary}30`,
                              transform: 'scale(1.05)'
                            }}
                            transition="all 0.2s"
                            cursor="pointer"
                          >
                            <Icon as={Phone} size="16" color={COLORS.primary} />
                          </Box>
                        </Tooltip>
                      </HStack>
                    </MotionBox>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </MotionBox>
  );
};

export default RoomInfo; 