import React from 'react';
import { Box, Container, VStack, Alert, AlertIcon, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GLASS, SHADOWS } from '../../utils/designTokens';
import { useSchedule } from '../../hooks/booking';
import ScheduleHeader from '../../components/schedule/ScheduleHeader';
import CalendarHeader from '../../components/schedule/CalendarHeader';
import CalendarGrid from '../../components/schedule/CalendarGrid';
import EventDetailModal from '../../components/schedule/EventDetailModal';
import { CalendarDaySkeleton } from '../../components/ui/SkeletonLoading';

const MotionBox = motion(Box);

const SchedulePage = () => {
  const {
    isOpen,
    onClose,
    selectedEvent,
    currentDate,
    scheduleData,
    apiData,
    isLoading,
    getStatusColor,
    getStatusText,
    getDaysInMonth,
    getFirstDayOfMonth,
    formatDate,
    handleEventClick,
    navigateMonth
  } = useSchedule();

  return (
    <Box
      py={{ base: 4, md: 6, lg: 8 }}
      px={{ base: 3, sm: 4, md: 6 }}
      minH="100vh"
      bg="transparent"
    >
      <Container maxW="6xl" px={0}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Header and Legend - Compact */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ScheduleHeader apiData={apiData} />
          </MotionBox>

          {/* Calendar Container - Compact and Responsive */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            bg={GLASS.background}
            backdropFilter={GLASS.backdropFilter}
            border={GLASS.border}
            borderRadius={{ base: "16px", md: "20px" }}
            boxShadow={SHADOWS.glass}
            p={{ base: 3, sm: 4, md: 5, lg: 6 }}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(116,156,115,0.05) 0%, rgba(116,156,115,0.02) 100%)',
              borderRadius: "inherit",
              zIndex: -1
            }}
          >
            {/* Calendar Header with Navigation - Compact */}
            <CalendarHeader
              currentDate={currentDate}
              navigateMonth={navigateMonth}
            />

            {/* Calendar Content - Responsive */}
            {isLoading ? (
              <SimpleGrid
                columns={7}
                spacing={{ base: 1, sm: 2 }}
                minChildWidth="auto"
              >
                {Array.from({ length: 35 }).map((_, index) => (
                  <CalendarDaySkeleton key={index} />
                ))}
              </SimpleGrid>
            ) : Object.keys(scheduleData).length === 0 ? (
              <Alert
                status="info"
                borderRadius="12px"
                bg="rgba(116, 156, 115, 0.1)"
                borderColor="rgba(116, 156, 115, 0.2)"
                color="#444444"
                size="sm"
              >
                <AlertIcon color="#749C73" />
                Tidak ada jadwal peminjaman untuk bulan ini.
              </Alert>
            ) : (
              <CalendarGrid
                currentDate={currentDate}
                getDaysInMonth={getDaysInMonth}
                getFirstDayOfMonth={getFirstDayOfMonth}
                formatDate={formatDate}
                scheduleData={scheduleData}
                getStatusColor={getStatusColor}
                handleEventClick={handleEventClick}
              />
            )}
          </MotionBox>
        </VStack>
      </Container>

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={isOpen}
        onClose={onClose}
        selectedEvent={selectedEvent}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
    </Box>
  );
};

export default SchedulePage; 