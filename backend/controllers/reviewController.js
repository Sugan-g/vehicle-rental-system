import Review from "../models/Review.js";

// Create review
export const createReview = async (req, res) => {
    try {
        const { vehicle, rating, comment } = req.body;

        const review = await Review.create({
            user: req.user._id,
            vehicle,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get reviews for a vehicle
export const getReviewsByVehicle = async (req, res) => {
    try {
        const reviews = await Review.find({ vehicle: req.params.vehicleId })
            .populate("user", "name");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Get all reviews by logged-in user
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate("vehicle", "_id make model");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
