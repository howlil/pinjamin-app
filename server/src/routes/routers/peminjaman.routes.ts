import { BaseRouter } from "../base.route";
import peminjamanController from "../../controllers/peminjaman.controller";
import authMiddleware from "../../middlewares/auth.middleware";

class PeminjamanRouter extends BaseRouter {
  public routes(): void {
    this.router.get("/v1/peminjaman/user", authMiddleware.authenticate,authMiddleware.authorizePeminjam,peminjamanController.getByUser)
    this.router.post("/v1/peminjaman", authMiddleware.authenticate,authMiddleware.authorizePeminjam, peminjamanController.create)
    this.router.get("/v1/peminjaman/:id", authMiddleware.authenticate,peminjamanController.show)

    this.router.get("/v1/peminjaman", authMiddleware.authenticate,authMiddleware.authorizeAdmin,peminjamanController.index)
    this.router.patch("/v1/peminjaman", authMiddleware.authenticate,authMiddleware.authorizeAdmin,peminjamanController.update)
    this.router.delete("/v1/peminjaman", authMiddleware.authenticate,authMiddleware.authorizeAdmin,peminjamanController.delete)
    this.router.patch("/v1/peminjaman/:id/approval", authMiddleware.authenticate,authMiddleware.authorizeAdmin,peminjamanController.approve)
    this.router.get("/v1/peminjaman/statistik", authMiddleware.authenticate,authMiddleware.authorizeAdmin,peminjamanController.getStatistics)
  }
}

export default new PeminjamanRouter().router
