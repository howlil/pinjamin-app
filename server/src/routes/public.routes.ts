import { Router } from "express";
import { APP_CONFIG } from "../configs/app.config";
import { PenggunaController} from '../controllers/pengguna.controller';
import { GedungController } from '../controllers/gedung.controller';


const publicRoute = Router();
const penggunaController = new PenggunaController();
const gedungController = new GedungController();


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


publicRoute.post('/api/v1/register', penggunaController.register);
publicRoute.post('/api/v1/login', penggunaController.login);


//gedung
publicRoute.get('/api/v1/gedung', gedungController.getAllGedung);
publicRoute.get('/api/v1/gedung/available', gedungController.getAvailableGedung);
publicRoute.get('/api/v1/gedung/availability', gedungController.checkGedungAvailability);
publicRoute.get('/api/v1/gedung/:id', gedungController.getGedungById);



export default publicRoute;
