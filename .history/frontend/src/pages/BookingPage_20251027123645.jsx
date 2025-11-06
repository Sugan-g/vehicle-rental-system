import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function BookingPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!startDate || !endDate) return alert("Please select both dates.");

    try {
      setLoading(true);
      await API.post("/bookings", { vehicleId, startDate, endDate });
      alert("✅ Booked Successfully!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="bg-white/80 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          🚗 Book Your Vehicle
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Start Date
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              End Date
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            onClick={handleBook}
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-md text-lg transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 hover:shadow-lg"
            }`}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>

          <p className="text-center text-gray-600 text-sm mt-3">
            Please verify your selected dates before confirming.
          </p>
        </div>
      </div>
    </div>
  );
}
