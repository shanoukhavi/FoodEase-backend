import express from 'express';
import { createCheckoutSession } from '../controllers/OrderController';
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, createCheckoutSession);

export default router;
// yes now we start to update the thing and it is been downloaded or the code is been added 
// if we want to update the order mate after stripe prooceed the ayment now everyhtingis been procceded mate 
// we have to update it in deployed site mate 