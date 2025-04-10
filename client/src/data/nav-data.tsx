
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart4,
  Clock,
} from "lucide-react";

export const dataNav = [
  {
    label: "Beranda",
    route: "/",
    auth: false,
  },
  {
    label: "Jadwal",
    route: "/jadwal",
    auth: false,
  },
  {
    label: "Riwayat",
    route: "/riwayat",
    auth: true,
  },
  {
    label: "Transaksi",
    route: "/transaksi",
    auth: true,
  },
];


export  const navItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    title: "Gedung",
    icon: <Building2 className="h-5 w-5" />,
    href: "/kelola-gedung",
  },
  {
    title: "Peminjaman",
    icon: <Users className="h-5 w-5" />,
    href: "/ajuan-peminjaman",
  },
  {
    title: "Transaksi",
    icon: <BarChart4 className="h-5 w-5" />,
    href: "/admin/transaksi",
  },
  {
    title: "Riwayat",
    icon: <Clock className="h-5 w-5" />,
    href: "/admin/riwayat",
  },
];