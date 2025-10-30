import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function B() {
    const [bookings, setBookings] = useState([]);
    const [reviewInputs, setReviewInputs] = useState({});
    const [reviews, setReviews] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [successBooking, setSuccessBooking] = useState(null);

    const fetchData = async () => {
        const res = await API.get("/bookings/my");
        setBookings(res.data);

        // ✅ Fetch all reviews for user's bookings
        const vehicleIds = res.data.map(b => b.vehicle._id);
        if (vehicleIds.length > 0) {
            const reviewRes = await API.get("/reviews/my");
            const mapped = {};
            reviewRes.data.forEach(r => {
                mapped[r.vehicle._id] = { rating: r.rating, comment: r.comment };
            });
            setReviews(mapped);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await API.put(`/bookings/${id}/cancel`);
            alert("Booking cancelled ✅ Email sent!");
            fetchData();
        } catch (error) {
            alert("Error cancelling booking");
        }
    };

    const handleStarClick = (bookingId, rating) => {
        setReviewInputs(prev => ({
            ...prev,
            [bookingId]: { ...prev[bookingId], rating }
        }));
    };

    const handleCommentChange = (bookingId, comment) => {
        setReviewInputs(prev => ({
            ...prev,
            [bookingId]: { ...prev[bookingId], comment }
        }));
    };

    // ✅ Updated to show review immediately after submission
    const handleSubmitReview = async (b) => {
        if (!reviewInputs[b._id]?.rating) {
            alert("Please select a rating ⭐");
            return;
        }

        try {
            setSubmitting(b._id);
            const res = await API.post("/reviews", {
                vehicle: b.vehicle._id,
                rating: reviewInputs[b._id].rating,
                comment: reviewInputs[b._id].comment,
            });

            // ✅ Immediately update the review list in frontend
            setReviews(prev => ({
                ...prev,
                [b.vehicle._id]: {
                    rating: res.data.rating,
                    comment: res.data.comment
                }
            }));

            // ✅ Clear input for that booking after submit
            setReviewInputs(prev => ({
                ...prev,
                [b._id]: { rating: 0, comment: "" }
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
                    {/* Vehicle Info */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                            <p className="font-semibold text-lg text-gray-900">
                                {b.vehicle.make} {b.vehicle.model}
                            </p>
                            <p className="text-sm text-gray-600">
                                📍 {b.vehicle.location || "N/A"}
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
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none text-center hover:bg-blue-700 transition"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => handleCancel(b._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none hover:bg-red-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Review Section */}
                    {b.status !== "cancelled" && (
                        <div className="mt-5 border-t pt-3">
                            {reviews[b.vehicle._id] ? (
                                <div className="text-gray-800">
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
                                <div className="mt-2">
                                    <p className="font-semibold text-gray-700 mb-1">Leave a Review</p>

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                onClick={() => handleStarClick(b._id, star)}
                                                className={`cursor-pointer text-2xl ${
                                                    reviewInputs[b._id]?.rating >= star
                                                        ? "text-yellow-500"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Comment box */}
                                    <textarea
                                        className="w-full border p-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-400"
                                        rows="2"
                                        placeholder="Share your experience..."
                                        value={reviewInputs[b._id]?.comment || ""}
                                        onChange={e => handleCommentChange(b._id, e.target.value)}
                                    ></textarea>

                                    {/* Submit Button */}
                                    <button
                                        onClick={() => handleSubmitReview(b)}
                                        disabled={submitting === b._id}
                                        className={`bg-green-600 text-white mt-2 py-1.5 px-4 rounded-md text-sm w-full md:w-auto transition ${
                                            submitting === b._id
                                                ? "opacity-70 cursor-not-allowed"
                                                : "hover:bg-green-700"
                                        }`}
                                    >
                                        {submitting === b._id ? "Submitting..." : "Submit Review"}
                                    </button>

                                    {/* ✅ Inline success message */}
                                    {successBooking === b._id && (
                                        <p className="text-green-600 text-sm mt-2 font-medium">
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
