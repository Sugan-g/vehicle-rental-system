import { getRazorpayInstance } from "../utils/razorpay.js";

export const createOrder = async (req, res) => {
    try {
        const instance = getRazorpayInstance();
        const { amount, currency } = req.body;

        const order = await instance.orders.create({
            amount: amount * 100,
            currency: currency || "INR"
        });

        res.json(order);
    } catch (error) {
        console.error("Razorpay error:", error);
        res.status(500).json({ message: "Failed to create order", error });
    }
};
