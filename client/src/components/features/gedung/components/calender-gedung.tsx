import { useState, useEffect } from 'react';
import { Peminjaman } from '@/interfaces/IPeminjaman';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarDay {
  day: number | null;
  date: string | null;
  bookings: Peminjaman[];
}

interface CalendarGedungProps {
  data: {
    Peminjaman: Peminjaman[];
    [key: string]: any;
  };
  onBookingClick: (booking: Peminjaman) => void;
}

export default function CalendarGedung({ data, onBookingClick }: CalendarGedungProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [bookings, setBookings] = useState<Record<string, Peminjaman[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  
  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  useEffect(() => {
    if (data && data.Peminjaman) {
      const bookingsMap: Record<string, Peminjaman[]> = {};
      
      data.Peminjaman.forEach((booking: Peminjaman) => {
        const startDate = new Date(booking.tanggal_mulai);
        const endDate = new Date(booking.tanggal_selesai);
        
        for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
          const dateKey = day.toISOString().split('T')[0];
          
          if (!bookingsMap[dateKey]) {
            bookingsMap[dateKey] = [];
          }
          
          bookingsMap[dateKey].push(booking);
        }
      });
      
      setBookings(bookingsMap);
    }
    
    updateCalendar(currentDate);
  }, [data, currentDate]);
  
  const updateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthName = date.toLocaleString('id-ID', { month: 'long' });
    setCurrentMonth(`${monthName} ${year}`);
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const daysInMonth = lastDay.getDate();
    const days: CalendarDay[] = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: null, date: null, bookings: [] });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      
      days.push({
        day,
        date: dateKey,
        bookings: bookings[dateKey] || []
      });
    }
    
    setCalendarDays(days);
  };
  
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };
  
  const handleDateClick = (day: CalendarDay) => {
    if (day && day.bookings && day.bookings.length > 0) {
      onBookingClick(day.bookings[0]);
    } else if (day && day.date) {
      setSelectedDate(day.date);
    }
  };
  
  const getStatusClass = (day: CalendarDay): string => {
    if (!day || !day.date) return '';
    
    const bookingsForDay = day.bookings || [];
    
    if (bookingsForDay.length > 0) {
      const status = bookingsForDay[0].status_peminjaman;
      
      if (status === 'DISETUJUI') return 'bg-[#749C73] text-white';
      if (status === 'DITOLAK') return 'bg-[#b31c1c] text-white';
      if (status === 'PENDING') return 'bg-[#FCA129] text-white';
    }
    
    const today = new Date();
    if (day.date === today.toISOString().split('T')[0]) {
      return 'border-2 border-[#749C73] text-[#749C73]';
    }
    
    return 'hover:bg-gray-50 text-gray-700';
  };

  const getStatusIndicator = (status: string) => {
    switch(status) {
      case 'DISETUJUI': return 'bg-[#749C73]';
      case 'DITOLAK': return 'bg-[#b31c1c]';
      case 'PENDING': return 'bg-[#FCA129]';
      default: return 'bg-[#DCDCDC]';
    }
  };

  return (
    <div className="p-4 bg-[#bfffac1d] rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-900">{currentMonth}</h2>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPreviousMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm"
            aria-label="Previous month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm"
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden  border ">
        <div className="grid grid-cols-7">
          {daysOfWeek.map((day, index) => (
            <div key={day} className="text-center py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {calendarDays.map((dayObj, index) => (
            <div 
              key={index} 
              className={`relative ${index % 7 !== 0 ? 'border-l border-gray-50' : ''} ${index >= 7 ? 'border-t border-gray-50' : ''}`}
              onMouseEnter={() => dayObj.day && setHoveredDay(dayObj.day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {dayObj.day ? (
                <div className="py-1 px-1 h-14">
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDateClick(dayObj)}
                      className={`
                        h-8 w-8 rounded-full flex items-center justify-center text-sm
                        ${getStatusClass(dayObj)}
                        ${selectedDate === dayObj.date ? 'ring-2 ring-[#749C73] ring-opacity-50' : ''}
                        transition-all duration-150
                      `}
                    >
                      {dayObj.day}
                    </motion.button>
                  </div>
                  
                  {(dayObj.bookings.length > 0 && hoveredDay === dayObj.day) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      className="absolute z-10 left-0 right-0 mx-1 px-2 py-1 mt-1 bg-white shadow-md rounded-md border border-gray-100"
                    >
                      {dayObj.bookings.map((booking, bIdx) => (
                        <div 
                          key={bIdx}
                          className="text-xs truncate cursor-pointer flex items-center py-1" 
                          onClick={() => onBookingClick(booking)}
                        >
                          <div className={`h-2 w-2 rounded-full mr-1.5 ${getStatusIndicator(booking.status_peminjaman)}`}></div>
                          <span className="text-gray-700">Booking</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  
                  {(dayObj.bookings.length > 0 && hoveredDay !== dayObj.day) && (
                    <div className="flex justify-center mt-1">
                      {dayObj.bookings.slice(0, Math.min(3, dayObj.bookings.length)).map((booking, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 w-1.5 rounded-full mx-0.5 ${getStatusIndicator(booking.status_peminjaman)}`}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-14 bg-gray-50/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Keterangan ruangan yang sudah dipinjam</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#749C73] mr-2"></div>
            <span className="text-xs text-gray-600">Ruangan sudah diajukan</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FCA129] mr-2"></div>
            <span className="text-xs text-gray-600">Ruangan sedang diajukan</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#b31c1c] mr-2"></div>
            <span className="text-xs text-gray-600">Ruangan ditolak</span>
          </div>
        </div>
      </div>
    </div>
  );
}