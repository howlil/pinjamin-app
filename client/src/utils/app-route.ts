import { useRoutes } from "react-router-dom";
import { routes } from "@/routes";

export const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};
