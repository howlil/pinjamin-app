import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  Eye, 
  Printer,
  FileText,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Peminjaman } from '@/apis/interfaces/IPeminjaman';
import { STATUS } from '@/apis/interfaces/IEnum';

interface ActionMenuProps {
  peminjaman: Peminjaman;
  onViewDetail: (peminjaman: Peminjaman) => void;
  onApprove?: (id: string, isApproved: boolean) => void;
  mode?: 'application' | 'history' | 'transaction';
}

/**
 * Simple three-dot menu for item actions
 */
const ActionMenu: React.FC<ActionMenuProps> = ({ 
  peminjaman, 
  onViewDetail, 
  onApprove,
  mode = 'application'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock print invoice function
  const handlePrintInvoice = () => {
    // In a real implementation, this would generate and print an invoice
    alert('Cetak invoice untuk ' + peminjaman.nama_kegiatan);
    setIsOpen(false);
  };

  // Mock process refund function
  const handleProcessRefund = () => {
    // In a real implementation, this would start the refund process
    alert('Proses pengembalian dana untuk ' + peminjaman.nama_kegiatan);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button 
        className="text-gray-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Action menu"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="action-menu-button"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => {
                onViewDetail(peminjaman);
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <Eye className="mr-2 h-4 w-4 text-gray-500" />
              <span>Detail</span>
            </button>
            
            {/* Transaction-specific options */}
            {mode === 'transaction' && peminjaman.pembayaran && (
              <>
                {peminjaman.pembayaran.status_pembayaran === STATUS.STATUS_TRANSAKSI.PENDING && (
                  <a
                    href={peminjaman.pembayaran.url_pembayaran}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Lanjutkan Pembayaran</span>
                  </a>
                )}
                
                {peminjaman.pembayaran.status_pembayaran === STATUS.STATUS_TRANSAKSI.PAID && (
                  <>
                    <button
                      onClick={handlePrintInvoice}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Printer className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Cetak Invoice</span>
                    </button>
                    
                    <button
                      onClick={handleProcessRefund}
                      className="flex w-full items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <RefreshCw className="mr-2 h-4 w-4 text-blue-600" />
                      <span>Proses Refund</span>
                    </button>
                  </>
                )}
              </>
            )}
            
            {/* History-specific options */}
            {mode === 'history' && peminjaman.pembayaran?.status_pembayaran === STATUS.STATUS_TRANSAKSI.PAID && (
              <button
                onClick={handlePrintInvoice}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <Printer className="mr-2 h-4 w-4 text-gray-500" />
                <span>Cetak Invoice</span>
              </button>
            )}
            
            {/* Document access (for all modes) */}
            {peminjaman.surat_pengajuan && (
              <a
                href={`${import.meta.env.VITE_API_URL}/dokumen/${peminjaman.surat_pengajuan}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="mr-2 h-4 w-4 text-gray-500" />
                <span>Lihat Dokumen</span>
              </a>
            )}
            
            {/* Application-specific options */}
            {mode === 'application' && onApprove && (
              <>
                <button
                  onClick={() => {
                    onApprove(peminjaman.id, true);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor"/>
                  </svg>
                  <span>Setujui</span>
                </button>
                
                <button
                  onClick={() => {
                    onViewDetail(peminjaman);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z" fill="currentColor"/>
                  </svg>
                  <span>Tolak</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;