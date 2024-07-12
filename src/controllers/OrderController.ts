import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
const getMyOrder=async(req:Request, res:Response)=>{
  try{
const orders=await Order.find({user:req.userId}).populate("restaurant").populate("user");
res.json(orders);
//FIND ALL THE IDS WITH CURRENT ID IF U HAVE
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Error getting order"});
    
  }
}

type CheckoutSessionRequest = {
  cartItems: {
    menuItem: string;
    name: string;
    quantity: number;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("Missing Stripe signature header");
    return res.status(400).send("Missing Stripe signature header");
  }

  console.log("Received Stripe signature:", sig);
  console.log("Request body:", req.body);

  try {
    event = STRIPE.webhooks.constructEvent(req.body, sig as string, STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  console.log("Received Stripe event:", event);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const order = await Order.findById(session.metadata?.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.totalAmount = session.amount_total;
      order.status = "paid";
      await order.save();
      console.log("Order updated to paid:", order);
    } catch (err:any) {
      console.error(`Error processing order: ${err.message}`);
      return res.status(500).send(`Error processing order: ${err.message}`);
    }
  }

  res.status(200).send();
}

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newOrder = new Order({
      restaurant: restaurant._id,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
        name: item.name,
      })),
      createdAt: new Date(),
    });

    const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);
    const session = await createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString());

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    await newOrder.save();
    res.json({ url: session.url });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[]) => {
  return checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItem);
    if (!menuItem) {
      throw new Error(`Menu item ${cartItem.menuItem} not found`);
    }
    return {
      price_data: {
        currency: "gbp",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: cartItem.quantity,
    };
  });
};

const createSession = async (lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], orderId: string, deliveryPrice: number, restaurantId: string) => {
  return await STRIPE.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
    metadata: {
      orderId,
      restaurantId,
    },
    shipping_options: [{
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: deliveryPrice, currency: 'gbp' },
        display_name: 'Delivery',
      },
    }],
  });
};

export { createCheckoutSession, stripeWebhookHandler,getMyOrder };
