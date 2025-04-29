import { useState } from "react";
import { ResCheckAvailable } from "@/apis/interfaces/IGedung";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface AvailableRoomsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableRooms: ResCheckAvailable[];
}

/**
 * Component to display available rooms in a dialog after checking availability
 */
const AvailableRoomsDialog = ({
  open,
  onOpenChange,
  availableRooms,
}: AvailableRoomsDialogProps) => {
  const navigate = useNavigate();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  /**
   * Format price to Indonesian Rupiah format
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  /**
   * Handle navigation to room detail page
   */
  const handleViewDetail = (roomId: string) => {
    navigate(`/gedung/${roomId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white/10 backdrop-blur-sm rounded-xl p-0 overflow-hidden">
        <div className="p-4 border-b flex mt-4 justify-between items-center">
          <DialogTitle className="text-lg font-medium">
            Gedung Tersedia
          </DialogTitle>
          <div className="text-gray-500">{availableRooms.length} Gedung</div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {availableRooms.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-600">
                Tidak ada gedung yang tersedia pada waktu tersebut.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {availableRooms.map((room) => (
                <motion.div
                  key={room.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                  whileHover={{ y: -2 }}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <div className="flex">
                    <div className="w-28 h-28">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/foto/${room.foto_gedung}`}
                        alt={room.nama_gedung}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col">
                      <div>
                        <h3 className="font-medium">{room.nama_gedung}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            Kapasitas: {room.kapasitas} orang
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-2">
                            {room.lokasi}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-[#749C73]">
                          Rp {formatPrice(room.harga_sewa)}
                        </p>
                      </div>
                      
                      {hoveredRoom === room.id && (
                        <motion.div 
                          className="mt-auto pt-2 self-end"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Button 
                            size="sm" 
                            onClick={() => handleViewDetail(room.id)}
                          >
                            Lihat Detail
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailableRoomsDialog;