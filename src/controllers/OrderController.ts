import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;

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

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);
    const session = await createSession(lineItems, "TEST_ORDER_ID", restaurant.deliveryPrice, restaurant._id.toString());

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

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

export { createCheckoutSession };
