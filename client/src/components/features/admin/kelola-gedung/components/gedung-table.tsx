import { FC } from "react";
import { Gedung } from "@/apis/interfaces/IGedung";
import { TipeGedung } from "@/apis/interfaces/ITipeGedung";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreVertical, Eye, Pencil, Trash2, MapPin, Users, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface GedungTableProps {
  buildings: Gedung[];
  buildingTypes: TipeGedung[];
  onEdit: (building: Gedung) => void;
  onDelete: (building: Gedung) => void;
  onView: (building: Gedung) => void;
  searchQuery: string;
}

/**
 * GedungTable - Optimized table display for buildings with improved UI
 */
const GedungTable: FC<GedungTableProps> = ({
  buildings,
  buildingTypes,
  onEdit,
  onDelete,
  onView,
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

  // Get building type name by ID
  const getBuildingTypeName = (typeId: string): string => {
    const type = buildingTypes.find(t => t.id === typeId);
    return type?.nama_tipe_gedung || "Tidak Diketahui";
  };

  // Animation variants for table rows
  const rowVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
          <TableRow>
            <TableHead className="font-semibold">Nama Gedung</TableHead>
            <TableHead className="font-semibold">Tipe</TableHead>
            <TableHead className="font-semibold">Lokasi</TableHead>
            <TableHead className="text-right font-semibold">Kapasitas</TableHead>
            <TableHead className="text-right font-semibold">Harga Sewa</TableHead>
            <TableHead className="text-center font-semibold w-20">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <Search className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-lg text-gray-500 font-medium">Tidak ada data gedung</p>
                  {searchQuery && (
                    <p className="mt-2 text-sm text-gray-400">
                      Tidak ada hasil untuk "{searchQuery}"
                    </p>
                  )}
                </motion.div>
              </TableCell>
            </TableRow>
          ) : (
            buildings.map((building, index) => (
              <motion.tr
                key={building.id}
                variants={rowVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{building.nama_gedung}</p>
                    {building.foto_gedung && (
                      <span className="text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Foto tersedia
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    <Building2 className="h-3 w-3 mr-1" />
                    {getBuildingTypeName(building.tipe_gedung_id || "")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="max-w-[200px] truncate">
                      {building.lokasi || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end text-gray-600">
                    <Users className="h-3 w-3 mr-1 text-gray-400" />
                    <span>{building.kapasitas || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium text-emerald-600">
                    {formatRupiah(building.harga_sewa)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem 
                        className="cursor-pointer group"
                        onClick={() => onView(building)}
                      >
                        <Eye className="h-4 w-4 mr-2 text-gray-500 group-hover:text-blue-600" />
                        <span>Lihat Detail</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer group"
                        onClick={() => onEdit(building)}
                      >
                        <Pencil className="h-4 w-4 mr-2 text-gray-500 group-hover:text-amber-600" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600 group"
                        onClick={() => onDelete(building)}
                      >
                        <Trash2 className="h-4 w-4 mr-2 group-hover:text-red-700" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GedungTable;