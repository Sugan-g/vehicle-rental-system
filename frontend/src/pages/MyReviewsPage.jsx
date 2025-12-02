import { useEffect, useState } from "react";
import API from "../api/api.js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyReviewsPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if user is NOT logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/reviews/my");
        setReviews(res.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchReviews();
    }
  }, [isLoggedIn]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        My Reviews
      </h2>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(id => (
            <div key={id} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      )}

      {/* No Reviews */}
      {!loading && reviews.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          You have not written any reviews yet.
        </p>
      )}

      {/* Reviews List */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {r.vehicle?.model} {r.vehicle?.make}  ({r.vehicle?.year})
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Rating: ⭐ {r.rating}/5
              </p>

              <p className="mt-2 text-gray-700">{r.comment}</p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
