import React, { useState, useEffect } from "react";
import CalendarGedung from "./components/calender-gedung";
import DetailGedung from "./components/detail-gedung";
import { GedungService } from "@/apis/gedung";
import { useParams } from "react-router-dom";
import { Gedungs } from "@/interfaces/IGedung";
import { Peminjaman } from "@/interfaces/IPeminjaman";
import { AnimatePresence, motion } from "framer-motion";

// Modal component for booking details
const BookingDetailModal = ({ booking, isOpen, onClose }: { booking: Peminjaman | null, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen || !booking) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DISETUJUI': return 'bg-[#749C73] text-white';
      case 'DITOLAK': return 'bg-[#1F0909] text-white';
      default: return 'bg-[#FCA129] text-white';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-30"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", bounce: 0, duration: 0.25 }}
          className="relative bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-md mx-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className={`p-4 ${getStatusColor(booking.status_peminjaman)} flex justify-between items-center`}>
            <h3 className="text-base font-medium">Detail Peminjaman</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs font-medium text-gray-500 mb-1">Tanggal Mulai</div>
                <div className="font-medium text-gray-900">{new Date(booking.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs font-medium text-gray-500 mb-1">Tanggal Selesai</div>
                <div className="font-medium text-gray-900">{new Date(booking.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
            
            {booking.keterangan && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-1">Keterangan</div>
                <div className="p-3 bg-gray-50 rounded-md text-gray-700 text-sm">{booking.keterangan}</div>
              </div>
            )}
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium transition-all duration-200"
              >
                Tutup
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Modern elegant loader
const ElegantLoader = () => (
  <div className="flex justify-center items-center py-12">
    <motion.div 
      animate={{ 
        rotate: 360,
        transition: { 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        } 
      }}
      className="w-12 h-12 border-2 border-t-[#749C73] border-[#e5e7eb] rounded-full"
    ></motion.div>
  </div>
);

export default function GedungSection() {
  const [dataGedung, setDataGedung] = useState<Gedungs | undefined>(undefined);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Peminjaman | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchGedung() {
      try {
        setIsLoading(true);
        
        if (id) {
          const res = await GedungService.getGedungById(id);
          setDataGedung(res.data);
        } else {
          console.error("ID tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching gedung data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGedung();
  }, [id]);

  const handleBookingClick = (booking: Peminjaman) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="py-20 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <motion.nav 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-sm"
          >
            <a href="/" className="text-gray-500 hover:text-[#749C73] transition-colors">
              Beranda
            </a>
            <svg className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/gedung" className="text-gray-500 hover:text-[#749C73] transition-colors">
              Gedung
            </a>
            {!isLoading && dataGedung && (
              <>
                <svg className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[#749C73] font-medium">{dataGedung.nama_gedung}</span>
              </>
            )}
          </motion.nav>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-4">
        {isLoading ? (
          <ElegantLoader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dataGedung && 
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DetailGedung data={dataGedung} />
              </motion.div>
            }
            
            {dataGedung && 
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CalendarGedung data={dataGedung} onBookingClick={handleBookingClick} />
              </motion.div>
            }
          </div>
        )}
        
        <AnimatePresence>
          {showModal && (
            <BookingDetailModal
              booking={selectedBooking}
              isOpen={showModal}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}