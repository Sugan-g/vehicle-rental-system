import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

export default function AdminManageBookings() {
  // Data
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const perPageOptions = [5, 10, 20, 50];
  const [limit, setLimit] = useState(10);

  // Removed vehicle section toggle
  const [removedOpen, setRemovedOpen] = useState(false);

  // Fetch bookings and vehicles
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookingsRes = await API.get("/bookings?page=1&limit=1000");
      const rawBookings = bookingsRes.data?.data || [];

      const vehiclesRes = await API.get("/vehicles");
      const activeVehicles = vehiclesRes.data?.data || vehiclesRes.data || [];

      setBookings(rawBookings);
      setVehicles(activeVehicles);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch bookings or vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Actions
  const handleCancel = async (id) => {
    try {
      await API.put(`/bookings/${id}/cancel`);
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to permanently delete this booking?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Separate active vs removed vehicle bookings
  const { activeBookings, removedBookings } = useMemo(() => {
    const active = [];
    const removed = [];
    for (const b of bookings) {
      if (b.vehicle && Object.keys(b.vehicle).length > 0) active.push(b);
      else removed.push(b);
    }
    return { activeBookings: active, removedBookings: removed };
  }, [bookings]);

  // Apply filters and search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeBookings.filter((b) => {
      const userName = (b.user?.name || "").toLowerCase();
      const userEmail = (b.user?.email || "").toLowerCase();
      const vehicleStr = ((b.vehicle?.make || "") + " " + (b.vehicle?.model || "")).toLowerCase();

      if (q && !userName.includes(q) && !userEmail.includes(q) && !vehicleStr.includes(q)) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      const paymentStatus = b.payment?.status || "Pending";
      if (paymentFilter !== "all" && paymentStatus !== paymentFilter) return false;
      if (vehicleFilter !== "all" && String(b.vehicle?._id) !== String(vehicleFilter)) return false;

      return true;
    });
  }, [activeBookings, search, statusFilter, paymentFilter, vehicleFilter]);

  // Pagination
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  // Date formatting
  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Manage Bookings</h1>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-md border mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by user, email, or vehicle..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex gap-3 items-center mt-2 md:mt-0">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2">
              <option value="all">All statuses</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2">
              <option value="all">All payment</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

            <select value={vehicleFilter} onChange={(e) => { setVehicleFilter(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2 min-w-[160px]">
              <option value="all">All vehicles</option>
              {vehicles.map((v) => (
                <option key={v._id || v.id} value={v._id || v.id}>{v.make} {v.model}</option>
              ))}
            </select>

            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2">
              {perPageOptions.map((o) => <option key={o} value={o}>{o} / page</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Active Bookings List */}
      <div className="space-y-6">
        {paginated.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow border text-center text-gray-600">
            No bookings match your search/filters.
          </div>
        ) : (
          paginated.map((b) => (
            <div key={b._id} className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : "Unknown Vehicle"}</h2>
                  <p className="text-sm text-gray-600 mt-1"><strong>User:</strong> {b.user?.name || "—"} <span className="text-xs text-gray-400">({b.user?.email || "—"})</span></p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
                    <div><span className="font-semibold">Start:</span> {formatDate(b.startDate)}</div>
                    <div><span className="font-semibold">End:</span> {formatDate(b.endDate)}</div>
                    <div><span className="font-semibold">Price/Day:</span> {b.vehicle?.pricePerDay ? `₹${b.vehicle.pricePerDay}` : "—"}</div>
                    <div><span className="font-semibold">Total:</span> ₹{b.totalAmount || 0}</div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex-shrink-0 flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${b.status === "booked" ? "bg-green-100 text-green-700" : ""}
                    ${b.status === "cancelled" ? "bg-red-100 text-red-600" : ""}
                  `}>{b.status}</span>

                  <div className="text-sm">
                    <div>
                      <span className="font-semibold">Payment:</span>{" "}
                      <span className={b.payment?.status === "Paid" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                        {b.payment?.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {b.status === "booked" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          Showing <strong>{(page - 1) * limit + 1}</strong> to <strong>{Math.min(page * limit, totalFiltered)}</strong> of <strong>{totalFiltered}</strong> bookings
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`px-3 py-1 rounded-md border ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}>Prev</button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((pNum) => (
              <button key={pNum} onClick={() => setPage(pNum)} className={`px-3 py-1 rounded-md border ${pNum === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>{pNum}</button>
            ))}
          </div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`px-3 py-1 rounded-md border ${page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}>Next</button>
        </div>
      </div>

      {/* Removed Vehicle Bookings */}
      <div className="mt-8">
        <button onClick={() => setRemovedOpen((v) => !v)} className="w-full flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Removed Vehicle Bookings</h3>
            <p className="text-sm text-gray-500">Bookings whose vehicle was removed ({removedBookings.length})</p>
          </div>
          <div className="text-gray-500 text-xl">{removedOpen ? "−" : "+"}</div>
        </button>

        {removedOpen && (
          <div className="mt-4 space-y-4">
            {removedBookings.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow border text-gray-600">No removed-vehicle bookings.</div>
            ) : (
              removedBookings.map((b) => (
                <div key={b._id} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">🚫 Vehicle Removed</h4>
                      <p className="text-sm text-gray-600"><strong>User:</strong> {b.user?.name || "—"} ({b.user?.email || "—"})</p>
                      <div className="mt-2 text-sm text-gray-700">
                        <div><span className="font-semibold">Start:</span> {formatDate(b.startDate)}</div>
                        <div><span className="font-semibold">End:</span> {formatDate(b.endDate)}</div>
                        <div><span className="font-semibold">Total:</span> ₹{b.totalAmount || 0}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {b.status === "booked" && (
                        <button onClick={() => handleCancel(b._id)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">Cancel</button>
                      )}
                      <button onClick={() => handleDelete(b._id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
