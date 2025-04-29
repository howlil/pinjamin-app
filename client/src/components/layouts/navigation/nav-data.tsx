
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart4,
  Clock,
  DoorOpen
} from "lucide-react";
import { ActionButton } from "@/components/ui/costum/user-pop-up";
import { STATUS } from "@/apis/interfaces/IEnum";


export const publicData = [
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


export  const adminData = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/admin/dashboard",
  },
  {
    title: "Gedung",
    icon: <Building2 className="h-5 w-5" />,
    href: "/admin/kelola-gedung",
  },
  {
    title: "Peminjaman",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/ajuan-peminjaman",
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

export const userActions: ActionButton[] = [
  {
    judul: "Ubah Profil",
    icon: Users,
    action: () => window.location.href= "/profile",
    showOn: "ALL" 
  },
  {
    judul: "Dashboard",
    icon: LayoutDashboard,
    action: () => window.location.href= "/admin/dashboard",
    showOn: typeof STATUS.ROLE.ADMIN, 
    hideOnRoutes: ["/admin/dashboard"]
  },
  {
    judul: "Transaksi",
    icon: BarChart4,
    action: () => window.location.href= "/admin/books",
    showOn: typeof STATUS.ROLE.ADMIN,
    showOnRoutes: ["/admin"] 
  },
  {
    judul: "Logout",
    icon: DoorOpen,
    action: () => {
     window.location.href= "/masuk";
    },
    showOn: "ALL" 
  }
];