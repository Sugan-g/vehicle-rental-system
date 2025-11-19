import stripe from "../config/stripe.js";
import Payment from "../models/Payment.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;

        if (!bookingId || !amount) {
            return res.status(400).json({ message: "Missing bookingId or amount" });
        }

        // Stripe expects amount in paisa (₹100 = 10000)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "inr",
            automatic_payment_methods: { enabled: true },
        });

        // Save to DB
        const payment = await Payment.create({
            bookingId,
            amount,
            paymentIntentId: paymentIntent.id,
            status: "pending"
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            payment
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: "Payment failed", error });
    }
};
