import { Router } from "express";

const router = Router();
//controller
import * as ingresoCtrl from '../controllers/ingreso.controller.js';
//middlewares
import { authJwt } from "../middlewares/index.js";


//establecer rutas para ingreso
router.get('/',[authJwt.verifyToken, authJwt.isCustomer], authJwt.verifyToken,ingresoCtrl.getIngreso);
router.get('/:ingresoId', [authJwt.verifyToken, authJwt.isCustomer],ingresoCtrl.getIngresoById);
router.post('/',[authJwt.verifyToken, authJwt.isCustomer], ingresoCtrl.createIngreso);
router.put('/:ingresoId', [authJwt.verifyToken, authJwt.isAdmin],ingresoCtrl.updateIngreso);
router.delete('/:ingresoId',[authJwt.verifyToken, authJwt.isAdmin], ingresoCtrl.deleteIngreso);

export default router;