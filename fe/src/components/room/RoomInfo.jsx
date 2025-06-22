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
  Avatar,
  Tooltip,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
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
  Lightbulb,
  Info,
  Settings,
  UserCheck
} from 'lucide-react';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);
const MotionTabPanel = motion(TabPanel);

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
  // Responsive values
  const containerPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
  const imageHeight = useBreakpointValue({ base: "200px", sm: "250px", md: "300px" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });

  // Loading state
  if (loading) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="rgba(255, 255, 255, 0.05)"
        backdropFilter="blur(16px)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius="20px"
        boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
        p={containerPadding}
        mb={6}
        position="relative"
        overflow="hidden"
      >
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.04}
          duration={3}
          repeatDelay={1.5}
          className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
        />
        <VStack spacing={4} position="relative" zIndex={1}>
          <Spinner size="xl" color={COLORS.primary} thickness="3px" />
          <Text color="#444444" fontSize="sm">Memuat detail gedung...</Text>
        </VStack>
      </MotionBox>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        status="error"
        borderRadius="20px"
        mb={6}
        bg="rgba(254, 226, 226, 0.9)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(239, 68, 68, 0.2)"
      >
        <AlertIcon color="red.500" />
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="#444444">Gagal memuat detail gedung</Text>
          <Text fontSize="sm" color="#666666">{error}</Text>
        </VStack>
      </Alert>
    );
  }

  // No data state
  if (!roomData) {
    return (
      <Alert
        status="warning"
        borderRadius="20px"
        mb={6}
        bg="rgba(254, 243, 199, 0.9)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(245, 158, 11, 0.2)"
      >
        <AlertIcon color="yellow.500" />
        <Text color="#444444">Data gedung tidak ditemukan</Text>
      </Alert>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      bg="rgba(255, 255, 255, 0.05)"
      backdropFilter="blur(16px)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      borderRadius="20px"
      boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
      overflow="hidden"
      mb={6}
      position="relative"
    >
      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={4}
        repeatDelay={2}
        className="absolute inset-0 h-full w-full fill-[#749c73]/10 stroke-[#749c73]/5"
      />

      <VStack align="stretch" spacing={0} position="relative" zIndex={1}>
        {/* Header Section */}
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          p={containerPadding}
          pb={{ base: 3, sm: 4 }}
        >
          <VStack align="start" spacing={{ base: 3, md: 4 }}>
            <HStack justify="space-between" align="start" w="full" flexWrap="wrap" gap={3}>
              <VStack align="start" spacing={2} flex={1} minW="200px">
                <Heading size={headingSize} color="#444444" lineHeight="1.2">
                  {roomData.name}
                </Heading>
                {roomData.buildingType && (
                  <Badge
                    colorScheme="blue"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    bg="rgba(59, 130, 246, 0.1)"
                    color="#3b82f6"
                    border="1px solid rgba(59, 130, 246, 0.2)"
                  >
                    {getBuildingTypeText ? getBuildingTypeText(roomData.buildingType) : roomData.buildingType}
                  </Badge>
                )}
              </VStack>

              {roomData.price && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  textAlign="right"
                  bg="rgba(116, 156, 115, 0.1)"
                  p={3}
                  borderRadius="12px"
                  border="1px solid rgba(116, 156, 115, 0.2)"
                >
                  <Text fontSize="xs" color="#666666" mb={1}>
                    Harga Sewa
                  </Text>
                  <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={COLORS.primary}>
                    {formatCurrency ? formatCurrency(roomData.price) : `Rp ${roomData.price?.toLocaleString()}`}
                  </Text>
                </MotionBox>
              )}
            </HStack>

            <Text color="#666666" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
              {roomData.description}
            </Text>
          </VStack>
        </MotionBox>

        {/* Building Image */}
        <MotionBox
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          h={imageHeight}
          bgImage={`url(${roomData.image})`}
          bgSize="cover"
          bgPosition="center"
          position="relative"
          mx={containerPadding}
          borderRadius="16px"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
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
        </MotionBox>

        {/* Tabs Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          p={containerPadding}
          pt={{ base: 4, md: 5 }}
        >
          <Tabs variant="soft-rounded" colorScheme="green" defaultIndex={0}>
            <TabList
              mb={6}
              bg="rgba(255, 255, 255, 0.08)"
              backdropFilter="blur(8px)"
              borderRadius="16px"
              border="1px solid rgba(255, 255, 255, 0.1)"
              p={2}
              gap={2}
            >
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
                color="#666666"
                borderRadius="12px"
                _selected={{
                  bg: "rgba(116, 156, 115, 0.15)",
                  color: COLORS.primary,
                  borderColor: "rgba(116, 156, 115, 0.3)"
                }}
                _hover={{
                  bg: "rgba(116, 156, 115, 0.1)"
                }}
                leftIcon={<Info size={16} />}
                flex={1}
              >
                Informasi
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
                color="#666666"
                borderRadius="12px"
                _selected={{
                  bg: "rgba(116, 156, 115, 0.15)",
                  color: COLORS.primary,
                  borderColor: "rgba(116, 156, 115, 0.3)"
                }}
                _hover={{
                  bg: "rgba(116, 156, 115, 0.1)"
                }}
                leftIcon={<Settings size={16} />}
                flex={1}
              >
                Fasilitas
              </Tab>
              <Tab
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
                color="#666666"
                borderRadius="12px"
                _selected={{
                  bg: "rgba(116, 156, 115, 0.15)",
                  color: COLORS.primary,
                  borderColor: "rgba(116, 156, 115, 0.3)"
                }}
                _hover={{
                  bg: "rgba(116, 156, 115, 0.1)"
                }}
                leftIcon={<UserCheck size={16} />}
                flex={1}
              >
                Pengelola
              </Tab>
            </TabList>

            <TabPanels>
              {/* Tab 1: Informasi Gedung */}
              <MotionTabPanel
                p={0}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" color="#444444">
                    Detail Gedung
                  </Heading>
                  <Box
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(8px)"
                    borderRadius="12px"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    overflow="hidden"
                  >
                    <Table size="sm" variant="simple">
                      <Tbody>
                        <Tr>
                          <Td fontWeight="medium" color="#444444" width="40%" pl={4} borderColor="rgba(255, 255, 255, 0.1)">
                            <HStack spacing={2}>
                              <Icon as={Building} size="16" color={COLORS.primary} />
                              <Text fontSize="sm">Gedung</Text>
                            </HStack>
                          </Td>
                          <Td color="#666666" fontSize="sm" borderColor="rgba(255, 255, 255, 0.1)">{roomData.building || roomData.name}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium" color="#444444" pl={4} borderColor="rgba(255, 255, 255, 0.1)">
                            <HStack spacing={2}>
                              <Icon as={Users} size="16" color={COLORS.primary} />
                              <Text fontSize="sm">Kapasitas</Text>
                            </HStack>
                          </Td>
                          <Td color="#666666" fontSize="sm" borderColor="rgba(255, 255, 255, 0.1)">{roomData.capacity} Orang</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium" color="#444444" pl={4} borderColor="transparent">
                            <HStack spacing={2}>
                              <Icon as={MapPin} size="16" color={COLORS.primary} />
                              <Text fontSize="sm">Lokasi</Text>
                            </HStack>
                          </Td>
                          <Td color="#666666" fontSize="sm" borderColor="transparent">{roomData.location}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                </VStack>
              </MotionTabPanel>

              {/* Tab 2: Fasilitas */}
              <MotionTabPanel
                p={0}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" color="#444444">
                    Fasilitas Tersedia
                  </Heading>
                  {roomData.facilities && roomData.facilities.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                      {roomData.facilities.map((facility, index) => {
                        const IconComponent = facilityIconMap[facility.iconUrl] || Building;

                        return (
                          <MotionBox
                            key={facility.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            bg="rgba(255, 255, 255, 0.08)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(255, 255, 255, 0.12)"
                            borderRadius="12px"
                            p={3}
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: "0 8px 25px rgba(116, 156, 115, 0.15)",
                              bg: "rgba(255, 255, 255, 0.12)"
                            }}
                          >
                            <HStack spacing={3}>
                              <Box
                                p={2}
                                bg="rgba(116, 156, 115, 0.15)"
                                borderRadius="10px"
                                color={COLORS.primary}
                              >
                                <Icon
                                  as={IconComponent}
                                  size="18"
                                />
                              </Box>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="#444444"
                              >
                                {facility.facilityName}
                              </Text>
                            </HStack>
                          </MotionBox>
                        );
                      })}
                    </SimpleGrid>
                  ) : (
                    <Box
                      p={6}
                      textAlign="center"
                      bg="rgba(255, 255, 255, 0.05)"
                      borderRadius="12px"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                    >
                      <Text color="#666666" fontSize="sm">
                        Tidak ada fasilitas yang tersedia
                      </Text>
                    </Box>
                  )}
                </VStack>
              </MotionTabPanel>

              {/* Tab 3: Pengelola Gedung */}
              <MotionTabPanel
                p={0}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" color="#444444">
                    Pengelola Gedung
                  </Heading>
                  {roomData.managers && roomData.managers.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {roomData.managers.map((manager, index) => (
                        <MotionBox
                          key={manager.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          bg="rgba(255, 255, 255, 0.08)"
                          backdropFilter="blur(10px)"
                          border="1px solid rgba(255, 255, 255, 0.12)"
                          borderRadius="12px"
                          p={4}
                          _hover={{
                            bg: "rgba(255, 255, 255, 0.12)",
                            transform: "translateY(-1px)"
                          }}
                        >
                          <HStack spacing={4}>
                            <Avatar
                              size="md"
                              name={manager.managerName}
                              bg={COLORS.primary}
                              color="white"
                            />
                            <VStack align="start" spacing={1} flex={1}>
                              <Text fontWeight="semibold" color="#444444" fontSize="sm">
                                {manager.managerName}
                              </Text>
                              <HStack spacing={2}>
                                <Icon as={Phone} size="14" color="#666666" />
                                <Text fontSize="xs" color="#666666">
                                  {manager.phoneNumber}
                                </Text>
                              </HStack>
                            </VStack>
                            <Tooltip label="Hubungi Manager" placement="top">
                              <Box
                                as="a"
                                href={`tel:${manager.phoneNumber}`}
                                p={2.5}
                                bg="rgba(116, 156, 115, 0.15)"
                                borderRadius="10px"
                                _hover={{
                                  bg: "rgba(116, 156, 115, 0.25)",
                                  transform: 'scale(1.05)'
                                }}
                                cursor="pointer"
                                transition="all 0.2s ease"
                              >
                                <Icon as={Phone} size="16" color={COLORS.primary} />
                              </Box>
                            </Tooltip>
                          </HStack>
                        </MotionBox>
                      ))}
                    </VStack>
                  ) : (
                    <Box
                      p={6}
                      textAlign="center"
                      bg="rgba(255, 255, 255, 0.05)"
                      borderRadius="12px"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                    >
                      <Text color="#666666" fontSize="sm">
                        Tidak ada pengelola yang tersedia
                      </Text>
                    </Box>
                  )}
                </VStack>
              </MotionTabPanel>
            </TabPanels>
          </Tabs>
        </MotionBox>
      </VStack>
    </MotionBox>
  );
};

export default RoomInfo; 