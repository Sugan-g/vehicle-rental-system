import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

export default function VehicleDetails() {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);

  // Fetch vehicle
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const res = await API.get(`/vehicles/${id}`);
        setVehicle(res.data);
      } catch (err) {
        console.error("Vehicle fetch error:", err);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  // Fetch reviews for this vehicle
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/vehicle/${id}`);
        setReviews(res.data || []);
      } catch (err) {
        console.log("Reviews fetch error:", err);
      }
    };

    fetchReviews();
  }, [id]);

  // Check if user has completed booking to allow review
  useEffect(() => {
    const checkEligibility = async () => {
      if (!isLoggedIn) return;

      try {
        const res = await API.get(`/bookings/my`);
        const bookings = res.data?.data || [];

        const completed = bookings.some(
          (b) =>
            b.vehicle?._id === id &&
            (b.status === "completed" || b.paymentStatus === "paid")
        );

        setCanReview(completed);
      } catch (err) {
        console.log("Booking check error:", err);
      }
    };

    checkEligibility();
  }, [isLoggedIn, id]);

  // Submit review
  const submitReview = async () => {
    if (!comment.trim()) return alert("Enter a comment");

    try {
      await API.post("/reviews", {
        vehicleId: id,
        rating,
        comment,
      });

      // Reload reviews
      const res = await API.get(`/reviews/vehicle/${id}`);
      setReviews(res.data || []);

      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Review submit error:", err);
    }
  };

  if (!vehicle) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">Vehicle Details</h1>

      {/* Vehicle Info */}
      <div className="bg-white shadow p-4 rounded-lg space-y-2">
        <div><strong>Model:</strong> {vehicle.model}</div>
        <div><strong>Brand:</strong> {vehicle.brand}</div>
        <div><strong>Price per day:</strong> ₹{vehicle.pricePerDay}</div>
        <div><strong>Description:</strong> {vehicle.description}</div>
      </div>

      {/* Reviews Section */}
      <h2 className="text-xl font-bold mt-8 mb-3">Reviews</h2>

      {/* Review Form */}
      {isLoggedIn ? (
        canReview ? (
          <div className="bg-gray-100 p-4 rounded-lg mb-5">
            <h3 className="font-semibold mb-2">Write a Review</h3>

            <label className="block mb-2">
              Rating:
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="ml-2 border p-1"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              placeholder="Write your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button
              onClick={submitReview}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">
             You can review only after completing a booking of this vehicle.
          </p>
        )
      ) : (
        <p className="text-gray-500 mb-4">Login to write a review.</p>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {reviews.map((r) => (
          <div key={r._id} className="bg-white p-4 shadow rounded-lg">
            <p className="font-semibold">
              ⭐ {r.rating} / 5
            </p>
            <p className="text-gray-700 mt-1">{r.comment}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(r.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
