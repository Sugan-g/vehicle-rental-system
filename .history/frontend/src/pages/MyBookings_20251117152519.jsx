import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviews, setReviews] = useState({});
  const [submitting, setSubmitting] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch bookings + reviews
  const fetchData = async () => {
    try {
      const res = await API.get(`/bookings/my?page=${page}&limit=${limit}`);

      const items = res?.data?.data || [];
      const totalCount = res?.data?.total || 0;

      setBookings(items);
      setTotal(totalCount);

      // Fetch all user reviews
      const reviewRes = await API.get("/reviews/my");

      const map = {};
      (reviewRes?.data || []).forEach((r) => {
        if (r?.vehicle?._id) {
          map[r.vehicle._id] = {
            rating: r.rating,
            comment: r.comment,
          };
        }
      });

      setReviews(map);
    } catch (err) {
      setBookings([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // Cancel booking
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
const handlePayNow = async (booking) => {
  const confirmPay = window.confirm("Simulate Successful  Payment?");
  if (!confirmPay) return;

  try {
    // Calling backend to mark payment as completed
    await API.post("/payments/demo-verify", {
      bookingId: booking._id,
      amount: booking.totalAmount,
    });

    alert(" Payment Successful!");
    fetchData(); // refresh bookings
  } catch (err) {
    console.error(err);
    alert(" Payment Failed");
  }
};


  // Rating click
  const handleStarClick = (vehicleId, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], rating: value },
    }));
  };

  // Comment change
  const handleCommentChange = (vehicleId, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], comment: value },
    }));
  };

  // Submit Review
  const handleSubmitReview = async (booking) => {
    const vId = booking.vehicle._id;

    if (!reviewInputs[vId]?.rating) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmitting(vId);

      const res = await API.post("/reviews", {
        vehicle: vId,
        rating: reviewInputs[vId].rating,
        comment: reviewInputs[vId].comment,
      });

      // Update list
      setReviews((prev) => ({
        ...prev,
        [vId]: {
          rating: res.data.rating,
          comment: res.data.comment,
        },
      }));

      setReviewInputs((prev) => ({
        ...prev,
        [vId]: { rating: 0, comment: "" },
      }));
    } catch {
      alert("Error submitting review");
    }

    setSubmitting(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-4 pt-24 pb-6 max-w-2xl mx-auto md:pt-28">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        My Bookings
      </h1>

      {bookings.length === 0 && (
        <p className="text-center text-gray-600">No bookings found.</p>
      )}

      {bookings.map((b) => {
        const vehicleId = b.vehicle?._id;
        const existingReview = reviews[vehicleId];

        return (
          <div key={b._id} className="border p-4 rounded-xl mb-5 shadow bg-white">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-lg">
                  {b.vehicle?.make} {b.vehicle?.model}
                </p>
                <p className="text-sm text-gray-600">
                  📍 {b.vehicle?.location}
                </p>
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

            {/* Edit + Cancel */}
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
                  {/* Show Pay Now only if booking is unpaid */}
                    {b.paymentStatus !== "paid" && (
                    <button
                        onClick={() => handlePayNow(b)}
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
                {existingReview ? (
                  <div>
                    <p className="font-semibold">Your Review</p>
                    <p className="text-yellow-500 text-xl">
                      {"★".repeat(existingReview.rating)}
                    </p>
                    <p className="text-gray-700">{existingReview.comment}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-1">Leave a Review</p>

                    {/* Stars */}
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleStarClick(vehicleId, star)}
                          className={`cursor-pointer text-2xl ${
                            reviewInputs[vehicleId]?.rating >= star
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
                      value={reviewInputs[vehicleId]?.comment || ""}
                      onChange={(e) =>
                        handleCommentChange(vehicleId, e.target.value)
                      }
                    ></textarea>

                    <button
                      onClick={() => handleSubmitReview(b)}
                      disabled={submitting === vehicleId}
                      className="bg-green-600 text-white mt-2 px-4 py-2 rounded"
                    >
                      {submitting === vehicleId ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination */}
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
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
