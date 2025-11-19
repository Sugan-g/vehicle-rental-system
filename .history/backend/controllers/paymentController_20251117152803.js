// controllers/paymentController.js
import crypto from "crypto";
import { razorpayInstance } from "../config/razorpay.js";
import Payment from "../models/Payment.js";

/**
 * @desc Create Razorpay Order
 * @route POST /api/payments/create-order
 * @access Private
 */
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required",
            });
        }

        // Razorpay requires amount in paise
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        // Save order to DB
        const payment = new Payment({
            user: req.user._id,
            orderId: order.id,
            amount,
            currency: "INR",
            status: "created",
        });

        await payment.save();

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create Razorpay order",
        });
    }
};

/**
 * @desc Verify Razorpay Payment
 * @route POST /api/payments/verify
 * @access Private
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification details",
            });
        }

        // Generate expected signature
        const signString = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(signString)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        // Update payment record
        const payment = await Payment.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                status: "paid",
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            payment,
        });

    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};
