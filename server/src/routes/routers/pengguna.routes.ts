import { BaseRouter } from "../base.route";
import penggunaController from "../../controllers/pengguna.controller";
import authMiddleware from "../../middlewares/auth.middleware";

class PenggunaRouter extends BaseRouter {
  public routes(): void {
    this.router.post("/v1/register", penggunaController.create);
    this.router.post("/v1/login", penggunaController.login);

    this.router.get("/v1/profile",authMiddleware.authenticate, penggunaController.show);
    this.router.patch("/v1/profile", authMiddleware.authenticate, penggunaController.update);
    this.router.post("/v1/logout", authMiddleware.authenticate, penggunaController.logout);
        
  }
}

export default new PenggunaRouter().router;
