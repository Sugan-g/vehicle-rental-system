import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState({});
    const [reviewInputs, setReviewInputs] = useState({}); // {bookingId: {rating, comment}}

    // Fetch user bookings
    const fetchBookings = async () => {
        const res = await API.get("/bookings/my");
        setBookings(res.data);
    };

    // Fetch reviews for current user
    const fetchReviews = async () => {
        const res = await API.get("/reviews/my"); // you’ll create this route on backend
        const reviewMap = {};
        res.data.forEach(r => {
            reviewMap[r.vehicle] = r; // key by vehicleId
        });
        setReviews(reviewMap);
    };

    useEffect(() => {
        fetchBookings();
        fetchReviews();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await API.put(`/bookings/${id}/cancel`);
            alert("Booking cancelled ✅ Email sent!");
            fetchBookings();
        } catch {
            alert("Error cancelling booking");
        }
    };

    const handleReviewChange = (bookingId, field, value) => {
        setReviewInputs(prev => ({
            ...prev,
            [bookingId]: { ...prev[bookingId], [field]: value },
        }));
    };

    const handleSubmitReview = async (booking) => {
        const input = reviewInputs[booking._id];
        if (!input?.rating) return alert("Please select rating");
        try {
            await API.post("/reviews", {
                vehicle: booking.vehicle._id,
                rating: input.rating,
                comment: input.comment || "",
            });
            alert("Review submitted ✅");
            fetchReviews();
        } catch {
            alert("Failed to submit review");
        }
    };

    return (
        <div className="px-4 pt-24 pb-6 max-w-3xl mx-auto md:pt-28">
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">My Bookings</h1>

            {bookings.length === 0 && <p className="text-center">No bookings found.</p>}

            <div className="space-y-4">
                {bookings.map(b => (
                    <div key={b._id} className="border p-4 rounded-lg shadow-sm bg-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-semibold text-lg">
                                    {b.vehicle.make} {b.vehicle.model}
                                </p>
                                <p>From: {new Date(b.startDate).toDateString()}</p>
                                <p>To: {new Date(b.endDate).toDateString()}</p>
                                <p className={`font-medium ${b.status === "cancelled" ? "text-red-600" : "text-green-600"}`}>
                                    Status: {b.status}
                                </p>
                            </div>

                            {b.status !== "cancelled" && (
                                <div className="flex gap-2 mt-3 md:mt-0">
                                    <Link
                                        to={`/edit-booking/${b._id}`}
                                        state={{ booking: b }}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-center text-sm md:text-base"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleCancel(b._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm md:text-base"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Review Section */}
                        {b.status !== "cancelled" && (
                            <div className="mt-4 border-t pt-3">
                                {reviews[b.vehicle._id] ? (
                                    <div className="text-gray-700">
                                        <p className="font-semibold">Your Review:</p>
                                        <p>⭐ {reviews[b.vehicle._id].rating}/5</p>
                                        {reviews[b.vehicle._id].comment && (
                                            <p className="italic">"{reviews[b.vehicle._id].comment}"</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <label className="font-medium">Rate your experience:</label>
                                        <select
                                            className="border p-2 rounded-md"
                                            value={reviewInputs[b._id]?.rating || ""}
                                            onChange={(e) => handleReviewChange(b._id, "rating", e.target.value)}
                                        >
                                            <option value="">Select Rating</option>
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>

                                        <textarea
                                            className="border p-2 rounded-md"
                                            rows="2"
                                            placeholder="Write a comment..."
                                            value={reviewInputs[b._id]?.comment || ""}
                                            onChange={(e) => handleReviewChange(b._id, "comment", e.target.value)}
                                        ></textarea>

                                        <button
                                            onClick={() => handleSubmitReview(b)}
                                            className="bg-green-600 text-white py-1 rounded-md mt-1"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
