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

// Fetch vehicle reviews
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
(b) => b.vehicle?._id === vehicleId &&
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

// Handle booking
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


    {/* Left Column: Vehicle Info + Booking Form */}  
    <div className="space-y-6">  
      {/* Vehicle Info */}  
      <div className="bg-white shadow rounded-lg overflow-hidden">  
        {vehicle.image && (  
          <img  
            src={vehicle.image}  
            alt={vehicle.model}  
            className="w-full h-64 object-cover"  
          />  
        )}  
        <div className="p-4">  
          <h2 className="text-2xl font-bold mb-2">{vehicle.brand} - {vehicle.model}</h2>  
          <p className="text-gray-700 mb-1"><strong>Price per day:</strong> ₹{Number(vehicle.pricePerDay).toLocaleString()}</p>  
          <p className="text-gray-700 mb-1"><strong>Description:</strong> {vehicle.description}</p>  
        </div>  
      </div>  

      {/* Booking Form */}  
      <div className="bg-white shadow rounded-lg p-4">  
        <h3 className="text-xl font-semibold mb-3">Book Vehicle</h3>  
        <div className="space-y-3">  
          <div>  
            <label className="block mb-1 font-medium">Start Date</label>  
            <input  
              type="date"  
              className="border p-2 w-full rounded"  
              value={startDate}  
              onChange={(e) => setStartDate(e.target.value)}  
            />  
          </div>  
          <div>  
            <label className="block mb-1 font-medium">End Date</label>  
            <input  
              type="date"  
              className="border p-2 w-full rounded"  
              value={endDate}  
              onChange={(e) => setEndDate(e.target.value)}  
            />  
          </div>  
          <button  
            onClick={handleBook}  
            disabled={loading}  
            className="bg-green-600 text-white w-full py-2 rounded-md mt-2"  
          >{loading ? "Booking..." : "Confirm Booking"}</button>  
        </div>  
      </div>  
    </div>  

    {/* Right Column: Reviews */}  
    <div className="space-y-6">  
      <div className="bg-white shadow rounded-lg p-4">  
        <h3 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h3>  

        {isLoggedIn ? (  
          canReview ? (  
            <div className="bg-gray-100 p-4 rounded-lg mb-4">  
              <label className="block mb-2 font-medium">Rating:</label>  
              <select  
                value={rating}  
                onChange={(e) => setRating(Number(e.target.value))}  
                className="border p-1 mb-2 rounded w-full"  
              >  
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}  
              </select>  
              <textarea  
                className="w-full border p-2 rounded mb-2"  
                rows="3"  
                placeholder="Write your review"  
                value={comment}  
                onChange={(e) => setComment(e.target.value)}  
              ></textarea>  
              <button  
                onClick={submitReview}  
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"  
              >Submit Review</button>  
            </div>  
          ) : (  
            <p className="text-gray-500 mb-4">You can review only after completing a booking of this vehicle.</p>  
          )  
        ) : (  
          <p className="text-gray-500 mb-4">Login to write a review.</p>  
        )}  

        <div className="space-y-3 max-h-[600px] overflow-y-auto">  
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}  
          {reviews.map(r => (  
            <div key={r._id} className="bg-gray-50 p-3 rounded shadow">  
              <p className="font-semibold">⭐ {r.rating} / 5</p>  
              <p className="text-gray-700 mt-1">{r.comment}</p>  
              <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</p>  
            </div>  
          ))}  
        </div>  
      </div>  
    </div>  

  </div>  
</div>  


);
}
