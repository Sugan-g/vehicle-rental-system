import stripe from "../config/stripe.js";
import Payment from "../models/Payment.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;

        if (!bookingId || !amount) {
            return res.status(400).json({ message: "Missing bookingId or amount" });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Vehicle Booking Payment"
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/payment-cancel",
        });

        // Store payment in DB
        await Payment.create({
            bookingId,
            amount,
            checkoutSessionId: session.id,
            status: "pending",
        });

        return res.status(200).json({ url: session.url });

    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return res.status(500).json({ message: "Stripe checkout failed" });
    }
};
