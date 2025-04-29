import { FC, useState } from "react";
import { Gedung } from "@/apis/interfaces/IGedung";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface GedungTableProps {
  buildings: Gedung[];
  loading: boolean;
  onEdit: (building: Gedung) => void;
  onDelete: (building: Gedung) => void;
  searchQuery: string;
}

/**
 * GedungTable - Displays buildings in a table with a three-dot menu for actions
 */
const GedungTable: FC<GedungTableProps> = ({
  buildings,
  loading,
  onEdit,
  onDelete,
  searchQuery,
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
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Nama Gedung</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead className="text-right">Kapasitas</TableHead>
            <TableHead className="text-right">Harga Sewa</TableHead>
            <TableHead className="text-center w-14">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-green"></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">Memuat data...</p>
              </TableCell>
            </TableRow>
          ) : buildings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <Search className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Tidak ada data gedung</p>
                  {searchQuery && (
                    <p className="mt-1 text-sm text-gray-400">
                      Tidak ada hasil untuk "{searchQuery}"
                    </p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            buildings.map((building) => (
              <TableRow key={building.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{building.nama_gedung}</TableCell>
                <TableCell>{building.tipe_gedung_id || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{building.lokasi || "-"}</TableCell>
                <TableCell className="text-right">{building.kapasitas || "-"} orang</TableCell>
                <TableCell className="text-right">{formatRupiah(building.harga_sewa)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 data-[state=open]:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => window.open(`/gedung/${building.id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Lihat Detail</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => onEdit(building)}
                      >
                        <Pencil className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => onDelete(building)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GedungTable;