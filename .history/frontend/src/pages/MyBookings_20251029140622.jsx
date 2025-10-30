import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});
  const [submitting, setSubmitting] = useState(null);

  const fetchBookings = async () => {
    const res = await API.get("/bookings/my");
    setBookings(res.data);
  };

  const fetchReviews = async () => {
    const res = await API.get("/reviews/my");
    const map = {};
    res.data.forEach(r => (map[r.vehicle] = r));
    setReviews(map);
  };

  useEffect(() => {
    fetchBookings();
    fetchReviews();
  }, []);

  const handleCancel = async id => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      alert("Booking cancelled ✅ Email sent!");
      fetchBookings();
    } catch {
      alert("Error cancelling booking");
    }
  };

  const handleStarClick = (bookingId, rating) => {
    setReviewInputs(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], rating },
    }));
  };

  const handleCommentChange = (bookingId, value) => {
    setReviewInputs(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], comment: value },
    }));
  };

  const handleSubmitReview = async booking => {
    const input = reviewInputs[booking._id];
    if (!input?.rating) return alert("Please select rating");
    try {
      setSubmitting(booking._id);
      const res = await API.post("/reviews", {
        vehicle: booking.vehicle._id,
        rating: input.rating,
        comment: input.comment || "",
      });
      setReviews(prev => ({
        ...prev,
        [booking.vehicle._id]: res.data, // instantly show review
      }));
      setReviewInputs(prev => ({ ...prev, [booking._id]: {} }));
    } catch {
      alert("Failed to submit review");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="px-4 pt-24 pb-10 max-w-4xl mx-auto md:pt-28">
      <h1 className="text-2xl font-bold mb-6 text-center">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-center text-gray-600">No bookings found.</p>
      )}

      <div className="space-y-5">
        {bookings.map(b => (
          <div
            key={b._id}
            className="border rounded-2xl shadow-md bg-white p-5 hover:shadow-lg transition"
          >
            {/* Vehicle Info */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {b.vehicle.make} {b.vehicle.model}
                </p>
                <p className="text-gray-600">
                  From: {new Date(b.startDate).toDateString()}
                </p>
                <p className="text-gray-600">
                  To: {new Date(b.endDate).toDateString()}
                </p>
                <p
                  className={`font-medium mt-1 ${
                    b.status === "cancelled"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Status: {b.status}
                </p>
              </div>

              {b.status !== "cancelled" && (
                <div className="flex gap-2 mt-3 md:mt-0">
                  <Link
                    to={`/edit-booking/${b._id}`}
                    state={{ booking: b }}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

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

                    <textarea
                      className="w-full border p-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-400"
                      rows="2"
                      placeholder="Share your experience..."
                      value={reviewInputs[b._id]?.comment || ""}
                      onChange={e =>
                        handleCommentChange(b._id, e.target.value)
                      }
                    ></textarea>

                    <button
                      onClick={() => handleSubmitReview(b)}
                      disabled={submitting === b._id}
                      className="bg-green-600 text-white mt-2 py-1.5 px-4 rounded-md hover:bg-green-700 text-sm transition w-full md:w-auto"
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
      </div>
    </div>
  );
}
