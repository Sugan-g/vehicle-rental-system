import Razorpay from "razorpay";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
export const createOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body; // amount in INR
        const options = {
            amount: amount * 100, // convert to paise
            currency: currency || "INR"
        };
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Razorpay order creation failed", error });
    }
};
