import { RouteObject } from "react-router-dom";
import AuthPage from "@/pages/auth/AuthPage";
import BerandaPage from "@/pages/beranda/BerandaPage";

export const PublicRoutes: RouteObject[] = [
  {
    path: "/masuk",
    element: <AuthPage />,
  },
  {
    path: "/daftar",
    element: <AuthPage />,
  },
  {
    path:"/",
    element:<BerandaPage/>
  }
];
