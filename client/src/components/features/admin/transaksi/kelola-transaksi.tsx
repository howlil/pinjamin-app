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
import { formatDate } from "@/utils/format-date";
import TransaksiDetailModal from "./components/transaksi-detail-modal";
import ActionMenu from "./components/action-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FilterInput } from "@/components/ui/costum/input/filter-input";

// Define a type for our data interface with pagination
interface PaginatedData {
  data: Peminjaman[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const KelolaTransaksi: React.FC = () => {
  // State for storing the peminjaman data with pagination
  const [paginatedData, setPaginatedData] = useState<PaginatedData>({
    data: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // State for loading, search, filter, and modal
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Pagination config
  const itemsPerPage = 10;

  // Filter options for payment status
  const filterOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "PAID", label: "Lunas" },
    { value: "PENDING", label: "Menunggu Pembayaran" },
    { value: "CANCELED", label: "Dibatalkan" },
    { value: "REFUNDED", label: "Dikembalikan" }
  ];

  // Format Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge class
  const getStatusBadgeClass = useCallback((status: string) => {
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
  }, []);

  // Get status label
  const getStatusLabel = useCallback((status: string) => {
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
  }, []);

  // Optimized fetch data function with useCallback to prevent unnecessary recreations
  const fetchData = useCallback(async (page: number = 1, search: string = "", status: string = "ALL") => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Get all peminjaman data with payment information
      const allData = await PeminjamanService.getAllPeminjaman();
      
      // Filter for peminjaman that have payment information
      let filteredData = allData.filter(
        (peminjaman) => peminjaman.pembayaran != null
      );
      
      // Apply status filter if not ALL
      if (status !== "ALL") {
        filteredData = filteredData.filter(
          (peminjaman) => 
            peminjaman.pembayaran?.status_pembayaran === status
        );
      }
      
      // Apply search filter if provided
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (peminjaman) => 
            peminjaman.nama_kegiatan?.toLowerCase().includes(searchLower) ||
            peminjaman.gedung?.nama_gedung?.toLowerCase().includes(searchLower) ||
            peminjaman.pengguna?.nama_lengkap?.toLowerCase().includes(searchLower) ||
            peminjaman.pembayaran?.no_invoice?.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by date (newest first)
      filteredData.sort((a, b) => {
        const dateA = a.pembayaran?.tanggal_bayar ? new Date(a.pembayaran.tanggal_bayar).getTime() : 0;
        const dateB = b.pembayaran?.tanggal_bayar ? new Date(b.pembayaran.tanggal_bayar).getTime() : 0;
        return dateB - dateA;
      });
      
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
      console.error("Error fetching pembayaran data:", error);
      setIsError(true);
      toast.error("Gagal memuat data transaksi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input with debounce
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    fetchData(1, value, statusFilter);
  }, [fetchData, statusFilter]);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    fetchData(1, searchQuery, value);
  }, [fetchData, searchQuery]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    fetchData(page, searchQuery, statusFilter);
  }, [fetchData, searchQuery, statusFilter]);

  // View detail
  const handleViewDetail = useCallback((peminjaman: Peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setShowDetailModal(true);
  }, []);

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
            <CardTitle className="text-gray-900 text-base font-medium">Daftar Transaksi</CardTitle>
            {isError && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => fetchData(paginatedData.currentPage, searchQuery, statusFilter)}
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Muat Ulang
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <SearchInput 
                placeholder="Cari nama kegiatan atau No. Invoice..." 
                onSearch={handleSearch}
                className="w-full sm:w-64"
                debounceTime={400}
              />
              <FilterInput 
                placeholder="Filter Status" 
                options={filterOptions}
                defaultValue="ALL"
                onFilterChange={handleStatusFilterChange}
                className="w-full sm:w-48"
              />
            </div>
            <div className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              Total: {paginatedData.totalItems} transaksi
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
              <p className="text-sm text-red-600 mb-4">Terjadi kesalahan saat memuat data transaksi.</p>
              <Button 
                variant="outline" 
                onClick={() => fetchData(paginatedData.currentPage, searchQuery, statusFilter)}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Coba Lagi
              </Button>
            </div>
          ) : paginatedData.data.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600 mb-1">Tidak Ada Data</h3>
              <p className="text-sm text-gray-500">
                Tidak ada transaksi yang ditemukan dengan filter yang dipilih.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border-t overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-medium">No. Invoice</TableHead>
                    <TableHead className="font-medium">Tanggal</TableHead>
                    <TableHead className="font-medium">Kegiatan</TableHead>
                    <TableHead className="font-medium">Total</TableHead>
                    <TableHead className="font-medium">Metode</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.data.map((peminjaman) => (
                    <TableRow 
                      key={peminjaman.id}
                      className="hover:bg-gray-50/50 transition-colors border-t border-gray-100"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {peminjaman.pembayaran?.no_invoice || "-"}
                      </TableCell>
                      <TableCell>
                        {peminjaman.pembayaran?.tanggal_bayar 
                          ? formatDate(peminjaman.pembayaran.tanggal_bayar) 
                          : "-"}
                      </TableCell>
                      <TableCell>{peminjaman.nama_kegiatan}</TableCell>
                      <TableCell className="font-medium">
                        {peminjaman.pembayaran 
                          ? formatRupiah(peminjaman.pembayaran.total_bayar) 
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {peminjaman.pembayaran?.metode_pembayaran || "-"}
                      </TableCell>
                      <TableCell>
                        {peminjaman.pembayaran && (
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(peminjaman.pembayaran.status_pembayaran)}`}>
                            {getStatusLabel(peminjaman.pembayaran.status_pembayaran)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right relative">
                        <div className="flex justify-end">
                          <ActionMenu 
                            peminjaman={peminjaman} 
                            onViewDetail={handleViewDetail}
                            mode="transaction"
                          />
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
        <TransaksiDetailModal 
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          peminjaman={selectedPeminjaman}
        />
      )}
    </div>
  );
};

export default KelolaTransaksi;