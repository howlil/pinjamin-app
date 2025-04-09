import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/contexts/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "ADMIN" | "PEMINJAM";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const pengguna = useAuthStore((state) => state.pengguna);
  const location = useLocation();

  const isAuthenticated = !!token;
  
  const hasRequiredRole = requiredRole 
    ? pengguna?.role === requiredRole
    : true;
  
  if (!isAuthenticated) {
    return <Navigate to="/masuk" state={{ from: location.pathname }} replace />;
  }
  
  if (isAuthenticated && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;