import { RouteObject } from "react-router-dom";
import AuthPage from "@/pages/public/auth";
import BerandaPage from "@/pages/public/beranda";

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
