import Stripe from "stripe";
import Payment from "../models/Payment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Test Payment"
            },
            unit_amount: amount * 100
          },
          quantity: 1
        }
      ],
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel"
    });

    const payment = new Payment({
      userId,
      amount,
      currency: "inr",
      sessionId: session.id,
      status: "pending",
    });

    await payment.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe session error" });
  }
};
