import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingPage, setBookingPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

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

    const paginatedBookings = bookings.slice(
        (bookingPage - 1) * ITEMS_PER_PAGE,
        bookingPage * ITEMS_PER_PAGE
    );
    const totalBookingPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

    // Dashboard Stats
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
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20 sm:mt-24">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900 text-center">
                Admin Dashboard
            </h2>

            {/* ================== STATS CARDS ================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                    <h4 className="text-3xl font-bold">{totalBookings}</h4>
                    <p className="mt-1 text-sm">Total Bookings</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                    <h4 className="text-3xl font-bold">₹{totalRevenue}</h4>
                    <p className="mt-1 text-sm">Total Revenue</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                    <h4 className="text-3xl font-bold">{paidCount}</h4>
                    <p className="mt-1 text-sm">Paid Bookings</p>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                    <h4 className="text-3xl font-bold">{cancelledCount}</h4>
                    <p className="mt-1 text-sm">Cancelled Bookings</p>
                </div>
            </div>

            {/* ================== BOOKINGS TABLE ================== */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 overflow-x-auto">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Recent Bookings</h3>

                {bookings.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No bookings available.</p>
                ) : (
                    <>
                        <table className="min-w-full border-collapse text-sm">
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
                                    <tr key={b._id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-3">{b?.user?.name || "Unknown"}</td>
                                        <td className="p-3">{b?.vehicle?.make} {b?.vehicle?.model}</td>
                                        <td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td>
                                        <td className="p-3">{new Date(b.endDate).toLocaleDateString()}</td>
                                        <td className="p-3 font-medium">₹{b.amount ?? b.vehicle?.pricePerDay ?? 0}</td>
                                        <td className={`p-3 font-semibold ${b.status === "booked" ? "text-green-600" : "text-red-600"}`}>
                                            {b.status === "booked" ? "Paid" : "Cancelled"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PAGINATION */}
                        <div className="flex justify-center mt-6 gap-2 flex-wrap">
                            <button
                                disabled={bookingPage === 1}
                                onClick={() => setBookingPage(bookingPage - 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalBookingPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setBookingPage(i + 1)}
                                    className={`px-3 py-1 rounded ${bookingPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={bookingPage === totalBookingPages}
                                onClick={() => setBookingPage(bookingPage + 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
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
