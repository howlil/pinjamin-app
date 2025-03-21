import { BaseRouter } from "../base.route";
import authMiddleware from "../../middlewares/auth.middleware";
import notifikasiController from "../../controllers/notifikasi.controller";

class NotifikasiRouter extends BaseRouter {
    public routes():void{
        this.router.get("/v1/notif",authMiddleware.authenticate,authMiddleware.authorizePeminjam, notifikasiController.getUserNotifikasi)
        this.router.get("/v1/notif/unread/count",authMiddleware.authenticate,authMiddleware.authorizePeminjam, notifikasiController.getUnreadCount)
        this.router.patch("/v1/notif/:id/read",authMiddleware.authenticate,authMiddleware.authorizePeminjam, notifikasiController.markAsRead)
        this.router.patch("/v1/notif/read",authMiddleware.authenticate,authMiddleware.authorizePeminjam, notifikasiController.markAllAsRead)
    }
}

export default new NotifikasiRouter().router