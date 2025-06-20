import React from 'react';
import { Box, Container, VStack, Alert, AlertIcon, SimpleGrid } from '@chakra-ui/react';
import { GLASS, SHADOWS } from '@/utils/designTokens';
import { useSchedule } from '@/hooks/useSchedule';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import CalendarHeader from '@/components/schedule/CalendarHeader';
import CalendarGrid from '@/components/schedule/CalendarGrid';
import EventDetailModal from '@/components/schedule/EventDetailModal';
import { CalendarDaySkeleton } from '@/components/ui/SkeletonLoading';

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
    <Box py={8} minH="100vh">
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header and Legend */}
          <ScheduleHeader apiData={apiData} />

          {/* Calendar */}
          <Box
            bg={GLASS.background}
            backdropFilter={GLASS.backdropFilter}
            border={GLASS.border}
            borderRadius="20px"
            boxShadow={SHADOWS.glass}
            p={6}
            position="relative"
          >
            {/* Calendar Header with Navigation */}
            <CalendarHeader
              currentDate={currentDate}
              navigateMonth={navigateMonth}
            />

            {/* Calendar Content */}
            {isLoading ? (
              <SimpleGrid columns={7} spacing={2}>
                {Array.from({ length: 35 }).map((_, index) => (
                  <CalendarDaySkeleton key={index} />
                ))}
              </SimpleGrid>
            ) : Object.keys(scheduleData).length === 0 ? (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
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
          </Box>
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