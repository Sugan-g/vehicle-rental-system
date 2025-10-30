import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api.js";
import BookingForm from "../components/BookingForm.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

export default function VehiclePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await API.get(`/vehicles/${id}`);
        setVehicle(res.data);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
    fetchReviews();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10 text-gray-600">Loading vehicle details...</p>;
  }

  if (!vehicle) {
    return <p className="text-center py-10 text-red-500">Vehicle not found.</p>;
  }

  const pricePerDay = vehicle.pricePerDay ?? vehicle.price ?? 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pt-24">
      {/* Vehicle Details */}
     <div className="bg-white shadow-md rounded-lg p-4">
  {vehicle.image ? (
    <img
      src={vehicle.image}
      alt={`${vehicle.make} ${vehicle.model}`}
      className="w-full h-64 object-cover rounded-md mb-4"
    />
  ) : (
    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md mb-4">
      No image available
    </div>
  )}

  <h1 className="text-2xl md:text-3xl font-bold">
    {vehicle.make} {vehicle.model}
  </h1>
  <p className="text-gray-600 text-sm md:text-base">Year: {vehicle.year}</p>
  <p className="font-semibold text-green-600">
    ₹{vehicle.pricePerDay} / day
  </p>
  <p className="text-gray-600">Location: {vehicle.location}</p>
</div>


      {/* Booking Section */}
      <div className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Book this Vehicle</h2>
        <BookingForm vehicleId={vehicle._id} pricePerDay={pricePerDay} />
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Customer Reviews</h2>
        <ReviewForm vehicleId={vehicle._id} onReviewAdded={fetchReviews} />

        <ul className="mt-4 space-y-3">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <li key={r._id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <strong className="text-blue-600">{r.user?.name || "Anonymous"}:</strong>{" "}
                <span className="text-yellow-600 font-medium">{r.rating}/5</span>{" "}
                <span className="text-gray-700">- {r.comment}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-2">No reviews yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
