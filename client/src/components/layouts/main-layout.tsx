// src/layouts/main-layout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/navigation/sidebar";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};