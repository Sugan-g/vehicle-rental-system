import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

export default function BookingPage() {
const { vehicleId } = useParams();
const { isLoggedIn } = useAuth();
const navigate = useNavigate();

const [vehicle, setVehicle] = useState(null);
const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [canReview, setCanReview] = useState(false);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [loading, setLoading] = useState(false);

// Fetch vehicle details
useEffect(() => {
const fetchVehicle = async () => {
try {
const res = await API.get(`/vehicles/${vehicleId}`);
setVehicle(res.data);
} catch (err) {
console.error("Vehicle fetch error:", err);
}
};
fetchVehicle();
}, [vehicleId]);

// Fetch reviews
useEffect(() => {
const fetchReviews = async () => {
try {
const res = await API.get(`/reviews/vehicle/${vehicleId}`);
setReviews(res.data || []);
} catch (err) {
console.error("Reviews fetch error:", err);
}
};
fetchReviews();
}, [vehicleId]);

// Check review eligibility
useEffect(() => {
const checkEligibility = async () => {
if (!isLoggedIn) return;
try {
const res = await API.get(`/bookings/my`);
const bookings = res.data?.data || [];
const completed = bookings.some(
(b) =>
b.vehicle?._id === vehicleId &&
(b.status === "completed" || b.paymentStatus === "paid")
);
setCanReview(completed);
} catch (err) {
console.error("Booking check error:", err);
}
};
checkEligibility();
}, [isLoggedIn, vehicleId]);

// Submit review
const submitReview = async () => {
if (!comment.trim()) return alert("Enter a comment");
try {
await API.post("/reviews", { vehicleId, rating, comment });
const res = await API.get(`/reviews/vehicle/${vehicleId}`);
setReviews(res.data || []);
setComment("");
setRating(5);
} catch (err) {
console.error("Review submit error:", err);
}
};

// Booking handler
const handleBook = async () => {
if (loading) return;
if (!startDate || !endDate) return alert("Select dates");
try {
setLoading(true);
await API.post("/bookings", { vehicleId, startDate, endDate });
alert("Booked Successfully ✅");
navigate("/my-bookings");
} catch (err) {
alert(err.response?.data?.message || "Booking failed");
} finally {
setLoading(false);
}
};

if (!vehicle) return <div className="text-center mt-10">Loading...</div>;

return ( <div className="container mx-auto px-4 pt-24 pb-10 md:pt-28 md:px-8"> <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* Vehicle Info + Booking */}
    <div className="space-y-6">

      {/* Vehicle Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {vehicle.image && (
          <img
            src={vehicle.image}
            alt={vehicle.model}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2">
            {vehicle.brand} - {vehicle.model}
          </h2>
          <p className="text-gray-700 mb-1">
            <strong>Price per day:</strong> ₹{Number(vehicle.pricePerDay).toLocaleString()}
          </p>
          <p className="text-gray-700 mb-3">
            <strong>Description:</strong> {vehicle.description}
          </p>
          <p className="text-gray-500 text-sm">
            <strong>Category:</strong> {vehicle.category || "N/A"} |{" "}
            <strong>Seats:</strong> {vehicle.seats || "N/A"}
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Book This Vehicle</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleBook}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 transition-colors text-white w-full py-3 rounded-lg font-semibold"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>

    {/* Reviews Section */}
    <div className="space-y-6">

      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
        <h3 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h3>

        {/* Add Review */}
        {isLoggedIn ? (
          canReview ? (
            <div className="bg-gray-100 p-4 rounded-lg mb-4 flex flex-col space-y-2">
              <label className="font-medium">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border p-2 rounded-lg w-full"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <textarea
                rows="3"
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
              <button
                onClick={submitReview}
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-lg font-semibold"
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
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold">⭐ {r.rating} / 5</p>
                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</div>

);
}
