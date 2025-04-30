import penggunaRoutes from "./routers/pengguna.routes";
import gedungRoutes from "./routers/gedung.routes";
import peminjamanRoutes from "./routers/peminjaman.routes";
import pembayaranRoutes from "./routers/pembayaran.routes";
import notifikasiRoutes from "./routers/notifikasi.routes";
import fasilitasRoutes from "./routers/fasilitas.routes";
import { BaseRouter } from "./base.route";

class AppRouter extends BaseRouter {
  public routes(): void {
    this.router.use(penggunaRoutes);
    this.router.use(gedungRoutes);
    this.router.use(peminjamanRoutes);
    this.router.use(notifikasiRoutes);
    this.router.use(pembayaranRoutes);
    this.router.use(fasilitasRoutes)
  }
}

export default new AppRouter().router;
