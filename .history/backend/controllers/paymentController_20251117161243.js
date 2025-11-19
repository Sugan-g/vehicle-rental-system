import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
});

// -------------------------------------------------------
// 1) CREATE ORDER
// -------------------------------------------------------
export const createOrder = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${bookingId}_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        return res.json({
            success: true,
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            bookingId
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
};

// -------------------------------------------------------
// 2) VERIFY PAYMENT
// -------------------------------------------------------
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            bookingId,
            amount
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        // store payment in database regardless of success/failure
        await Payment.create({
            booking: bookingId,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            amount,
            status: isValid ? "SUCCESS" : "FAILED"
        });

        if (!isValid) {
            return res.json({ success: false, message: "Payment verification failed" });
        }

        // Update booking as paid
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: "Paid",
        });

        return res.json({ success: true, message: "Payment verified & booking updated" });

    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({ success: false, message: "Payment verification error" });
    }
};
