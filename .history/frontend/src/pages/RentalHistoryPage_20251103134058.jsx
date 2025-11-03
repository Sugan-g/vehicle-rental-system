import { useState, useEffect } from "react";
import API from "../api/api.js";
import { FaStar } from "react-icons/fa";

export default function RentalHistoryPage({ booking }) {
  const [existingReview, setExistingReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user's review for this vehicle
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await API.get(`/reviews/my`);
        const found = res.data.find(r => r.vehicle._id === booking.vehicle._id);
        if (found) {
          setExistingReview(found);
          setRating(found.rating);
          setComment(found.comment);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReview();
  }, [booking.vehicle._id]);

  // ✅ Submit or update review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/reviews", {
        vehicle: booking.vehicle._id,
        rating,
        comment,
      });
      setExistingReview(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 border-t pt-2">
      <p className="font-semibold">Your Review</p>

      {existingReview ? (
        <div className="mt-1">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < existingReview.rating ? "#facc15" : "#d1d5db"}
              />
            ))}
          </div>
          <p className="italic text-gray-600 mt-1">“{existingReview.comment}”</p>
        </div>
      ) : (
        // ✅ This shows when no review exists yet
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                onClick={() => setRating(i + 1)}
                color={i < rating ? "#facc15" : "#d1d5db"}
                className="cursor-pointer"
              />
            ))}
          </div>
          <textarea
            className="border p-2 w-full mt-2 rounded"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
