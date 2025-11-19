import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    const [reviewInputs, setReviewInputs] = useState({});
    const [reviews, setReviews] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [successBooking, setSuccessBooking] = useState(null);

    // Pagination States
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

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
        const res = await API.get(`/bookings/my?page=${page}&limit=${limit}`);
        setBookings(res.data.data);
        setTotal(res.data.total);

        const vehicleIds = res.data.data.map((b) => b.vehicle._id);

        if (vehicleIds.length > 0) {
            const reviewRes = await API.get("/reviews/my");
            const mapped = {};

            reviewRes.data.forEach((r) => {
                mapped[r.vehicle._id] = {
                    rating: r.rating,
                    comment: r.comment,
                };
            });

            setReviews(mapped);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]); // load when page changes

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await API.put(`/bookings/${id}/cancel`);
            alert("Booking cancelled. Email sent!");
            fetchData();
        } catch {
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

    const handlePayment = async (booking) => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Failed to load Razorpay SDK.");
            return;
        }

        try {
            const orderRes = await API.post("/payments/create-order", {
                amount: booking.totalAmount || 1000,
            });

            const { amount, id: order_id, currency } = orderRes.data.order;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount.toString(),
                currency,
                name: "Online Vehicle Rental",
                description: `Payment for booking ${booking.vehicle.make}`,
                order_id,
                handler: async function (response) {
                    const verifyRes = await API.post("/payments/verify", {
                        razorpay_order_id: order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verifyRes.data.success) {
                        alert("Payment successful!");
                        fetchData();
                    } else {
                        alert("Payment verification failed.");
                    }
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error("Payment error:", err);
            alert("Payment failed.");
        }
    };

    const handleSubmitReview = async (b) => {
        if (!reviewInputs[b._id]?.rating) {
            alert("Please select a rating");
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
        } catch (err) {
            console.error(err);
            alert("Error submitting review");
        }

        setSubmitting(null);
    };

    // Pagination Helpers
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="px-4 pt-24 pb-6 max-w-2xl mx-auto md:pt-28">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                My Bookings
            </h1>

            {bookings.length === 0 && (
                <p className="text-center text-gray-600">No bookings found.</p>
            )}

            {bookings.map((b) => (
                <div key={b._id} className="border p-4 rounded-xl mb-5 shadow-sm bg-white">
                    <div className="flex justify-between">
                        <div>
                            <p className="font-semibold text-lg">
                                {b.vehicle.make} {b.vehicle.model}
                            </p>
                            <p className="text-sm text-gray-600">📍 {b.vehicle.location}</p>
                        </div>

                        <p
                            className={`font-semibold ${
                                b.status === "cancelled"
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >
                            {b.status}
                        </p>
                    </div>

                    {/* Actions */}
                    {b.status !== "cancelled" && (
                        <div className="flex gap-3 mt-4">
                            <Link
                                to={`/edit-booking/${b._id}`}
                                state={{ booking: b }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => handleCancel(b._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                            {b.status !== "paid" && (
                                <button
                                    onClick={() => handlePayment(b)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Pay Now
                                </button>
                            )}
                        </div>
                    )}

                    {/* Review Section */}
                    {b.status !== "cancelled" && (
                        <div className="mt-4 border-t pt-3">
                            {reviews[b.vehicle._id] ? (
                                <div>
                                    <p className="font-semibold">Your Review</p>
                                    <p className="text-yellow-500">
                                        {"⭐".repeat(reviews[b.vehicle._id].rating)}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-semibold mb-1">Leave a Review</p>

                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() =>
                                                    handleStarClick(b._id, star)
                                                }
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
                                        rows="2"
                                        className="border w-full p-2 rounded"
                                        placeholder="Write your review"
                                        value={reviewInputs[b._id]?.comment || ""}
                                        onChange={(e) =>
                                            handleCommentChange(
                                                b._id,
                                                e.target.value
                                            )
                                        }
                                    ></textarea>

                                    <button
                                        onClick={() => handleSubmitReview(b)}
                                        disabled={submitting === b._id}
                                        className="bg-green-600 text-white mt-2 px-4 py-2 rounded"
                                    >
                                        {submitting === b._id
                                            ? "Submitting..."
                                            : "Submit Review"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Pagination Controls */}
            {total > limit && (
                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                                page === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
