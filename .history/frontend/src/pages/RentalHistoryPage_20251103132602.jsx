import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function RentalHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  // 🔹 Fetch bookings and reviews together
  const fetchAllData = async () => {
    try {
      const [bookingsRes, reviewsRes] = await Promise.all([
        API.get("/bookings/my"),
        API.get("/reviews/my"),
      ]);

      // Store bookings
      setBookings(bookingsRes.data);

      // Map reviews by vehicleId (handles both string/object cases)
      const mappedReviews = {};
      reviewsRes.data.forEach((r) => {
        const vehicleId = r.vehicle?._id || r.vehicle;
        if (vehicleId) {
          mappedReviews[vehicleId] = {
            rating: r.rating,
            comment: r.comment,
          };
        }
      });

      setReviews(mappedReviews);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings or reviews:", error);
      setLoading(false);
    }
  };

  // 🔹 Submit new review
  const handleSubmitReview = async (vehicleId, formData, resetForm) => {
    try {
      const res = await API.post("/reviews", {
        vehicle: vehicleId,
        rating: Number(formData.rating),
        comment: formData.comment.trim(),
      });

      // Update local state instantly
      setReviews((prev) => ({
        ...prev,
        [vehicleId]: {
          rating: res.data.rating,
          comment: res.data.comment,
        },
      }));

      resetForm();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-600">Loading your rental history...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        My Rental History
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => {
            const vehicle = b.vehicle;
            const vehicleId = vehicle?._id || vehicle;
            const review = reviews[vehicleId];
            const [form, setForm] = useState({ rating: "", comment: "" });

            return (
              <div
                key={b._id}
                className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-1">
                  {vehicle?.make} {vehicle?.model} ({vehicle?.year})
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Booking Date: {new Date(b.createdAt).toLocaleDateString()}
                </p>

                {/* Show review if already exists */}
                {review ? (
                  <div className="bg-gray-50 border-l-4 border-green-500 p-3 rounded-md">
                    <p className="text-sm text-gray-800 font-medium">
                      ⭐ {review.rating} / 5
                    </p>
                    <p className="text-gray-600 mt-1 italic">
                      “{review.comment}”
                    </p>
                  </div>
                ) : (
                  // Otherwise show review form
                  <form
                    className="space-y-3 mt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitReview(vehicleId, form, () =>
                        setForm({ rating: "", comment: "" })
                      );
                    }}
                  >
                    <div>
                      <label className="text-sm text-gray-600">Rating:</label>
                      <select
                        required
                        value={form.rating}
                        onChange={(e) =>
                          setForm({ ...form, rating: e.target.value })
                        }
                        className="ml-2 border rounded-md px-2 py-1"
                      >
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      required
                      rows={2}
                      value={form.comment}
                      onChange={(e) =>
                        setForm({ ...form, comment: e.target.value })
                      }
                      className="w-full border rounded-md px-3 py-2 text-sm text-gray-700"
                      placeholder="Write your review..."
                    />

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
