import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api.js";
import BookingForm from "../components/BookingForm.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

export default function VehiclePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await API.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      const res = await API.get(`/vehicles/${id}`);
      setVehicle(res.data);
    };
    fetchVehicle();
    fetchReviews();
  }, [id]);

  if (!vehicle) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      
      {/* Vehicle Title Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          {vehicle.make} {vehicle.model}
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Year: {vehicle.year}
        </p>
       <p className="font-semibold text-green-600">
        ₹{vehicle.pricePerDay ?? vehicle.price ?? "N/A"} / day
      </p>

        <p className="text-gray-600">Location: {vehicle.location}</p>
      </div>

      {/* Booking Form Section */}
      <div className="bg-gray-50 shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">Book this Vehicle</h2>
        <BookingForm vehicleId={vehicle._id} pricePerDay={vehicle.pricePerDay} />
      </div>

      {/* Reviews */}
      <div className="bg-gray-50 shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">Reviews</h2>
        <ReviewForm vehicleId={vehicle._id} onReviewAdded={fetchReviews} />

        <ul className="mt-4 space-y-3">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <li key={r._id} className="p-3 bg-white rounded shadow-sm">
                <strong className="text-blue-600">{r.user?.name || "User"}:</strong>{" "}
                {r.rating}/5 - <span className="text-gray-700">{r.comment}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
