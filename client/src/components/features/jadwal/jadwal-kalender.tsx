// // src/components/features/jadwal/jadwal-calendar.tsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { Skeleton } from '@/components/ui/skeleton';
// import { JadwalService } from '@/apis/jadwal';
// import { Peminjaman } from '@/apis/interfaces/IPeminjaman';
// import { STATUS } from '@/apis/interfaces/IEnum';
// import BookingDetail from '@/components/features/jadwal/booking-detail';
// import { CalendarModel, CalendarDay } from '@/models/CalendarModel';

// /**
//  * Component for displaying the calendar with peminjaman (bookings)
//  */
// const JadwalCalendar: React.FC = () => {
//   // State
//   const [calendarModel, setCalendarModel] = useState<CalendarModel>(new CalendarModel());
//   const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [selectedBooking, setSelectedBooking] = useState<Peminjaman | null>(null);
//   const [showModal, setShowModal] = useState<boolean>(false);

//   const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

//   // Fetch bookings when the current date changes
//   useEffect(() => {
//     fetchBookingsForCurrentMonth();
//   }, [calendarModel.getCurrentDate()]);

//   /**
//    * Fetch bookings for the current month from the API
//    */
//   const fetchBookingsForCurrentMonth = async () => {
//     setIsLoading(true);
    
//     try {
//       const firstDay = calendarModel.getFirstDayOfMonth();
//       const lastDay = calendarModel.getLastDayOfMonth();
      
//       const firstDayStr = calendarModel.formatDateForApi(firstDay);
//       const lastDayStr = calendarModel.formatDateForApi(lastDay);

//       const data = await JadwalService.getAllPeminjamanByDateRange(firstDayStr, lastDayStr);
      
//       // Organize bookings by date
//       const bookingsMap: Record<string, Peminjaman[]> = {};
      
//       data.forEach((booking) => {
//         const startDate = new Date(booking.tanggal_mulai);
//         const endDate = new Date(booking.tanggal_selesai);
        
//         // For each day in the booking's date range
//         for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
//           const dateKey = calendarModel.formatDateKey(day);
          
//           if (!bookingsMap[dateKey]) {
//             bookingsMap[dateKey] = [];
//           }
          
//           bookingsMap[dateKey].push(booking);
//         }
//       });
      
//       // Update the model with bookings
//       const updatedModel = new CalendarModel(calendarModel.getCurrentDate(), bookingsMap);
//       setCalendarModel(updatedModel);
      
//       // Generate calendar days
//       setCalendarDays(updatedModel.generateCalendarDays());
//     } catch (error) {
//       console.error('Failed to fetch bookings:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Navigate to previous month
//    */
//   const goToPreviousMonth = () => {
//     const updatedModel = new CalendarModel(calendarModel.getCurrentDate(), calendarModel['bookings']);
//     updatedModel.previousMonth();
//     setCalendarModel(updatedModel);
//   };

//   /**
//    * Navigate to next month
//    */
//   const goToNextMonth = () => {
//     const updatedModel = new CalendarModel(calendarModel.getCurrentDate(), calendarModel['bookings']);
//     updatedModel.nextMonth();
//     setCalendarModel(updatedModel);
//   };

//   /**
//    * Handle booking click to show details
//    */
//   const handleBookingClick = (booking: Peminjaman) => {
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   /**
//    * Close booking detail modal
//    */
//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedBooking(null);
//   };

//   /**
//    * Get the appropriate CSS class for a booking based on its status
//    */
//   const getStatusClass = (status: typeof STATUS.STATUS_PEMINJAMAN): string => {
//     if (status === STATUS.STATUS_PEMINJAMAN.DISETUJUI) {
//       return 'bg-[#749C73] text-white';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.DITOLAK) {
//       return 'bg-red-500 text-white';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.DIPROSES) {
//       return 'bg-[#FCA129] text-white';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.SELESAI) {
//       return 'bg-gray-500 text-white';
//     }
//     return 'bg-gray-200';
//   };

//   /**
//    * Format time (e.g., "08:00" → "08:00")
//    */
//   const formatTime = (timeString: string): string => {
//     return timeString;
//   };

//   /**
//    * Check if a date is today
//    */
//   const isToday = (date: Date): boolean => {
//     const today = new Date();
//     return (
//       date.getDate() === today.getDate() &&
//       date.getMonth() === today.getMonth() &&
//       date.getFullYear() === today.getFullYear()
//     );
//   };

//   return (
//     <div className="space-y-4">
//       <Card className="p-4">
//         {/* Calendar Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-2">
//             <h2 className="text-xl font-medium">
//               {calendarModel.getMonthName()} {calendarModel.getCurrentDate().getFullYear()}
//             </h2>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button variant="ghost" size="icon" className="rounded-full h-6 w-6">
//                     <Info className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Jadwal peminjaman semua gedung</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>

//           <div className="flex space-x-2">
//             <Button 
//               onClick={goToPreviousMonth} 
//               variant="outline" 
//               size="icon" 
//               className="h-9 w-9 rounded-full"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <Button
//               onClick={goToNextMonth}
//               variant="outline"
//               size="icon"
//               className="h-9 w-9 rounded-full"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="grid grid-cols-7 gap-1">
//           {/* Day Headers */}
//           {daysOfWeek.map((day) => (
//             <div 
//               key={day} 
//               className="text-center py-2 font-medium text-sm text-gray-500"
//             >
//               {day}
//             </div>
//           ))}

//           {/* Calendar Days */}
//           {isLoading ? (
//             // Loading skeleton
//             Array.from({ length: 42 }).map((_, index) => (
//               <div key={index} className="min-h-[100px] p-1">
//                 <Skeleton className="h-full w-full rounded-md" />
//               </div>
//             ))
//           ) : (
//             // Calendar days with bookings
//             calendarDays.map((day, index) => (
//               <div 
//                 key={index}
//                 className={`min-h-[100px] p-1 ${!day.isCurrentMonth ? 'opacity-40' : ''}`}
//               >
//                 <div className="h-full rounded-md border bg-white/80 shadow-sm hover:bg-white transition-colors overflow-hidden flex flex-col">
//                   {/* Day number */}
//                   <div className={`text-sm px-2 py-1 ${
//                     isToday(day.date) ? 
//                     'bg-[#749C73] text-white font-medium' : 
//                     'text-gray-700'
//                   }`}>
//                     {day.date.getDate()}
//                   </div>

//                   {/* Bookings */}
//                   <div className="flex-1 p-1 overflow-y-auto text-xs">
//                     {day.bookings.map((booking, bookingIndex) => (
//                       <motion.div
//                         key={`${booking.id}-${bookingIndex}`}
//                         initial={{ opacity: 0, y: 5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: bookingIndex * 0.1 }}
//                         onClick={() => handleBookingClick(booking)}
//                         className={`mb-1 px-1 py-0.5 rounded truncate cursor-pointer ${getStatusClass(booking.status_peminjaman)}`}
//                       >
//                         <div className="font-medium truncate">{booking.nama_kegiatan}</div>
//                         <div className="text-xs opacity-90">
//                           {formatTime(booking.jam_mulai)} - {formatTime(booking.jam_selesai)}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </Card>

//       {/* Legend */}
//       <div className="flex flex-wrap items-center gap-4 p-4 bg-white/80 rounded-md border">
//         <h3 className="font-medium mr-2">Status:</h3>
//         <div className="flex items-center">
//           <div className="w-3 h-3 rounded-full bg-[#749C73] mr-2"></div>
//           <span className="text-sm">Disetujui</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-3 h-3 rounded-full bg-[#FCA129] mr-2"></div>
//           <span className="text-sm">Diproses</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//           <span className="text-sm">Ditolak</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
//           <span className="text-sm">Selesai</span>
//         </div>
//       </div>

//       {/* Booking Detail Modal */}
//       {selectedBooking && (
//         <BookingDetail
//           booking={selectedBooking}
//           isOpen={showModal}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// };

// export default JadwalCalendar;