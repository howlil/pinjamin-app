import { Router } from "express";
import { PenggunaController } from "../controllers/pengguna.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { GedungController } from "../controllers/gedung.controller";

const privateRoute = Router();
const penggunaController = new PenggunaController();
const gedungController = new GedungController();


// auth
privateRoute.get("/api/v1/profile",AuthMiddleware.authenticate,penggunaController.getProfile);
privateRoute.patch("/api/v1/profile",  AuthMiddleware.authenticate,penggunaController.updateProfile);
privateRoute.post("/api/v1/logout", AuthMiddleware.authenticate,  penggunaController.logout);


// gedung
privateRoute.post( "/api/v1/gedung",AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin,gedungController.createGedung);
privateRoute.patch("/api/v1/gedung/:id", AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin, gedungController.updateGedung);
privateRoute.delete(  "/api/v1/gedung/:id",  AuthMiddleware.authenticate,  AuthMiddleware.authorizeAdmin,  gedungController.deleteGedung);


export default privateRoute;
