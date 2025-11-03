import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function RentalHistoryPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my");
        console.log("My Bookings:", res.data);
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        My Rentals
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No rental history available</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => {
            const status = b.paymentStatus || b.status || "Unknown";
            return (
              <div
                key={b._id}
                className="bg-white p-5 shadow-md rounded-xl border hover:shadow-lg transition duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {b.vehicle?.make} {b.vehicle?.model}
                </h3>

                <p className="text-sm text-gray-700 mt-1">
                  📍 {b.vehicle?.location || "Location not available"}
                </p>

                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>
                    📅 {new Date(b.startDate).toLocaleDateString()} →{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </p>
                  <p>💰 ₹{b.vehicle?.pricePerDay ?? "0"} /day</p>
                </div>

                <div
                  className={`mt-3 px-3 py-1 inline-block rounded-full border font-medium text-sm ${getStatusColor(
                    status
                  )}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
