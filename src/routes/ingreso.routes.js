import { Router } from "express";

const router = Router();
//controller
import * as ingresoCtrl from '../controllers/ingreso.controller.js';
//middlewares
import { authJwt } from "../middlewares/index.js";

// Establecer rutas para ingreso
router.get('/', [authJwt.verifyToken, authJwt.isCustomer], ingresoCtrl.getIngreso);
router.post('/metas', [authJwt.verifyToken, authJwt.isCustomer], ingresoCtrl.createMeta);
router.get('/metas', [authJwt.verifyToken, authJwt.isCustomer], ingresoCtrl.getMetas);
router.post('/', [authJwt.verifyToken, authJwt.isCustomer], ingresoCtrl.createIngreso);
router.post('/consejo', [authJwt.verifyToken, authJwt.isCustomer], ingresoCtrl.getConsejo);
router.get('/:ingresoId', [authJwt.verifyToken, authJwt.isCustomer], ingresoCtrl.getIngresoById);
router.put('/:ingresoId', [authJwt.verifyToken, authJwt.isAdmin], ingresoCtrl.updateIngreso);
router.delete('/:ingresoId', [authJwt.verifyToken, authJwt.isAdmin], ingresoCtrl.deleteIngreso);

export default router;
