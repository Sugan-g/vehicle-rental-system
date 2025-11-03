import Review from "../models/Review.js";

// 🔹 Create a new review
export const createReview = async (req, res) => {
    try {
        const { vehicle, rating, comment } = req.body;

        if (!vehicle || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Prevent duplicate reviews by same user for same vehicle
        const existing = await Review.findOne({
            user: req.user._id,
            vehicle,
        });

        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            await existing.save();
            return res.status(200).json({
                message: "Review updated successfully",
                rating: existing.rating,
                comment: existing.comment,
                vehicle: existing.vehicle,
            });
        }

        // Otherwise create new
        const review = await Review.create({
            user: req.user._id,
            vehicle,
            rating,
            comment,
        });

        res.status(201).json({
            message: "Review created successfully",
            rating: review.rating,
            comment: review.comment,
            vehicle: review.vehicle,
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 🔹 Get all reviews for a specific vehicle
export const getReviewsByVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const reviews = await Review.find({ vehicle: vehicleId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error("Error fetching vehicle reviews:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 🔹 Get all reviews written by the logged-in user
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id }).populate("vehicle", "name");
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

