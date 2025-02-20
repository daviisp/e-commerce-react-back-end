import express, { Request, Response } from "express";
import Product from "./types/product";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!, {
  apiVersion: "2022-11-15",
});

const PAYMENT_CONFIRMARION_URL = `${process.env.FRONT_END_URL}/payment-confirmation`;

router.post(
  "/create-checkout-session",
  async (request: Request, response: Response) => {
    const items = request.body.products.map((product: Product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
        },
        unit_amount: parseInt(`${product.price}00`),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      success_url: `${PAYMENT_CONFIRMARION_URL}?success=true`,
      cancel_url: `${PAYMENT_CONFIRMARION_URL}?success=false`,
    });

    response.json({ url: session.url });
  }
);

export { router };
