import { BaseRouter } from "../base.route";
import gedungController from "../../controllers/gedung.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import uploadMiddleware from "../../middlewares/upload.middleware";

class GedungRouter extends BaseRouter {
  public routes(): void {
    this.router.get("/v1/gedung", gedungController.index);
    this.router.get("/v1/gedung/:id", gedungController.show);
    this.router.post("/v1/gedung/check-availability", gedungController.checkGedungAvailability);

    // private 
     this.router.post("/v1/gedung",authMiddleware.authenticate,authMiddleware.authorizeAdmin,uploadMiddleware.uploadSingle('foto_gedung'),gedungController.create);
     this.router.patch("/v1/gedung/:id",authMiddleware.authenticate,authMiddleware.authorizeAdmin,uploadMiddleware.uploadSingle('foto_gedung'),gedungController.update);
     this.router.delete("/v1/gedung/:id",authMiddleware.authenticate,authMiddleware.authorizeAdmin,gedungController.delete);
        
  }
}

export default new GedungRouter().router;
