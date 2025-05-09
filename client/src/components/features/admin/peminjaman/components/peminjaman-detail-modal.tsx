import React, { useState } from "react";
import { Peminjaman } from "@/apis/interfaces/IPeminjaman";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatTime } from "@/utils/format-date";
import TextAreaInput from "@/components/ui/costum/input/text-area-input";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Building, 
  DollarSign,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PeminjamanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  peminjaman: Peminjaman;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const PeminjamanDetailModal: React.FC<PeminjamanDetailModalProps> = ({
  isOpen,
  onClose,
  peminjaman,
  onApprove,
  onReject,
}) => {
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Format IDR currency
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total days of rental
  const calculateDurationDays = (): number => {
    try {
      const startDate = new Date(peminjaman.tanggal_mulai);
      const endDate = new Date(peminjaman.tanggal_selesai);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include the start day
    } catch (error) {
      return 1;
    }
  };

  // Handle rejection form submission
  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    onReject(peminjaman.id, rejectionReason);
    // Note: The setIsSubmitting(false) will be handled by the parent component
    // after the API call completes or fails
  };

  // Reset form when modal is closed
  const handleClose = () => {
    setShowRejectForm(false);
    setRejectionReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="bg-main-green/90 text-white p-4">
          <DialogHeader className="pb-2">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold">
                Detail Ajuan Peminjaman
              </DialogTitle>
              <div className="px-2 py-1 bg-white/20 rounded-md text-xs font-medium">
                {formatDate(peminjaman.tanggal_mulai)}
              </div>
            </div>
            <p className="text-white/90 text-sm font-light">
              Ajuan peminjaman untuk kegiatan di {peminjaman.gedung?.nama_gedung || "gedung"}
            </p>
          </DialogHeader>
        </div>
        
        <div className="p-5">
          <AnimatePresence mode="wait">
            {showRejectForm ? (
              <motion.div
                key="reject-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-500"
                    onClick={() => setShowRejectForm(false)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Kembali
                  </Button>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-800 mb-1">Konfirmasi Penolakan</h3>
                      <p className="text-sm text-amber-700">
                        Anda akan menolak ajuan peminjaman untuk kegiatan <span className="font-medium">{peminjaman.nama_kegiatan}</span>. 
                        Mohon berikan alasan penolakan yang jelas untuk peminjam.
                      </p>
                    </div>
                  </div>
                </div>
                
                <TextAreaInput
                  name="rejectionReason"
                  label="Alasan Penolakan"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan yang jelas agar peminjam dapat memahami keputusan ini..."
                  required
                  rows={5}
                  error={rejectionReason.trim() === "" ? "Alasan penolakan wajib diisi" : ""}
                  className="resize-none"
                />
                
                <DialogFooter className="flex space-x-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(false)}
                    disabled={isSubmitting}
                    className="border-gray-200"
                  >
                    Batal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRejectSubmit}
                    disabled={isSubmitting || rejectionReason.trim() === ""}
                    className="gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    {isSubmitting ? "Memproses..." : "Tolak Peminjaman"}
                  </Button>
                </DialogFooter>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{peminjaman.nama_kegiatan}</h3>
                    <div className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Menunggu Persetujuan
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500 mb-2">
                          <Building className="h-4 w-4" /> Informasi Gedung
                        </h4>
                        <div className="space-y-3 pl-5">
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium min-w-28">Nama Gedung:</span>
                            <span className="text-sm">{peminjaman.gedung?.nama_gedung || "N/A"}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium min-w-28">Harga Sewa:</span>
                            <span className="text-sm text-main-green font-medium">
                              {peminjaman.gedung ? formatRupiah(peminjaman.gedung.harga_sewa) : "N/A"}
                            </span>
                          </div>
                          {peminjaman.gedung?.lokasi && (
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-medium min-w-28">Lokasi:</span>
                              <span className="text-sm">{peminjaman.gedung.lokasi}</span>
                            </div>
                          )}
                          {peminjaman.gedung?.kapasitas && (
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-medium min-w-28">Kapasitas:</span>
                              <span className="text-sm">{peminjaman.gedung.kapasitas} orang</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500 mb-2">
                          <Calendar className="h-4 w-4" /> Waktu Peminjaman
                        </h4>
                        <div className="space-y-3 pl-5">
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium min-w-28">Tanggal Mulai:</span>
                            <span className="text-sm">{formatDate(peminjaman.tanggal_mulai)}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium min-w-28">Tanggal Selesai:</span>
                            <span className="text-sm">{formatDate(peminjaman.tanggal_selesai)}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium min-w-28">Jam:</span>
                            <span className="text-sm">
                              {formatTime(peminjaman.jam_mulai)} - {formatTime(peminjaman.jam_selesai)}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium min-w-28">Durasi:</span>
                            <span className="text-sm">{calculateDurationDays()} hari</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500 mb-2">
                          <FileText className="h-4 w-4" /> Dokumen
                        </h4>
                        <div className="space-y-3 pl-5">
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium min-w-28">Surat Pengajuan:</span>
                            {peminjaman.surat_pengajuan ? (
                              <a
                                href={`${import.meta.env.VITE_API_URL}/dokumen/${peminjaman.surat_pengajuan}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 transition-colors"
                              >
                                <FileText className="h-3 w-3" /> Lihat Dokumen
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500">Tidak ada dokumen</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-5">
                        <div>
                          <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500 mb-3">
                            <User className="h-4 w-4" /> Informasi Peminjam
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-main-green/10 text-main-green rounded-full p-2">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {peminjaman.pengguna?.nama_lengkap || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {peminjaman.pengguna?.tipe_peminjam === "INUNAND" 
                                    ? "Civitas Academic Unand" 
                                    : "Non Civitas"}
                                </div>
                              </div>
                            </div>
                            
                            <div className="pl-10 space-y-2.5">
                              {peminjaman.pengguna?.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{peminjaman.pengguna.email}</span>
                                </div>
                              )}
                              
                              {peminjaman.pengguna?.no_hp && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{peminjaman.pengguna.no_hp}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500">
                            <DollarSign className="h-4 w-4" /> Ringkasan Biaya
                          </h4>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Harga sewa per hari</span>
                            <span className="text-sm font-medium">
                              {peminjaman.gedung ? formatRupiah(peminjaman.gedung.harga_sewa) : "N/A"}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Durasi peminjaman</span>
                            <span className="text-sm font-medium">{calculateDurationDays()} hari</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total biaya</span>
                            <span className="text-main-green font-semibold">
                              {peminjaman.gedung 
                                ? formatRupiah(peminjaman.gedung.harga_sewa * calculateDurationDays()) 
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleClose}
                    className="w-full sm:w-auto border-gray-200"
                  >
                    Tutup
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(true)}
                    className="w-full sm:w-auto border-red-200 bg-red-50 hover:bg-red-100 text-red-600 gap-1.5"
                  >
                    <XCircle className="h-4 w-4" />
                    Tolak Peminjaman
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => onApprove(peminjaman.id)}
                    className="w-full sm:w-auto bg-main-green hover:bg-main-green/90 gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Setujui Peminjaman
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeminjamanDetailModal;
