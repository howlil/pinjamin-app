// src/pages/peminjaman/peminjaman-page.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const PeminjamanPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data dummy untuk tabel peminjaman
  const peminjamanData = [
    {
      id: 1,
      namaKegiatan: "Seminar Kewirausahaan",
      peminjam: "BEM Fakultas Ekonomi",
      namaGedung: "Gedung Serba Guna",
      waktu: "15 Mei 2024, 09:00 - 12:00",
      status: "pending",
    },
    {
      id: 2,
      namaKegiatan: "Workshop Desain Grafis",
      peminjam: "Himpunan Mahasiswa Desain",
      namaGedung: "Gedung Kreatif",
      waktu: "18 Mei 2024, 13:00 - 16:00",
      status: "approved",
    },
    {
      id: 3,
      namaKegiatan: "Pelatihan Public Speaking",
      peminjam: "UKM Bahasa",
      namaGedung: "Gedung Auditorium",
      waktu: "20 Mei 2024, 10:00 - 15:00",
      status: "rejected",
    },
  ];

  // Filter data berdasarkan status dan pencarian
  const filteredData = peminjamanData.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = item.namaKegiatan
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      item.peminjam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaGedung.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ajuan Peminjaman</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Cari peminjaman..."
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Filter Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Semua
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Menunggu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                Disetujui
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                Ditolak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Kegiatan</TableHead>
              <TableHead>Peminjam</TableHead>
              <TableHead>Nama Gedung</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.namaKegiatan}</TableCell>
                <TableCell>{item.peminjam}</TableCell>
                <TableCell>{item.namaGedung}</TableCell>
                <TableCell>{item.waktu}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Detail</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PeminjamanPage;