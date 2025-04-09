// src/routes/public.route.tsx
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { MainLayout } from "@/components/layouts/main-layout";

const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const PeminjamanPage = lazy(() => import("@/pages/peminjaman/PeminjamanPage"));

export const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/peminjaman",
        element: <PeminjamanPage />,
      },
    ],
  },
  {
    path: "/masuk",
    element: <AuthPage/>,
  },
  {
    path: "/daftar",
    element: <AuthPage />,
  },
];