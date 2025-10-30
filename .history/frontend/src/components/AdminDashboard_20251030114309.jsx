import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, bookingsRes] = await Promise.all([
                    API.get("/vehicles"),
                    API.get("/bookings"),
                ]);
                setVehicles(vehiclesRes.data);
                setBookings(bookingsRes.data);
            } catch (err) {
                console.error("Error loading data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading)
        return (
            <div className="text-center py-20 text-gray-500 text-lg animate-pulse">
                Loading Dashboard...
            </div>
        );

    // ✅ Calculate stats
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalVehicles = vehicles.length;
    const totalBookings = bookings.length;
    const paidBookings = bookings.filter((b) => b.paymentStatus === "Paid").length;
    const cancelledBookings = bookings.filter(
        (b) => b.paymentStatus === "Cancelled"
    ).length;

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
                Admin Dashboard
            </h1>

            {/* ✅ Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">{totalVehicles}</h4>
                    <p className="text-sm mt-1">Total Vehicles</p>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-2xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">{totalBookings}</h4>
                    <p className="text-sm mt-1">Total Bookings</p>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">₹{totalRevenue}</h4>
                    <p className="text-sm mt-1">Total Revenue</p>
                </div>

                <div className="bg-yellow-600 text-white p-6 rounded-2xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">{paidBookings}/{cancelledBookings}</h4>
                    <p className="text-sm mt-1">Paid / Cancelled</p>
                </div>
            </div>

            {/* ✅ Bookings Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 overflow-x-auto">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                    Recent Bookings
                </h2>

                {bookings.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                        No bookings available.
                    </p>
                ) : (
                    <table className="w-full text-sm sm:text-base border-collapse">
                        <thead className="bg-gray-100 text-gray-800">
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
                            {bookings.map((b) => (
                                <tr
                                    key={b._id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3">
                                        {b?.user?.name || "Unknown"}
                                    </td>
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
                                        ₹{b.amount || 0}
                                    </td>
                                    <td
                                        className={`p-3 font-semibold ${
                                            b.paymentStatus === "Paid"
                                                ? "text-green-600"
                                                : b.paymentStatus === "Cancelled"
                                                ? "text-red-500"
                                                : "text-yellow-600"
                                        }`}
                                    >
                                        {b.paymentStatus || "Pending"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ✅ Vehicles Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                    Vehicles List
                </h2>

                {vehicles.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                        No vehicles found.
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {vehicles.map((v) => (
                            <li
                                key={v._id}
                                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex-1 mb-2 sm:mb-0">
                                    <p className="font-semibold text-gray-900">
                                        {v.make} {v.model}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        ₹{v.pricePerDay}/day · {v.location}
                                    </p>
                                </div>
                                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                                    Manage
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
