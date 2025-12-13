import { useEffect, useState, useMemo } from "react";
import API from "../api/api.js";

export default function RentalHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my");
        const items = res?.data?.data || [];
        setBookings(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /**
   * HISTORY RULE (matches your backend):
   * - Cancelled bookings
   * - Paid bookings (payment.status === "paid")
   */
  const historyList = useMemo(() => {
    return bookings.filter((b) => {
      const bookingStatus = (b.status || "").toLowerCase();
      const paymentStatus = (b.payment?.status || "").toLowerCase();

      return bookingStatus === "cancelled" || paymentStatus === "paid";
    });
  }, [bookings]);

  /**
   * Prepare UI-friendly data
   */
  const optimizedBookings = useMemo(() => {
    return historyList.map((b) => {
      const paymentStatus = (b.payment?.status || "").toLowerCase();
      const bookingStatus = (b.status || "").toLowerCase();

      return {
        ...b,
        start: b.startDate
          ? new Date(b.startDate).toLocaleDateString()
          : "—",
        end: b.endDate
          ? new Date(b.endDate).toLocaleDateString()
          : "—",
        status:
          paymentStatus === "paid"
            ? "paid"
            : bookingStatus || "unknown",
        price: b?.vehicle?.pricePerDay ?? "0",
        title: `${b.vehicle?.make || ""} ${b.vehicle?.model || ""}`,
        location: b.vehicle?.location || "Not available",
      };
    });
  }, [historyList]);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-700 bg-green-100 border-green-300";
      case "cancelled":
        return "text-red-700 bg-red-100 border-red-300";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto mt-18">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Rental History
      </h2>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 h-40 rounded-xl shadow-sm"
            />
          ))}
        </div>
      )}

      {/* No History */}
      {!loading && optimizedBookings.length === 0 && (
        <p className="text-center text-gray-500">
          No rental history available
        </p>
      )}

      {/* History Cards */}
      {!loading && optimizedBookings.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {optimizedBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-5 shadow-md rounded-xl border hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {b.title}
              </h3>

              <p className="text-sm text-gray-700 mt-1">
                📍 {b.location}
              </p>

              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>📅 {b.start} → {b.end}</p>
                <p>💰 ₹{b.price} /day</p>
              </div>

              <div
                className={`mt-3 px-3 py-1 inline-block rounded-full border font-medium text-sm ${getStatusColor(
                  b.status
                )}`}
              >
                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
