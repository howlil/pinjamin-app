import React, { useEffect, useState, useCallback } from "react";
import { PeminjamanService } from "@/apis/peminjaman";
import { Peminjaman } from "@/apis/interfaces/IPeminjaman";
import { STATUS } from "@/apis/interfaces/IEnum";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/costum/input/search-input";
import { formatDate, formatTime } from "@/utils/format-date";
import PeminjamanDetailModal from "./components/peminjaman-detail-modal";
import ActionMenu from "./components/action-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Define a type for our data interface with pagination
interface PaginatedData {
  data: Peminjaman[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const KelolaPeminjaman: React.FC = () => {
  // State for storing the peminjaman data with pagination
  const [paginatedData, setPaginatedData] = useState<PaginatedData>({
    data: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // State for loading, search, and modal
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Pagination config
  const itemsPerPage = 10;

  // Optimized fetch data function with useCallback to prevent unnecessary recreations
  const fetchData = useCallback(async (page: number = 1, search: string = "") => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Get all peminjaman data - in a real implementation, this would ideally
      // be filtered on the server side with proper pagination parameters
      const allData = await PeminjamanService.getAllPeminjaman();
      
      // Filter for DIPROSES status only (applications that are pending review)
      let filteredData = allData.filter(
        (peminjaman) => 
          peminjaman.status_peminjaman === STATUS.STATUS_PEMINJAMAN.DIPROSES
      );
      
      // Apply search filter if provided
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (peminjaman) => 
            peminjaman.nama_kegiatan?.toLowerCase().includes(searchLower) ||
            peminjaman.gedung?.nama_gedung?.toLowerCase().includes(searchLower) ||
            peminjaman.pengguna?.nama_lengkap?.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by date (newest first)
      filteredData.sort((a, b) => 
        new Date(b.tanggal_mulai).getTime() - new Date(a.tanggal_mulai).getTime()
      );
      
      // Calculate pagination
      const totalItems = filteredData.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
      const safeCurrentPage = page > totalPages ? 1 : page; // Reset to page 1 if current page exceeds total
      const startIndex = (safeCurrentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = filteredData.slice(startIndex, endIndex);
      
      setPaginatedData({
        data: paginatedItems,
        currentPage: safeCurrentPage,
        totalPages,
        totalItems
      });
    } catch (error) {
      console.error("Error fetching peminjaman data:", error);
      setIsError(true);
      toast.error("Gagal memuat data ajuan peminjaman");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input with debounce
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    fetchData(1, value);
  }, [fetchData]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    fetchData(page, searchQuery);
  }, [fetchData, searchQuery]);

  // View detail
  const handleViewDetail = useCallback((peminjaman: Peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setShowDetailModal(true);
  }, []);

  // Handle peminjaman approval or rejection with optimistic UI updates
  const handleApproval = useCallback(async (id: string, isApproved: boolean, reason?: string) => {
    setProcessingId(id);
    
    try {
      // Optimistic UI update
      setPaginatedData(prev => ({
        ...prev,
        data: prev.data.map(item => 
          item.id === id ? {
            ...item,
            status_peminjaman: isApproved ? 
              STATUS.STATUS_PEMINJAMAN.DISETUJUI : 
              STATUS.STATUS_PEMINJAMAN.DITOLAK,
            alasan_penolakan: !isApproved ? reason : undefined
          } : item
        )
      }));
      
      // Actual API call
      await PeminjamanService.approvePeminjaman(id, {
        status_peminjaman: isApproved ? STATUS.STATUS_PEMINJAMAN.DISETUJUI : STATUS.STATUS_PEMINJAMAN.DITOLAK,
        alasan_penolakan: !isApproved ? reason : undefined
      });
      
      // Show success toast
      toast.success(`Peminjaman berhasil ${isApproved ? 'disetujui' : 'ditolak'}`);
      
      // Refresh data after a short delay to allow the user to see the change
      setTimeout(() => {
        fetchData(paginatedData.currentPage, searchQuery);
      }, 500);
      
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error updating peminjaman status:", error);
      toast.error(`Gagal ${isApproved ? 'menyetujui' : 'menolak'} peminjaman`);
      
      // Revert optimistic update on error
      fetchData(paginatedData.currentPage, searchQuery);
    } finally {
      setProcessingId(null);
    }
  }, [fetchData, paginatedData.currentPage, searchQuery]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate pagination buttons
  const renderPaginationButtons = useCallback(() => {
    const { currentPage, totalPages } = paginatedData;
    const buttons = [];

    // Always include first page
    buttons.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      buttons.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages as they're handled separately
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      buttons.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always include last page unless it's the same as first page
    if (totalPages > 1) {
      buttons.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return buttons;
  }, [paginatedData, handlePageChange]);

  return (
    <div className="space-y-6">
      <Card className="shadow-none border-gray-100">
        <CardHeader className="bg-gray-50/50 px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900 text-base font-medium">Daftar Ajuan Peminjaman</CardTitle>
            {isError && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => fetchData(paginatedData.currentPage, searchQuery)}
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Muat Ulang
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="mb-4 p-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center">
            <SearchInput 
              placeholder="Cari nama kegiatan atau peminjam..." 
              onSearch={handleSearch}
              className="w-full md:w-64"
              debounceTime={400}
            />
            <div className="px-3 py-1.5 bg-main-green/10 text-main-green text-xs font-medium rounded-full">
              Total: {paginatedData.totalItems} ajuan menunggu persetujuan
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-4 bg-gray-50/50 rounded-lg">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16 px-6 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-3" />
              <h3 className="text-lg font-medium text-red-800 mb-1">Gagal Memuat Data</h3>
              <p className="text-sm text-red-600 mb-4">Terjadi kesalahan saat memuat data ajuan peminjaman.</p>
              <Button 
                variant="outline" 
                onClick={() => fetchData(paginatedData.currentPage, searchQuery)}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Coba Lagi
              </Button>
            </div>
          ) : paginatedData.data.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600 mb-1">Tidak Ada Ajuan</h3>
              <p className="text-sm text-gray-500">
                Tidak ada ajuan peminjaman yang menunggu persetujuan saat ini.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-medium">Nama Kegiatan</TableHead>
                    <TableHead className="font-medium">Gedung</TableHead>
                    <TableHead className="font-medium">Tanggal</TableHead>
                    <TableHead className="font-medium">Waktu</TableHead>
                    <TableHead className="font-medium">Peminjam</TableHead>
                    <TableHead className="font-medium text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.data.map((peminjaman) => (
                    <TableRow 
                      key={peminjaman.id}
                      className="hover:bg-gray-50/50 transition-colors border-t border-gray-100"
                    >
                      <TableCell className="font-medium text-gray-900">{peminjaman.nama_kegiatan}</TableCell>
                      <TableCell>{peminjaman.gedung?.nama_gedung || 'N/A'}</TableCell>
                      <TableCell>
                        {formatDate(peminjaman.tanggal_mulai)}
                        {peminjaman.tanggal_mulai !== peminjaman.tanggal_selesai && 
                          ` - ${formatDate(peminjaman.tanggal_selesai)}`}
                      </TableCell>
                      <TableCell>{formatTime(peminjaman.jam_mulai)} - {formatTime(peminjaman.jam_selesai)}</TableCell>
                      <TableCell>{peminjaman.pengguna?.nama_lengkap || 'N/A'}</TableCell>
                      <TableCell className="text-right relative">
                        <div className="flex justify-end">
                          {processingId === peminjaman.id ? (
                            <div className="w-8 h-8 flex items-center justify-center">
                              <svg 
                                className="animate-spin h-4 w-4 text-gray-500" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <circle 
                                  className="opacity-25" 
                                  cx="12" 
                                  cy="12" 
                                  r="10" 
                                  stroke="currentColor" 
                                  strokeWidth="4"
                                ></circle>
                                <path 
                                  className="opacity-75" 
                                  fill="currentColor" 
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          ) : (
                            <ActionMenu 
                              peminjaman={peminjaman} 
                              onViewDetail={handleViewDetail}
                              onApprove={handleApproval}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && !isError && paginatedData.totalPages > 1 && (
            <div className="mt-4 flex justify-center py-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, paginatedData.currentPage - 1))}
                      aria-disabled={paginatedData.currentPage === 1}
                      className={paginatedData.currentPage === 1 
                        ? "pointer-events-none opacity-50" 
                        : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationButtons()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(paginatedData.totalPages, paginatedData.currentPage + 1))}
                      aria-disabled={paginatedData.currentPage === paginatedData.totalPages}
                      className={paginatedData.currentPage === paginatedData.totalPages 
                        ? "pointer-events-none opacity-50" 
                        : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPeminjaman && (
        <PeminjamanDetailModal 
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          peminjaman={selectedPeminjaman}
          onApprove={(id) => handleApproval(id, true)}
          onReject={(id, reason) => handleApproval(id, false, reason)}
        />
      )}
    </div>
  );
};

export default KelolaPeminjaman;