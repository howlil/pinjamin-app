import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));

export const PublicRoutes: RouteObject[] = [
  {
    path: "/masuk",
    element: <AuthPage />,
  },
  {
    path: "/daftar",
    element: <AuthPage />,
  },
];
