import { BaseRouter } from "../base.route";
import fasilitasController from "../../controllers/fasilitas.controller";
import authMiddleware from "../../middlewares/auth.middleware";

class FasilitasRouter extends BaseRouter {
  public routes(): void {
    this.router.get("/v1/fasilitas", fasilitasController.index);

    this.router.post(
      "/v1/fasilitas",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      fasilitasController.create
    );

    this.router.patch(
      "/v1/fasilitas/:id",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      fasilitasController.update
    );

    this.router.delete(
      "/v1/fasilitas/:id",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      fasilitasController.delete
    );
  }
}

export default new FasilitasRouter().router;
