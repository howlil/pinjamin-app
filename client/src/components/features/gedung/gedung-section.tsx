import { useState, useEffect } from "react";
import CalendarGedung from "./components/calender-gedung";
import DetailGedung from "./components/detail-gedung";
import { GedungService } from "@/apis/gedung";
import { useParams } from "react-router-dom";
import { Gedungs } from "@/apis/interfaces/IGedung";
import { Peminjaman } from "@/apis/interfaces/IPeminjaman";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import BookingDetailModal from "./components/booking-detail-modal";

export default function GedungSection() {
  const [dataGedung, setDataGedung] = useState<Gedungs | undefined>(undefined);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Peminjaman | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showPeminjamanForm, setShowPeminjamanForm] = useState(false);

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
    setSelectedBooking(null);
  };



  return (
    <div className="py-20 min-h-screen">
      <header className="">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <motion.nav
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-sm"
          >
            <a
              href="/"
              className="text-gray-500 hover:text-[#749C73] transition-colors"
            >
              Beranda
            </a>
            <svg
              className="h-3 w-3 mx-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <a
              href="/gedung"
              className="text-gray-500 hover:text-[#749C73] transition-colors"
            >
              Gedung
            </a>
            {!isLoading && dataGedung && (
              <>
                <svg
                  className="h-3 w-3 mx-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-[#749C73] font-medium">
                  {dataGedung.nama_gedung}
                </span>
              </>
            )}
          </motion.nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4">
       
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dataGedung && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DetailGedung data={dataGedung} />
              </motion.div>
            )}

            {dataGedung && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CalendarGedung
                  data={dataGedung}
                  onBookingClick={handleBookingClick}
                />
                <Button onClick={() => setShowPeminjamanForm(true)}>
                  Ajukan Peminjaman
                </Button>
              </motion.div>
            )}
          </div>

        {/* Booking Detail Modal */}
        <AnimatePresence>
          {showModal && selectedBooking && (
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
