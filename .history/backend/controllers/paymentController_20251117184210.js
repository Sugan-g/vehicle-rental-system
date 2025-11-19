import stripe from "../config/stripe.js";
import Payment from "../models/Payment.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;

        if (!bookingId || !amount) {
            return res.status(400).json({ message: "Missing bookingId or amount" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Vehicle Booking Payment"
                        },
                        unit_amount: amount * 100
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-cancel",
        });

        return res.status(200).json({ url: session.url });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Stripe checkout failed" });
    }
};

