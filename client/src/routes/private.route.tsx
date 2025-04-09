import { RouteObject } from "react-router-dom";
import DashboardPage from "@/pages/admin/dashboard";
import ProtectedRoute from "@/components/ui/costum/protect-route";

export const PrivateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
];