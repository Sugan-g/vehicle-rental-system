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
  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
  });

  // ------------------------------
  // FETCH VEHICLE
  // ------------------------------
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await API.get(`/vehicles/${vehicleId}`);

        const vehicleData =
          res.data?.data || res.data?.vehicle || res.data;

        setVehicle(vehicleData);
      } catch (err) {
        console.error("Vehicle fetch error:", err);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  // ------------------------------
  // FETCH REVIEWS
  // ------------------------------
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await API.get(`/reviews/vehicle/${vehicleId}`);

        const reviewList =
          res.data?.data || res.data?.reviews || res.data || [];

        setReviews(reviewList);
      } catch (err) {
        console.error("Reviews fetch error:", err);
      }
    };
    loadReviews();
  }, [vehicleId]);

  // ------------------------------
  // CHECK USER REVIEW
  // ------------------------------
  useEffect(() => {
    const checkUserReview = async () => {
      try {
        const res = await API.get(`/reviews/check/${vehicleId}`);
        setHasReviewed(res.data?.hasReviewed || false);
      } catch (err) {
        console.error("Error checking review:", err);
      }
    };

    if (isLoggedIn) checkUserReview();
  }, [vehicleId, isLoggedIn]);

  // ------------------------------
  // BOOK VEHICLE
  // ------------------------------
  const handleBooking = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/bookings", {
        vehicleId,
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
      });

      alert("Booking successful!");
      navigate("/profile");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed");
    }
  };

  // ------------------------------
  // SUBMIT REVIEW
  // ------------------------------
  const submitReview = async () => {
    if (!rating || !comment.trim()) {
      alert("Rating and comment are required");
      return;
    }

    try {
      await API.post("/reviews", {
        vehicleId,
        rating,
        comment,
      });

      alert("Review added");

      const res = await API.get(`/reviews/vehicle/${vehicleId}`);
      setReviews(res.data?.data || res.data || []);
      setHasReviewed(true);
    } catch (err) {
      console.error("Review error:", err);
    }
  };

  if (!vehicle) return <p className="text-center mt-10">Loading...</p>;

 return (
  <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">

    {/* Top Section */}
    <div className="flex flex-col md:flex-row gap-10 items-start bg-white shadow-lg p-6 rounded-2xl border">

      {/* Vehicle Image */}
      <img
        src={vehicle.images?.[0]}
        alt={vehicle.model}
        className="w-full md:w-80 rounded-xl shadow-md object-cover"
      />

      {/* Vehicle Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-3 leading-tight">
          {vehicle.make} {vehicle.model}
        </h1>

        <p className="text-lg mb-5">
          <span className="font-semibold">Price/Day: </span>
          <span className="text-blue-600 font-bold text-xl">
            ₹{vehicle.pricePerDay}
          </span>
        </p>

        {/* Booking Form */}
        <div className="border rounded-xl p-6 shadow bg-gray-50">
          <h3 className="font-semibold text-xl mb-4">Book This Vehicle</h3>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="date"
              value={bookingDetails.startDate}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  startDate: e.target.value,
                })
              }
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="date"
              value={bookingDetails.endDate}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  endDate: e.target.value,
                })
              }
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <button
            onClick={handleBooking}
            className="mt-5 w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>

    {/* Reviews */}
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-6">Reviews</h2>

      {reviews.length === 0 && (
        <p className="text-gray-600 text-lg">No reviews yet.</p>
      )}

      <div className="space-y-5">
        {reviews.map((r) => (
          <div key={r._id} className="border rounded-xl p-5 bg-white shadow-sm">
            <p className="text-2xl font-semibold text-yellow-600">⭐ {r.rating}</p>
            <p className="text-gray-700 mt-2 text-lg">{r.comment}</p>
          </div>
        ))}
      </div>

      {!hasReviewed && isLoggedIn && (
        <div className="mt-10 p-6 border rounded-2xl shadow bg-white">
          <h3 className="font-semibold text-2xl mb-5">Write a Review</h3>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-3 rounded-lg w-full mb-4"
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} Star</option>
            ))}
          </select>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-4 rounded-lg w-full min-h-[120px] mb-4"
          ></textarea>

          <button
            onClick={submitReview}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  </div>
);

}
