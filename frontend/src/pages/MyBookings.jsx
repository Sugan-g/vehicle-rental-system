import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  // Fetch only ACTIVE bookings, filter out completed/cancelled
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/bookings/my?page=${page}&limit=${limit}`);
      const items = res?.data?.data || [];
      const totalCount = res?.data?.total || 0;

      const normalized = items.map((b) => ({
        ...b,
        payment: { status: b?.payment?.status || "pending" },
      }));

      // 🚀 Only Active Bookings in My Bookings Page
      const activeOnly = normalized.filter(
        (b) => b.status !== "completed" && b.status !== "cancelled"
      );

      setBookings(activeOnly);
      setTotal(totalCount);
    } catch (err) {
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await API.put(`/bookings/${id}/cancel`);
      alert("Booking cancelled. Email sent!");
      fetchData();
    } catch {
      alert("Error cancelling booking");
    }
  };

  const extractAmount = (b) =>
    Number(
      b.totalAmount ||
        b.amount ||
        b.finalAmount ||
        b.total ||
        b.price ||
        b.pricePerDay ||
        0
    );

  const handlePayNow = async (booking) => {
    try {
      const amount = extractAmount(booking);

      if (!amount || !booking._id) {
        alert("Missing amount or booking ID");
        return;
      }

      const res = await API.post("/payments/create-checkout-session", {
        bookingId: booking._id,
        amount,
      });

      if (!res.data.url) {
        alert("Stripe did not return a checkout URL");
        return;
      }

      window.location.href = res.data.url;
    } catch {
      alert("Payment failed");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-4 pt-24 pb-6 max-w-2xl mx-auto md:pt-28">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        My Bookings
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Loading your bookings...</p>
      )}

      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-600">
          No active bookings found.
        </p>
      )}

      {!loading &&
        bookings.map((b) => {
          if (!b.vehicle || !b.vehicle._id) return null;

          const isPaid = b.payment?.status === "paid";

          return (
            <div
              key={b._id}
              className="border p-4 rounded-xl mb-5 shadow bg-white"
            >
              {/* Top Row */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">
                    {b.vehicle.make} {b.vehicle.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {b.vehicle.location}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-lg text-white bg-blue-600 text-sm">
                  Active
                </span>
              </div>

              {/* Dates */}
              <div className="mt-3 text-sm text-gray-700 border-t pt-3 space-y-1">
                <p>
                  <span className="font-semibold">Start:</span>{" "}
                  {formatDate(b.startDate)}
                </p>

                <p>
                  <span className="font-semibold">End:</span>{" "}
                  {formatDate(b.endDate)}
                </p>

                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {isPaid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-orange-600 font-semibold">
                      Pending
                    </span>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {/* Edit Button */}
                <Link
                  to={`/edit-booking/${b._id}`}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isPaid ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
                  }`}
                  onClick={(e) => isPaid && e.preventDefault()}
                >
                  Edit
                </Link>

                {/* Cancel Button */}
                <button
                  onClick={() => !isPaid && handleCancel(b._id)}
                  disabled={isPaid}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isPaid ? "bg-gray-400 cursor-not-allowed" : "bg-red-600"
                  }`}
                >
                  Cancel
                </button>

                {/* Pay Now */}
                {!isPaid && (
                  <button
                    onClick={() => handlePayNow(b)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          );
        })}

      {/* Pagination */}
      {!loading && total > limit && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
