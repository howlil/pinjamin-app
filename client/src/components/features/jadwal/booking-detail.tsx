// // src/components/features/jadwal/booking-detail.tsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import { X, Clock, MapPin, User, File, Tag } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Peminjaman } from '@/apis/interfaces/IPeminjaman';
// import { STATUS } from '@/apis/interfaces/IEnum';

// interface BookingDetailProps {
//   booking: Peminjaman;
//   isOpen: boolean;
//   onClose: () => void;
// }

// /**
//  * Component for displaying detailed information about a booking
//  */
// const BookingDetail: React.FC<BookingDetailProps> = ({ booking, isOpen, onClose }) => {
//   if (!isOpen || !booking) return null;

//   /**
//    * Format a date string to a human-readable format
//    */
//   const formatDate = (dateStr: string): string => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('id-ID', {
//       weekday: 'long',
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   /**
//    * Get the appropriate CSS class for a booking status
//    */
//   const getStatusClass = (status: typeof STATUS.STATUS_PEMINJAMAN): string => {
//     if (status === STATUS.STATUS_PEMINJAMAN.DISETUJUI) {
//       return 'bg-[#749C73] text-white';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.DITOLAK) {
//       return 'bg-red-500 text-white';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.DIPROSES) {
//       return 'bg-[#FCA129] text-white';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.SELESAI) {
//       return 'bg-gray-500 text-white';
//     }
//     return 'bg-gray-200';
//   };

//   /**
//    * Get the text for a booking status
//    */
//   const getStatusText = (status: typeof STATUS.STATUS_PEMINJAMAN): string => {
//     if (status === STATUS.STATUS_PEMINJAMAN.DISETUJUI) {
//       return 'Disetujui';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.DITOLAK) {
//       return 'Ditolak';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.DIPROSES) {
//       return 'Diproses';
//     }
//     if (status === STATUS.STATUS_PEMINJAMAN.SELESAI) {
//       return 'Selesai';
//     }
//     return 'Unknown';
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.9, y: 20 }}
//         transition={{ type: "spring", bounce: 0.25 }}
//         className="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header with status */}
//         <div className={`p-4 ${getStatusClass(booking.status_peminjaman)}`}>
//           <div className="flex justify-between items-center">
//             <span className="text-lg font-semibold">Detail Peminjaman</span>
//             <Button 
//               onClick={onClose} 
//               variant="ghost" 
//               size="icon" 
//               className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/20"
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>
//           <div className="mt-1 text-white/90 text-sm flex items-center">
//             <Tag className="h-4 w-4 mr-1" />
//             Status: {getStatusText(booking.status_peminjaman)}
//           </div>
//         </div>
        
//         {/* Content */}
//         <div className="p-4 space-y-4">
//           {/* Event name */}
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">{booking.nama_kegiatan}</h2>
//           </div>
          
//           {/* Details */}
//           <div className="space-y-3">
//             {/* Building info */}
//             {booking.gedung && (
//               <div className="flex items-start">
//                 <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <div className="font-medium">{booking.gedung.nama_gedung}</div>
//                   <div className="text-sm text-gray-500">{booking.gedung.lokasi}</div>
//                 </div>
//               </div>
//             )}
            
//             {/* Date and time */}
//             <div className="flex items-start">
//               <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <div className="font-medium">
//                   {formatDate(booking.tanggal_mulai)}
//                   {booking.tanggal_mulai !== booking.tanggal_selesai && (
//                     <> - {formatDate(booking.tanggal_selesai)}</>
//                   )}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {booking.jam_mulai} - {booking.jam_selesai}
//                 </div>
//               </div>
//             </div>
            
//             {/* Requester */}
//             {booking.pengguna && (
//               <div className="flex items-start">
//                 <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <div className="font-medium">{booking.pengguna.nama_lengkap}</div>
//                   <div className="text-sm text-gray-500">{booking.pengguna.email}</div>
//                 </div>
//               </div>
//             )}
            
//             {/* Attachment */}
//             {booking.surat_pengajuan && (
//               <div className="flex items-start">
//                 <File className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <a 
//                     href={`${import.meta.env.VITE_API_URL}/surat/${booking.surat_pengajuan}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="font-medium text-[#749C73] hover:underline"
//                   >
//                     Lihat Surat Pengajuan
//                   </a>
//                 </div>
//               </div>
//             )}
            
//             {/* Rejection reason */}
//             {booking.status_peminjaman === STATUS.STATUS_PEMINJAMAN.DITOLAK && booking.alasan_penolakan && (
//               <div className="mt-4">
//                 <div className="text-sm font-medium text-red-500 mb-1">Alasan Penolakan:</div>
//                 <div className="p-3 bg-red-50 rounded-md text-red-700 text-sm">
//                   {booking.alasan_penolakan}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Footer */}
//         <div className="p-4 bg-gray-50 flex justify-end">
//           <Button 
//             onClick={onClose}
//             variant="outline"
//           >
//             Tutup
//           </Button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default BookingDetail;