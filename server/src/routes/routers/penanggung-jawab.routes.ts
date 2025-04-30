import { BaseRouter } from "../base.route";
import penanggungJawabGedungController from "../../controllers/penanggung-jawab.controller";
import authMiddleware from "../../middlewares/auth.middleware";

class PenanggungJawabGedungRouter extends BaseRouter {
  public routes(): void {
    this.router.get("/v1/penanggung-jawab", penanggungJawabGedungController.index);

    this.router.post(
      "/v1/penanggung-jawab",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      penanggungJawabGedungController.create
    );
    
    this.router.patch(
      "/v1/penanggung-jawab/:id",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      penanggungJawabGedungController.update
    );
    
    this.router.delete(
      "/v1/penanggung-jawab/:id",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      penanggungJawabGedungController.delete
    );
  }
}

export default new PenanggungJawabGedungRouter().router;