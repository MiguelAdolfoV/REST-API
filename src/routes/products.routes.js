import { Router } from "express";
const router = Router();

import * as productCTRL from '../controllers/products.controller';
import { authJwt } from "../middlewares/index";

router.get('/',productCTRL.getProducts);
router.get('/:producID', productCTRL.getProductsbyid);

//Rutas protegida solo para administrador
router.post('/',[authJwt.verifyToken,authJwt.isAdmin],productCTRL.createProduct);

//Rutas protegidas para administrador y moderador
router.put('/:productId',[authJwt.verifyToken,authJwt.isModandAd], authJwt.verifyToken, productCTRL.updateProduct);
router.delete('/:productId',[authJwt.verifyToken,authJwt.isModandAd],authJwt.verifyToken, productCTRL.deleteProduct);

export default router;
