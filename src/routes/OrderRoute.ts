import express from 'express';
import { createCheckoutSession, getMyOrder, stripeWebhookHandler } from "../controllers/OrderController";
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();
//to gethe orders we create api 
router.get("/",jwtCheck,jwtParse,getMyOrder);
router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, createCheckoutSession);
router.post("/checkout/webhook", stripeWebhookHandler);

export default router;
