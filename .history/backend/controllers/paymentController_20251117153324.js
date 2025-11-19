import crypto from "crypto";
import { razorpayInstance } from "../config/razorpay.js";
import Payment from "../models/Payment.js";

/**
 * Create Order (Real Razorpay or Demo)
 */
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        // If Razorpay is DISABLED → Demo Mode
        if (!razorpayInstance) {
            const fakeOrder = {
                id: "demo_order_" + Date.now(),
                amount: amount * 100,
                currency: "INR",
            };

            // Save demo order
            await Payment.create({
                user: req.user._id,
                orderId: fakeOrder.id,
                amount,
                currency: "INR",
                status: "created",
            });

            return res.status(200).json({
                success: true,
                demo: true,
                order: fakeOrder,
            });
        }

        // 🔥 REAL RAZORPAY MODE
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        await Payment.create({
            user: req.user._id,
            orderId: order.id,
            amount,
            currency: "INR",
            status: "created",
        });

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

/**
 * Verify Payment (Real or Demo)
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // DEMO MODE
        if (!razorpayInstance) {
            const payment = await Payment.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    paymentId: razorpay_payment_id || "demo_payment_" + Date.now(),
                    status: "paid",
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                demo: true,
                message: "Demo payment verified",
                payment,
            });
        }

        // REAL MODE
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Razorpay signature" });
        }

        const payment = await Payment.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                status: "paid",
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Payment verified",
            payment,
        });
    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};
