import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    const [reviewInputs, setReviewInputs] = useState({});
    const [reviews, setReviews] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [successBooking, setSuccessBooking] = useState(null);

    const fetchData = async () => {
        try {
            const res = await API.get("/bookings/my");
            setBookings(res.data);

            // ✅ Fetch old reviews (from backend)
            const reviewRes = await API.get("/reviews/my");

            const mapped = {};
            reviewRes.data.forEach(r => {
                // ✅ Use vehicle id if that's how your backend saves it
                mapped[r.vehicle?._id || r.vehicle] = {
                    rating: r.rating,
                    comment: r.comment,
                };
            });

            setReviews(mapped);
        } catch (error) {
            console.error("Error fetching bookings or reviews", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await API.put(`/bookings/${id}/cancel`);
            alert("Booking cancelled ✅");
            fetchData();
        } catch {
            alert("Error cancelling booking");
        }
    };

    const handleStarClick = (vehicleId, rating) => {
        setReviewInputs(prev => ({
            ...prev,
            [vehicleId]: { ...prev[vehicleId], rating }
        }));
    };

    const handleCommentChange = (vehicleId, comment) => {
        setReviewInputs(prev => ({
            ...prev,
            [vehicleId]: { ...prev[vehicleId], comment }
        }));
    };

    const handleSubmitReview = async (b) => {
        const input = reviewInputs[b.vehicle._id];
        if (!input?.rating) {
            alert("Please select a rating");
            return;
        }

        try {
            setSubmitting(b.vehicle._id);
            const res = await API.post("/reviews", {
                vehicle: b.vehicle._id,
                booking: b._id,
                rating: input.rating,
                comment: input.comment,
            });

            // ✅ Update frontend reviews
            setReviews(prev => ({
                ...prev,
                [b.vehicle._id]: {
                    rating: res.data.rating,
                    comment: res.data.comment,
                },
            }));

            setSuccessBooking(b._id);
            setTimeout(() => setSuccessBooking(null), 2000);
            setSubmitting(null);
        } catch (error) {
            console.error("Review submit failed", error);
            alert("Error submitting review");
            setSubmitting(null);
        }
    };

    return (
        <div className="px-4 pt-24 pb-6 max-w-2xl mx-auto md:pt-28">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                My Bookings
            </h1>

            {bookings.length === 0 && (
                <p className="text-center text-gray-600">No bookings found.</p>
            )}

            {bookings.map(b => (
                <div
                    key={b._id}
                    className="border p-4 rounded-xl mb-5 shadow-sm bg-white hover:shadow-md transition"
                >
                    {/* Vehicle info */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                            <p className="font-semibold text-lg text-gray-900">
                                {b.vehicle.make} {b.vehicle.model}
                            </p>
                            <p className="text-sm text-gray-600">
                                📍 {b.vehicle.location}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                📅 {new Date(b.startDate).toDateString()} →{" "}
                                {new Date(b.endDate).toDateString()}
                            </p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                            <p
                                className={`font-semibold ${
                                    b.status === "cancelled"
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                Status: {b.status}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    {b.status !== "cancelled" && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            <Link
                                to={`/edit-booking/${b._id}`}
                                state={{ booking: b }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleCancel(b._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Review Section */}
                    {b.status !== "cancelled" && (
                        <div className="mt-5 border-t pt-3">
                            {reviews[b.vehicle._id] ? (
                                // ✅ Old review from backend
                                <div>
                                    <p className="font-semibold text-lg mb-1">Your Review</p>
                                    <p className="text-yellow-500 text-xl">
                                        {"⭐".repeat(reviews[b.vehicle._id].rating)}
                                        {"☆".repeat(5 - reviews[b.vehicle._id].rating)}
                                    </p>
                                    {reviews[b.vehicle._id].comment && (
                                        <p className="italic mt-1 text-gray-600">
                                            “{reviews[b.vehicle._id].comment}”
                                        </p>
                                    )}
                                </div>
                            ) : (
                                // ✅ New review form
                                <div>
                                    <p className="font-semibold mb-1 text-gray-700">
                                        Leave a Review
                                    </p>
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                onClick={() => handleStarClick(b.vehicle._id, star)}
                                                className={`cursor-pointer text-2xl ${
                                                    reviewInputs[b.vehicle._id]?.rating >= star
                                                        ? "text-yellow-500"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    <textarea
                                        className="w-full border p-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-400"
                                        rows="2"
                                        placeholder="Share your experience..."
                                        value={reviewInputs[b.vehicle._id]?.comment || ""}
                                        onChange={(e) =>
                                            handleCommentChange(
                                                b.vehicle._id,
                                                e.target.value
                                            )
                                        }
                                    ></textarea>

                                    <button
                                        onClick={() => handleSubmitReview(b)}
                                        disabled={submitting === b.vehicle._id}
                                        className={`bg-green-600 text-white mt-2 py-1.5 px-4 rounded-md text-sm transition ${
                                            submitting === b.vehicle._id
                                                ? "opacity-70 cursor-not-allowed"
                                                : "hover:bg-green-700"
                                        }`}
                                    >
                                        {submitting === b.vehicle._id
                                            ? "Submitting..."
                                            : "Submit Review"}
                                    </button>

                                    {successBooking === b._id && (
                                        <p className="text-green-600 text-sm mt-2">
                                            ✅ Review submitted successfully!
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
