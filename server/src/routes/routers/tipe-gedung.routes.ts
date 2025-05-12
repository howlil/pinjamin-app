// server/src/routes/routers/tipe-gedung.routes.ts
import { BaseRouter } from "../base.route";
import tipeGedungController from "../../controllers/tipe-gedung.controller";
import authMiddleware from "../../middlewares/auth.middleware";

class TipeGedungRouter extends BaseRouter {
  public routes(): void {
    this.router.get("/v1/tipe-gedung", tipeGedungController.index);
    this.router.get("/v1/tipe-gedung/:id", tipeGedungController.show);

    this.router.post(
      "/v1/tipe-gedung",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      tipeGedungController.create
    );
    
    this.router.patch(
      "/v1/tipe-gedung/:id",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      tipeGedungController.update
    );
    
    this.router.delete(
      "/v1/tipe-gedung/:id",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      tipeGedungController.delete
    );
  }
}

export default new TipeGedungRouter().router;