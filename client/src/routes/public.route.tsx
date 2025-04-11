import { RouteObject } from "react-router-dom";
import AuthPage from "@/pages/public/auth";
import BerandaPage from "@/pages/public/beranda";
import GedungPage from "@/pages/public/gedung";
import JadwalPage from "@/pages/public/jadwal";



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
  },
  {
    path:"/jadwal",
    element:<JadwalPage/>
  },
  {
    path:"/gedung/:id",
    element:<GedungPage/>
  }
];
