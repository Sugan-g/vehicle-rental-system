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

        // FIX: Support both formats
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

        // FIX: Support both formats
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
  // CHECK REVIEW EXISTS
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
  // BOOKING
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

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="booking-page">
      <h1>{vehicle.make} {vehicle.model}</h1>

      <img
        src={vehicle.images?.[0]}
        style={{ width: "300px", borderRadius: "8px" }}
      />

      <p><strong>Price/Day:</strong> ₹{vehicle.pricePerDay}</p>

      {/* Booking */}
      <div>
        <h3>Book This Vehicle</h3>

        <input
          type="date"
          value={bookingDetails.startDate}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, startDate: e.target.value })
          }
        />

        <input
          type="date"
          value={bookingDetails.endDate}
          onChange={(e) =>
            setBookingDetails({ ...bookingDetails, endDate: e.target.value })
          }
        />

        <button onClick={handleBooking}>Book Now</button>
      </div>

      {/* Reviews */}
      <div>
        <h3>Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => (
          <div key={r._id}>
            <p>⭐ {r.rating}</p>
            <p>{r.comment}</p>
          </div>
        ))}

        {!hasReviewed && isLoggedIn && (
          <div>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} Star</option>
              ))}
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button onClick={submitReview}>Submit Review</button>
          </div>
        )}
      </div>
    </div>
  );
}
