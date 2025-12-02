import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [bookingPage, setBookingPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // ========================= FETCH BOOKINGS =========================
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await API.get("/bookings?page=1&limit=200");
                setBookings(res.data?.data || []);
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-16 text-gray-600 text-lg">
                Loading Dashboard...
            </div>
        );
    }

    // ========================= PAGINATION =========================
    const paginatedBookings = bookings.slice(
        (bookingPage - 1) * ITEMS_PER_PAGE,
        bookingPage * ITEMS_PER_PAGE
    );
    const totalBookingPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

    // ========================= DASHBOARD STATS =========================
    const totalRevenue = bookings.reduce((sum, b) => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const amount = b.amount ?? (b.vehicle?.pricePerDay || 0) * days;
        return sum + amount;
    }, 0);

    const totalBookings = bookings.length;
    const paidCount = bookings.filter((b) => b.status === "booked").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto mt-28 sm:mt-32">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">
                Admin Dashboard
            </h2>

            {/* ================== STATS ================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-green-600 text-white p-6 rounded-xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">{totalBookings}</h4>
                    <p>Total Bookings</p>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">₹{totalRevenue}</h4>
                    <p>Total Revenue</p>
                </div>

                <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">
                        {paidCount}/{cancelledCount}
                    </h4>
                    <p>Booked / Cancelled</p>
                </div>
            </div>

            {/* ================== BOOKINGS TABLE ================== */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10 overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Bookings</h3>

                {bookings.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No bookings available.</p>
                ) : (
                    <>
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3 text-left">User</th>
                                    <th className="p-3 text-left">Vehicle</th>
                                    <th className="p-3 text-left">Start</th>
                                    <th className="p-3 text-left">End</th>
                                    <th className="p-3 text-left">Amount</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedBookings.map((b) => (
                                    <tr key={b._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{b?.user?.name || "Unknown"}</td>
                                        <td className="p-3">
                                            {b?.vehicle?.make} {b?.vehicle?.model}
                                        </td>
                                        <td className="p-3">
                                            {new Date(b.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            {new Date(b.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 font-medium">
                                            ₹{b.amount ?? b.vehicle?.pricePerDay ?? 0}
                                        </td>
                                        <td
                                            className={`p-3 font-semibold ${
                                                b.status === "booked"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {b.status === "booked" ? "Paid" : "Cancelled"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* BOOKINGS PAGINATION */}
                        <div className="flex justify-center mt-6 gap-2">
                            <button
                                disabled={bookingPage === 1}
                                onClick={() => setBookingPage(bookingPage - 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalBookingPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setBookingPage(i + 1)}
                                    className={`px-3 py-1 rounded ${
                                        bookingPage === i + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={bookingPage === totalBookingPages}
                                onClick={() => setBookingPage(bookingPage + 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
