import { RouteObject } from "react-router-dom";
import DashboardPage from "@/pages/admin/dashboard";
import ProtectedRoute from "@/components/ui/costum/protect-route";
import GedungPage from "@/pages/admin/kelola-gedung";
import AjuanPeminjamanPage from "@/pages/admin/kelola-ajuan-peminjaman";
import TransaksiAdminPage from "@/pages/admin/kelola-transaksi";
import RiwayatAdminPage from "@/pages/admin/riwayat";

export const PrivateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/kelola-gedung",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <GedungPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ajuan-peminjaman",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AjuanPeminjamanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/transaksi",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <TransaksiAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/riwayat",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <RiwayatAdminPage />
      </ProtectedRoute>
    ),
  },
];