import { Router } from "express";
const router = Router();

//importtar rutas de auth controller
import * as authCTRL from '../controllers/auth.controller'

router.post('/signup',authCTRL.singup);
router.post('/signin',authCTRL.signin);

export default router;
