import stripe from "../config/stripe.js";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

/* -------------------------------------------------------
   CREATE CHECKOUT SESSION
------------------------------------------------------- */
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
                        product_data: { name: "Vehicle Booking Payment" },
                        unit_amount: amount * 100, // amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/payment-cancel",
        });

        // Store payment record
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


/* -------------------------------------------------------
   VERIFY PAYMENT AFTER SUCCESS
------------------------------------------------------- */
export const verifyPayment = async (req, res) => {
    try {
        const sessionId = req.query.session_id;

        if (!sessionId) {
            return res.status(400).json({ message: "Missing session_id" });
        }

        // Retrieve session from Stripe servers
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not completed" });
        }

        // Find related DB entry
        const payment = await Payment.findOne({ checkoutSessionId: sessionId });

        if (!payment) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        // Update payment record
        payment.status = "paid";
        await payment.save();

        // Update booking status
        await Booking.findByIdAndUpdate(payment.bookingId, {
            status: "paid",
        });

        return res.json({ message: "Payment verified successfully", status: "paid" });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return res.status(500).json({ message: "Payment verification failed" });
    }
};


/* -------------------------------------------------------
   PAYMENT CANCEL
------------------------------------------------------- */
export const paymentCancel = async (req, res) => {
    return res.json({
        message: "Payment cancelled by user",
        status: "cancelled",
    });
};
