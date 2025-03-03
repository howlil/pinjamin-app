import { Router } from "express";
import { APP_CONFIG } from "../configs/app"; 

const publicRoute = Router();

publicRoute.get("/", (req, res) => {
  res.json({
    status: "success",
    message: `${APP_CONFIG.APP_NAME} API is running`,
    version: APP_CONFIG.APP_VERSION,
  });
});

publicRoute.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route tidak ditemukan",
  });
});

export default publicRoute;
