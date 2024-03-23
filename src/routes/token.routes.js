import { Router } from "express";
const router = Router();

//importtar rutas de auth controller
import * as tokenCTRL from '../controllers/token.controller';

router.post('/signtoken', tokenCTRL.signToken);
router.post('/verifytoken', tokenCTRL.verify_Token);


export default router;
