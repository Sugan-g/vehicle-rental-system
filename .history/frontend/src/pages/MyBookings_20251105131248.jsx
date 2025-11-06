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
        const res = await API.get("/bookings/my");
        setBookings(res.data);

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

    useEffect(() => {
        fetchData();
    }, []);

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

            setReviews(prev => ({
                ...prev,
                [b.vehicle._id]: {
                    rating: res.data.rating,
                    comment: res.data.comment,
                },
            }));

            setReviewInputs(prev => ({
                ...prev,
                [b._id]: { rating: 0, comment: "" },
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                My Bookings
            </h1>

            {bookings.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    No bookings found.
                </p>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                    {bookings.map(b => (
                        <div
                            key={b._id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 p-5 sm:p-6"
                        >
                            {/* Vehicle Info */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {b.vehicle.make} {b.vehicle.model}
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        📍 {b.vehicle.location || "N/A"}
                                    </p>
                                    <p className="text-gray-700 text-sm mt-1">
                                        📅 {new Date(b.startDate).toDateString()} →{" "}
                                        {new Date(b.endDate).toDateString()}
                                    </p>
                                </div>

                                <div className="mt-3 sm:mt-0 text-right">
                                    <span
                                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                                            b.status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >
                                        {b.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {b.status !== "cancelled" && (
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <Link
                                        to={`/edit-booking/${b._id}`}
                                        state={{ booking: b }}
                                        className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium"
                                    >
                                        Edit Booking
                                    </Link>

                                    <button
                                        onClick={() => handleCancel(b._id)}
                                        className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition font-medium"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            )}

                            {/* Review Section */}
                            {b.status !== "cancelled" && (
                                <div className="mt-5 pt-4 border-t border-gray-200">
                                    {reviews[b.vehicle._id] ? (
                                        <div className="text-gray-800">
                                            <p className="font-semibold text-lg mb-1">
                                                Your Review
                                            </p>
                                            <p className="text-yellow-500 text-2xl">
                                                {"⭐".repeat(reviews[b.vehicle._id].rating)}
                                                {"☆".repeat(5 - reviews[b.vehicle._id].rating)}
                                            </p>
                                            {reviews[b.vehicle._id].comment && (
                                                <p className="italic mt-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                    “{reviews[b.vehicle._id].comment}”
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="font-semibold text-gray-700 mb-2">
                                                Leave a Review
                                            </p>

                                            <div className="flex gap-1 mb-2 justify-start">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span
                                                        key={star}
                                                        onClick={() =>
                                                            handleStarClick(b._id, star)
                                                        }
                                                        className={`cursor-pointer text-3xl transition ${
                                                            reviewInputs[b._id]?.rating >= star
                                                                ? "text-yellow-500 scale-110"
                                                                : "text-gray-300 hover:text-yellow-400"
                                                        }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>

                                            <textarea
                                                className="w-full border border-gray-300 p-3 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                                                rows="3"
                                                placeholder="Share your experience..."
                                                value={reviewInputs[b._id]?.comment || ""}
                                                onChange={e =>
                                                    handleCommentChange(b._id, e.target.value)
                                                }
                                            ></textarea>

                                            <button
                                                onClick={() => handleSubmitReview(b)}
                                                disabled={submitting === b._id}
                                                className={`w-full md:w-auto bg-green-600 text-white mt-3 py-2 px-5 rounded-lg text-sm font-medium transition ${
                                                    submitting === b._id
                                                        ? "opacity-70 cursor-not-allowed"
                                                        : "hover:bg-green-700"
                                                }`}
                                            >
                                                {submitting === b._id
                                                    ? "Submitting..."
                                                    : "Submit Review"}
                                            </button>

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
            )}
        </div>
    );
}
