import express from 'express';
import { createCheckoutSession, stripeWebhookHandler } from "../controllers/OrderController";
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, createCheckoutSession);
router.post("/checkout/webhook", stripeWebhookHandler);

export default router;
