import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    const [reviewInputs, setReviewInputs] = useState({});
    const [reviews, setReviews] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [successBooking, setSuccessBooking] = useState(null);

    // ✅ Load Razorpay script dynamically
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const fetchData = async () => {
        const res = await API.get("/bookings/my");
        setBookings(res.data);

        // Fetch all reviews for user's bookings
        const vehicleIds = res.data.map((b) => b.vehicle._id);
        if (vehicleIds.length > 0) {
            const reviewRes = await API.get("/reviews/my");
            const mapped = {};
            reviewRes.data.forEach((r) => {
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
        setReviewInputs((prev) => ({
            ...prev,
            [bookingId]: { ...prev[bookingId], rating },
        }));
    };

    const handleCommentChange = (bookingId, comment) => {
        setReviewInputs((prev) => ({
            ...prev,
            [bookingId]: { ...prev[bookingId], comment },
        }));
    };

    // ✅ Razorpay Payment Integration
    const handlePayment = async (booking) => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Failed to load Razorpay SDK. Please check your connection.");
            return;
        }

        try {
            // 1️⃣ Create Razorpay order from backend
            const orderRes = await API.post("/payments/create-order", {
                amount: booking.totalAmount || 1000, // example default
            });

            const { amount, id: order_id, currency } = orderRes.data.order;

            // 2️⃣ Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount.toString(),
                currency: currency,
                name: "Online Vehicle Rental",
                description: `Payment for booking ${booking.vehicle.make} ${booking.vehicle.model}`,
                order_id: order_id,
                handler: async function (response) {
                    // 3️⃣ Verify payment after success
                    const verifyRes = await API.post("/payments/verify", {
                        orderId: order_id,
                        paymentId: response.razorpay_payment_id,
                    });

                    if (verifyRes.data.success) {
                        alert("✅ Payment successful!");
                        fetchData();
                    } else {
                        alert("❌ Payment verification failed.");
                    }
                },
                prefill: {
                    name: booking.user?.name || "User",
                    email: booking.user?.email || "user@example.com",
                },
                theme: { color: "#3399cc" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error("Payment error:", err);
            alert("Payment failed. Try again later.");
        }
    };

    // ✅ Review Submit Logic (unchanged)
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

            setReviews((prev) => ({
                ...prev,
                [b.vehicle._id]: {
                    rating: res.data.rating,
                    comment: res.data.comment,
                },
            }));

            setReviewInputs((prev) => ({
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
        <div className="px-4 pt-24 pb-6 max-w-2xl mx-auto md:pt-28">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                My Bookings
            </h1>

            {bookings.length === 0 && (
                <p className="text-center text-gray-600">No bookings found.</p>
            )}

            {bookings.map((b) => (
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

                            {/* ✅ New Payment Button */}
                            {b.status !== "paid" && (
                                <button
                                    onClick={() => handlePayment(b)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none hover:bg-green-700 transition"
                                >
                                    Pay Now
                                </button>
                            )}
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
                                    <p className="font-semibold text-gray-700 mb-1">
                                        Leave a Review
                                    </p>

                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
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

                                    <textarea
                                        className="w-full border p-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-400"
                                        rows="2"
                                        placeholder="Share your experience..."
                                        value={reviewInputs[b._id]?.comment || ""}
                                        onChange={(e) =>
                                            handleCommentChange(b._id, e.target.value)
                                        }
                                    ></textarea>

                                    <button
                                        onClick={() => handleSubmitReview(b)}
                                        disabled={submitting === b._id}
                                        className={`bg-green-600 text-white mt-2 py-1.5 px-4 rounded-md text-sm w-full md:w-auto transition ${
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
    );
}
