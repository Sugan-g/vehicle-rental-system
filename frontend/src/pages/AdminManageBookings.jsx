import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings?page=1&limit=100");
      setBookings(res.data.data || []);
    } catch (error) {
      console.log("Error fetching admin bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Approve
  const handleApprove = async (id) => {
    try {
      await API.put(`/bookings/${id}`, { status: "booked" });
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  // Cancel Booking (Admin)
  const handleCancel = async (id) => {
    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Booking Permanently (Only Admin)
  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to permanently delete this booking?")) return;

    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading bookings...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings available.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-6 bg-white rounded-xl shadow-lg border"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">
                  {b.vehicle
                    ? `${b.vehicle.make} ${b.vehicle.model}`
                    : "Vehicle Removed"}
                </h2>

                <span
                  className={`text-sm font-bold ${
                    b.status === "booked"
                      ? "text-green-600"
                      : b.status === "cancelled"
                      ? "text-red-500"
                      : "text-blue-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <p className="text-sm text-gray-700">
                <strong>User:</strong> {b.user?.name} ({b.user?.email})
              </p>

              <p className="text-sm mt-1 text-gray-700">
                <strong>Start:</strong>{" "}
                {new Date(b.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">
                <strong>End:</strong>{" "}
                {new Date(b.endDate).toLocaleDateString()}
              </p>

              <p className="text-sm mt-2">
                <strong>Payment:</strong>{" "}
                <span
                  className={
                    b.payment?.status === "Paid"
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {b.payment?.status || "Pending"}
                </span>
              </p>

              <div className="flex gap-3 mt-4">
                {b.status !== "booked" && (
                  <button
                    onClick={() => handleApprove(b._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}

                {b.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => handleDelete(b._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
