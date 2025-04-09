import {  RouteObject } from "react-router-dom";
import { PublicRoutes } from "./public.route";
import { PrivateRoutes } from "./private.route";



export const routes: RouteObject[] = [
  ...PublicRoutes,
  ...PrivateRoutes
];