import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleRes, bookingRes] = await Promise.all([
                    API.get("/vehicles"),
                    API.get("/bookings"),
                ]);
                setVehicles(vehicleRes.data);
                setBookings(bookingRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-16 text-gray-600 text-lg">
                Loading Dashboard...
            </div>
        );
    }

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalVehicles = vehicles.length;
    const totalBookings = bookings.length;
    const paidCount = bookings.filter((b) => b.paymentStatus === "Paid").length;
    const cancelledCount = bookings.filter((b) => b.paymentStatus === "Cancelled").length;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto mt-28 sm:mt-32">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">
                Admin Dashboard
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard color="blue" value={totalVehicles} label="Total Vehicles" />
                <StatCard color="green" value={totalBookings} label="Total Bookings" />
                <StatCard color="purple" value={`₹${totalRevenue}`} label="Total Revenue" />
                <StatCard color="yellow" value={`${paidCount}/${cancelledCount}`} label="Paid / Cancelled" />
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10 overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Recent Bookings
                </h3>
                {bookings.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No bookings available.</p>
                ) : (
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
                            {bookings.map((b) => (
                                <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">{b?.user?.name || "Unknown"}</td>
                                    <td className="p-3">
                                        {b?.vehicle?.make} {b?.vehicle?.model}
                                    </td>
                                    <td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td>
                                    <td className="p-3">{new Date(b.endDate).toLocaleDateString()}</td>
                                    <td className="p-3 font-medium text-gray-700">
                                        ₹{b.amount ?? b.vehicle?.pricePerDay ?? 0}
                                    </td>
                                    <td
                                        className={`p-3 font-semibold ${
                                            b.status === "booked" ? "text-green-600" : "text-red-500"
                                        }`}
                                    >
                                        {b.paymentStatus || (b.status === "booked" ? "Paid" : "Cancelled")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Vehicles Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Vehicles</h3>

                {vehicles.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No vehicles found.</p>
                ) : (
                    <ul className="space-y-3">
                        {vehicles.map((v) => (
                            <li
                                key={v._id}
                                className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center hover:shadow-md transition"
                            >
                                <div>
                                    <span className="font-semibold text-gray-800">
                                        {v.make} {v.model}
                                    </span>{" "}
                                    - ₹{v.pricePerDay}/day
                                </div>
                                <button
                                    onClick={() => setSelectedVehicle(v)}
                                    className="mt-2 sm:mt-0 bg-yellow-500 text-white px-4 py-1.5 rounded-md hover:bg-yellow-600 transition"
                                >
                                    Manage
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Responsive Modal */}
            {selectedVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
                        <button
                            onClick={() => setSelectedVehicle(null)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                            {selectedVehicle.make} {selectedVehicle.model}
                        </h3>

                        <div className="space-y-2 text-gray-700 text-sm sm:text-base">
                            <p><strong>Price per day:</strong> ₹{selectedVehicle.pricePerDay}</p>
                            <p><strong>Fuel Type:</strong> {selectedVehicle.fuelType || "N/A"}</p>
                            <p><strong>Transmission:</strong> {selectedVehicle.transmission || "N/A"}</p>
                            <p><strong>Availability:</strong> {selectedVehicle.available ? "Available" : "Not Available"}</p>
                            <p><strong>Description:</strong> {selectedVehicle.description || "No description"}</p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                Edit
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                                Delete
                            </button>
                            <button
                                onClick={() => setSelectedVehicle(null)}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple stat card component
function StatCard({ color, value, label }) {
    const colorMap = {
        blue: "bg-blue-600",
        green: "bg-green-600",
        purple: "bg-purple-600",
        yellow: "bg-yellow-500",
    };
    return (
        <div className={`${colorMap[color]} text-white p-6 rounded-xl shadow-md text-center`}>
            <h4 className="text-3xl font-bold">{value}</h4>
            <p>{label}</p>
        </div>
    );
}
