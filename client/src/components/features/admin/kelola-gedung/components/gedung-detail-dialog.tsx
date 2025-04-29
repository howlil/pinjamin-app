import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Gedung } from "@/apis/interfaces/IGedung";
import { MapPin, User, Coins } from "lucide-react";

interface GedungDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  building: Gedung;
}

/**
 * GedungDetailDialog - Dialog showing full building details
 * with glassmorphism effect
 */
const GedungDetailDialog: FC<GedungDetailDialogProps> = ({
  open,
  onOpenChange,
  building,
}) => {
  // Format currency to Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/50 backdrop-blur-md border border-white/20 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Detail Gedung
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Main image and info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-64 overflow-hidden rounded-lg bg-gray-100">
                {building.foto_gedung ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/foto/${building.foto_gedung}`}
                    alt={building.nama_gedung}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-400 text-sm">Tidak ada foto</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{building.nama_gedung}</h2>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Coins className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium text-[#749C73]">
                    {formatRupiah(building.harga_sewa)}
                  </span>
                </div>
                
                {building.kapasitas && (
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Kapasitas {building.kapasitas} orang</span>
                  </div>
                )}
                
                {building.lokasi && (
                  <div className="flex items-start text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <span>{building.lokasi}</span>
                  </div>
                )}
                
                <div className="bg-white/50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Tipe Gedung</h3>
                  <p className="text-gray-600">
                    {building.tipe_gedung_id || "Tidak tersedia"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Deskripsi</h3>
              <p className="text-gray-600">
                {building.deskripsi || "Tidak ada deskripsi tersedia"}
              </p>
            </div>
            
            {/* Facilities & Contact Info - if available */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {building.FasilitasGedung && building.FasilitasGedung.length > 0 && (
                <div className="bg-white/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Fasilitas</h3>
                  <ul className="space-y-2">
                    {building.FasilitasGedung.map((fasilitas) => (
                      <li key={fasilitas.id} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-gray-600 text-sm">{fasilitas.nama_fasilitas}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {building.penganggung_jawab_gedung && building.penganggung_jawab_gedung.length > 0 && (
                <div className="bg-white/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Penanggung Jawab</h3>
                  <ul className="space-y-3">
                    {building.penganggung_jawab_gedung.map((contact) => (
                      <li key={contact.id} className="text-gray-600">
                        <div className="font-medium">{contact.nama_penangguang_jawab}</div>
                        <div className="text-sm text-gray-500">{contact.no_hp}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default GedungDetailDialog;