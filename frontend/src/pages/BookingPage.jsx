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
  const [rating, setRating] = useState(0);
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
        setVehicle(res.data.data); // ✅ FIXED — unwraps your backend response
      } catch (err) {
        console.error("Error fetching vehicle:", err);
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
        setReviews(res.data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    loadReviews();
  }, [vehicleId]);

  // ------------------------------
  // CHECK IF USER ALREADY REVIEWED
  // ------------------------------
  useEffect(() => {
    const checkUserReview = async () => {
      try {
        const res = await API.get(`/reviews/check/${vehicleId}`);
        setHasReviewed(res.data.hasReviewed);
      } catch (err) {
        console.error("Error checking review:", err);
      }
    };
    if (isLoggedIn) checkUserReview();
  }, [vehicleId, isLoggedIn]);

  // ------------------------------
  // HANDLE BOOKING
  // ------------------------------
  const handleBooking = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.post("/bookings", {
        vehicleId,
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
      });

      alert("Booking successful!");
      navigate("/profile");
    } catch (err) {
      alert("Booking failed");
      console.error(err);
    }
  };

  // ------------------------------
  // HANDLE REVIEW SUBMIT
  // ------------------------------
  const submitReview = async () => {
    if (!rating || comment.trim() === "") {
      alert("Rating and comment required");
      return;
    }

    try {
      await API.post("/reviews", {
        vehicleId,
        rating,
        comment,
      });

      alert("Review submitted!");

      // Refresh reviews
      const res = await API.get(`/reviews/vehicle/${vehicleId}`);
      setReviews(res.data.data);

      setHasReviewed(true);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="booking-page">
      <h1>{vehicle.make} {vehicle.model}</h1>

      {/* Vehicle Image */}
      <img
        src={vehicle.images?.[0]}
        alt={vehicle.model}
        style={{ width: "300px", borderRadius: "8px" }}
      />

      <p><strong>Price / Day:</strong> ₹{vehicle.pricePerDay}</p>

      {/* Booking Section */}
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

      {/* Review Section */}
      <div>
        <h3>Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => (
          <div key={r._id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <strong>⭐ {r.rating}</strong>
            <p>{r.comment}</p>
          </div>
        ))}

        {!hasReviewed && isLoggedIn && (
          <div>
            <h4>Write a Review</h4>

            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">Select Rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>

            <textarea
              placeholder="Write your review"
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
