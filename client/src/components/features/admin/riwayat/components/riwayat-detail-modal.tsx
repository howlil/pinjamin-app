import React from "react";
import { Peminjaman } from "@/apis/interfaces/IPeminjaman";
import { STATUS } from "@/apis/interfaces/IEnum";
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
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Building, 
  DollarSign,
  Printer
} from "lucide-react";

interface RiwayatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  peminjaman: Peminjaman;
}

const RiwayatDetailModal: React.FC<RiwayatDetailModalProps> = ({
  isOpen,
  onClose,
  peminjaman,
}) => {
  // Format currency to Indonesian Rupiah
  const formatRupiah = (amount: number): string => {
    try {
      if (isNaN(amount)) return 'Rp 0';
      
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `Rp ${amount}`;
    }
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

  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch(status) {
      case STATUS.STATUS_PEMINJAMAN.DISETUJUI:
        return "bg-green-50 text-green-700 border-green-100";
      case STATUS.STATUS_PEMINJAMAN.DITOLAK:
        return "bg-red-50 text-red-700 border-red-100";
      case STATUS.STATUS_PEMINJAMAN.SELESAI:
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    switch(status) {
      case STATUS.STATUS_PEMINJAMAN.DISETUJUI:
        return "Disetujui";
      case STATUS.STATUS_PEMINJAMAN.DITOLAK:
        return "Ditolak";
      case STATUS.STATUS_PEMINJAMAN.SELESAI:
        return "Selesai";
      default:
        return status;
    }
  };

  // Mock print invoice function
  const handlePrintInvoice = () => {
    // In a real implementation, this would generate and print an invoice
    alert('Cetak invoice untuk ' + peminjaman.nama_kegiatan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="bg-gray-50 p-4">
          <DialogHeader className="pb-2">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Detail Peminjaman
              </DialogTitle>
              <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusBadgeClass(peminjaman.status_peminjaman as string)}`}>
                {getStatusLabel(peminjaman.status_peminjaman as string)}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-light">
              Detail peminjaman untuk kegiatan di {peminjaman.gedung?.nama_gedung || "gedung"}
            </p>
          </DialogHeader>
        </div>
        
        <div className="p-5">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">{peminjaman.nama_kegiatan}</h3>
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
                      <span className="text-sm text-green-600 font-medium">
                        {peminjaman.gedung ? formatRupiah(peminjaman.gedung.harga_sewa) : "N/A"}
                      </span>
                    </div>
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
                        <div className="bg-gray-200 text-gray-600 rounded-full p-2">
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
                  
                  {peminjaman.status_peminjaman === STATUS.STATUS_PEMINJAMAN.DITOLAK && peminjaman.alasan_penolakan && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-1 text-red-500">
                        Alasan Penolakan
                      </h4>
                      <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                        {peminjaman.alasan_penolakan}
                      </div>
                    </div>
                  )}
                  
                  {(peminjaman.status_peminjaman === STATUS.STATUS_PEMINJAMAN.DISETUJUI || 
                   peminjaman.status_peminjaman === STATUS.STATUS_PEMINJAMAN.SELESAI) && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500">
                        <DollarSign className="h-4 w-4" /> Informasi Pembayaran
                      </h4>
                      
                      {peminjaman.pembayaran ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">No. Invoice:</span>
                            <span className="text-sm font-medium">
                              {peminjaman.pembayaran.no_invoice || "-"}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Metode Pembayaran:</span>
                            <span className="text-sm font-medium">
                              {peminjaman.pembayaran.metode_pembayaran || "-"}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Tanggal Bayar:</span>
                            <span className="text-sm font-medium">
                              {formatDate(peminjaman.pembayaran.tanggal_bayar)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Status Pembayaran:</span>
                            <span className="text-sm font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                              {peminjaman.pembayaran.status_pembayaran}
                            </span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Pembayaran:</span>
                            <span className="text-green-600 font-semibold">
                              {formatRupiah(peminjaman.pembayaran.total_bayar)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Belum ada informasi pembayaran
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-200"
            >
              Tutup
            </Button>
            
            {peminjaman.pembayaran && peminjaman.pembayaran.status_pembayaran === STATUS.STATUS_TRANSAKSI.PAID && (
              <Button
                variant="default"
                onClick={handlePrintInvoice}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Printer className="h-4 w-4" />
                Cetak Invoice
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RiwayatDetailModal;