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
  User, 
  Phone, 
  Mail, 
  FileText, 
  Building, 
  DollarSign,
  Printer,
  Receipt,
  CreditCard,
  Clock
} from "lucide-react";

interface TransaksiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  peminjaman: Peminjaman;
}

const TransaksiDetailModal: React.FC<TransaksiDetailModalProps> = ({
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

  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch(status) {
      case STATUS.STATUS_TRANSAKSI.PAID:
        return "bg-green-50 text-green-700 border-green-100";
      case STATUS.STATUS_TRANSAKSI.PENDING:
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case STATUS.STATUS_TRANSAKSI.CANCELED:
        return "bg-red-50 text-red-700 border-red-100";
      case STATUS.STATUS_TRANSAKSI.REFUNDED:
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    switch(status) {
      case STATUS.STATUS_TRANSAKSI.PAID:
        return "Lunas";
      case STATUS.STATUS_TRANSAKSI.PENDING:
        return "Menunggu Pembayaran";
      case STATUS.STATUS_TRANSAKSI.CANCELED:
        return "Dibatalkan";
      case STATUS.STATUS_TRANSAKSI.REFUNDED:
        return "Dikembalikan";
      default:
        return status;
    }
  };

  // Mock print invoice function
  const handlePrintInvoice = () => {
    // In a real implementation, this would generate and print an invoice
    alert('Cetak invoice untuk ' + peminjaman.nama_kegiatan);
  };

  // Mock refund function
  const handleProcessRefund = () => {
    // In a real implementation, this would process a refund
    alert('Proses pengembalian dana untuk ' + peminjaman.nama_kegiatan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="bg-gray-50 p-4">
          <DialogHeader className="pb-2">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Detail Transaksi
              </DialogTitle>
              {peminjaman.pembayaran && (
                <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusBadgeClass(peminjaman.pembayaran.status_pembayaran)}`}>
                  {getStatusLabel(peminjaman.pembayaran.status_pembayaran)}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm font-light">
              {peminjaman.pembayaran?.no_invoice 
                ? `Invoice: ${peminjaman.pembayaran.no_invoice}` 
                : "Detail transaksi pembayaran"}
            </p>
          </DialogHeader>
        </div>
        
        <div className="p-5">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium text-gray-900">{peminjaman.nama_kegiatan}</h3>
              {peminjaman.pembayaran?.tanggal_bayar && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(peminjaman.pembayaran.tanggal_bayar)}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div className="space-y-5">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-medium flex items-center gap-1 text-gray-700 mb-3">
                    <Receipt className="h-4 w-4" /> Informasi Transaksi
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">No. Invoice:</span>
                      <span className="text-sm font-medium">
                        {peminjaman.pembayaran?.no_invoice || "-"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tanggal Bayar:</span>
                      <span className="text-sm font-medium">
                        {peminjaman.pembayaran?.tanggal_bayar 
                          ? formatDate(peminjaman.pembayaran.tanggal_bayar) 
                          : "-"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ID Transaksi:</span>
                      <span className="text-sm font-medium">
                        {peminjaman.pembayaran?.transaksi_midtrans_id || "-"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Metode Pembayaran:</span>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm font-medium">
                          {peminjaman.pembayaran?.metode_pembayaran || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500 mb-2">
                    <Building className="h-4 w-4" /> Informasi Gedung
                  </h4>
                  <div className="space-y-3 pl-5">
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-600">Nama Gedung:</span>
                      <span className="text-sm">{peminjaman.gedung?.nama_gedung || "N/A"}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-600">Periode Sewa:</span>
                      <span className="text-sm">
                        {formatDate(peminjaman.tanggal_mulai)}
                        {peminjaman.tanggal_mulai !== peminjaman.tanggal_selesai 
                          ? ` - ${formatDate(peminjaman.tanggal_selesai)}` 
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-600">Waktu:</span>
                      <span className="text-sm">
                        {formatTime(peminjaman.jam_mulai)} - {formatTime(peminjaman.jam_selesai)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1 text-gray-500 mb-2">
                    <User className="h-4 w-4" /> Informasi Peminjam
                  </h4>
                  <div className="space-y-3 pl-5">
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-600">Nama:</span>
                      <span className="text-sm">{peminjaman.pengguna?.nama_lengkap || "N/A"}</span>
                    </div>
                    {peminjaman.pengguna?.email && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm">{peminjaman.pengguna.email}</span>
                      </div>
                    )}
                    {peminjaman.pengguna?.no_hp && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-gray-600">Telepon:</span>
                        <span className="text-sm">{peminjaman.pengguna.no_hp}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-medium flex items-center gap-1 text-gray-700 mb-4">
                    <DollarSign className="h-4 w-4" /> Rincian Pembayaran
                  </h4>
                  
                  {peminjaman.pembayaran ? (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Harga Sewa:</span>
                          <span className="text-sm font-medium">
                            {formatRupiah(peminjaman.pembayaran.jumlah_bayar)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Biaya Layanan:</span>
                          <span className="text-sm font-medium">
                            {formatRupiah(peminjaman.pembayaran.biaya_midtrans)}
                          </span>
                        </div>
                        
                        {peminjaman.pembayaran.status_pembayaran === STATUS.STATUS_TRANSAKSI.REFUNDED && 
                         peminjaman.pembayaran.refund && (
                          <div className="flex justify-between items-center text-blue-600">
                            <span className="text-sm">Jumlah Refund:</span>
                            <span className="text-sm font-medium">
                              -{formatRupiah(peminjaman.pembayaran.refund.jumlah_refund)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total:</span>
                        <span className="text-green-600 text-lg font-semibold">
                          {formatRupiah(peminjaman.pembayaran.total_bayar)}
                        </span>
                      </div>
                      
                      {peminjaman.pembayaran.status_pembayaran === STATUS.STATUS_TRANSAKSI.PENDING && (
                        <div className="mt-4">
                          <a 
                            href={peminjaman.pembayaran.url_pembayaran} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 bg-main-green text-white py-2 px-4 rounded-md text-sm hover:bg-main-green/90 transition-colors"
                          >
                            <DollarSign className="h-4 w-4" />
                            Lanjutkan Pembayaran
                          </a>
                        </div>
                      )}
                      
                      {peminjaman.pembayaran.status_pembayaran === STATUS.STATUS_TRANSAKSI.REFUNDED && 
                       peminjaman.pembayaran.refund && (
                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-3">
                          <div className="text-sm font-medium text-blue-700 mb-1">Informasi Refund</div>
                          <div className="text-xs text-blue-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Tanggal Refund:</span>
                              <span>
                                {formatDate(peminjaman.pembayaran.refund.tanggal_refund)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status Refund:</span>
                              <span>{peminjaman.pembayaran.refund.status_redund}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Alasan:</span>
                              <span className="text-right max-w-[180px]">
                                {peminjaman.pembayaran.refund.alasan_refund}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 py-4 text-center">
                      Belum ada informasi pembayaran
                    </div>
                  )}
                </div>
                
                {peminjaman.surat_pengajuan && (
                  <div className="mt-4 p-4 border border-gray-100 rounded-lg">
                    <h4 className="text-sm font-medium flex items-center gap-1 text-gray-700 mb-2">
                      <FileText className="h-4 w-4" /> Dokumen
                    </h4>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/dokumen/${peminjaman.surat_pengajuan}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors w-fit"
                    >
                      <FileText className="h-3.5 w-3.5" /> Lihat Surat Pengajuan
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-wrap gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-200"
            >
              Tutup
            </Button>
            
            {peminjaman.pembayaran && peminjaman.pembayaran.status_pembayaran === STATUS.STATUS_TRANSAKSI.PAID && (
              <>
                <Button
                  variant="outline"
                  onClick={handleProcessRefund}
                  className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 15V14H8V15L4 11L8 7V8H16V7L20 11L16 15Z" fill="currentColor"/>
                  </svg>
                  Proses Refund
                </Button>
                
                <Button
                  variant="default"
                  onClick={handlePrintInvoice}
                  className="bg-main-green hover:bg-main-green/90 gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Invoice
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransaksiDetailModal;