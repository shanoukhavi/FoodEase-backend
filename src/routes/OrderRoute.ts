import { createCheckoutSession } from "../controllers/OrderController";
import express from 'express';
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, createCheckoutSession);

export default router;
