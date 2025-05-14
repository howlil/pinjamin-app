import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { MapPin, User, Coins, Users, Phone, Image, Building2, CheckCircle } from "lucide-react";
import { Gedungs } from "@/apis/interfaces/IGedung";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface GedungDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  building: Gedungs;
}

/**
 * GedungDetailDialog - Dialog showing full building details
 * with organized sections and better UI
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Detail Gedung
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Main image and basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative h-72 overflow-hidden rounded-lg bg-gray-100">
                  {building.foto_gedung ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/foto/${building.foto_gedung}`}
                      alt={building.nama_gedung}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                      <Image className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">Tidak ada foto</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{building.nama_gedung}</h2>
                  <Badge variant="secondary" className="mt-2">
                    <Building2 className="h-3 w-3 mr-1" />
                    {building.TipeGedung?.nama_tipe_gedung || "Tidak tersedia"}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-green-600 font-semibold text-lg">
                    <Coins className="w-5 h-5 mr-2" />
                    {formatRupiah(building.harga_sewa)}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Kapasitas {building.kapasitas || 0} orang</span>
                  </div>
                  
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{building.lokasi || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">
                {building.deskripsi || "Tidak ada deskripsi tersedia"}
              </p>
            </div>
            
            <Separator />
            
            {/* Facilities & Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facilities */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Fasilitas</h3>
                {building.FasilitasGedung && building.FasilitasGedung.length > 0 ? (
                  <div className="space-y-2">
                    {building.FasilitasGedung.map((fasilitas) => (
                      <motion.div
                        key={fasilitas.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center p-2 rounded-lg bg-gray-50"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{fasilitas.nama_fasilitas}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Tidak ada fasilitas yang ditambahkan</p>
                )}
              </div>
              
              {/* Responsible Persons */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Penanggung Jawab</h3>
                {building.penganggung_jawab_gedung && building.penganggung_jawab_gedung.length > 0 ? (
                  <div className="space-y-3">
                    {building.penganggung_jawab_gedung.map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-start">
                          <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {contact.nama_penangguang_jawab}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Phone className="w-4 h-4 mr-1" />
                              {contact.no_hp}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Tidak ada penanggung jawab yang ditambahkan</p>
                )}
              </div>
            </div>
            
            {/* Booking History Preview - if available */}
            {building.Peminjaman && building.Peminjaman.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Riwayat Peminjaman</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-700 text-sm">
                      Total {building.Peminjaman.length} peminjaman tercatat
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default GedungDetailDialog;