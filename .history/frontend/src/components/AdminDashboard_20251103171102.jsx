import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({ pricePerDay: "", year: "", description: "" });
    const [saving, setSaving] = useState(false);

    // Fetch data for dashboard
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

    // Dashboard stats
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalVehicles = vehicles.length;
    const totalBookings = bookings.length;
    const paidCount = bookings.filter((b) => b.status === "booked").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

    // Modal open
    const openModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            pricePerDay: vehicle.pricePerDay || "",
            year: vehicle.year || "",
            description: vehicle.description || "",
        });
    };

    // Modal close
    const closeModal = () => {
        setSelectedVehicle(null);
        setFormData({ pricePerDay: "", year: "", description: "" });
    };

    // Update vehicle
    const handleUpdate = async () => {
        try {
            setSaving(true);
            await API.put(`/vehicles/${selectedVehicle._id}`, formData);
            setVehicles((prev) =>
                prev.map((v) =>
                    v._id === selectedVehicle._id ? { ...v, ...formData } : v
                )
            );
            closeModal();
        } catch (error) {
            console.error("Error updating vehicle:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto mt-28 sm:mt-32">
            {/* Header */}
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">
                Admin Dashboard
            </h2>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md text-center">
                    <h4 className="text-3xl font-bold">{totalVehicles}</h4>
                    <p>Total Vehicles</p>
                </div>
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
                                    <td className="p-3">
                                        {new Date(b.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        {new Date(b.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 font-medium text-gray-700">
                                        ₹{b.amount ?? b.vehicle?.pricePerDay ?? 0}
                                    </td>
                                    <td
                                        className={`p-3 font-semibold ${
                                            b.status === "booked" ? "text-green-600" : "text-red-500"
                                        }`}
                                    >
                                        {b.status === "booked" ? "Paid" : "Cancelled"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Vehicles Table */}
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
                                    onClick={() => openModal(v)}
                                    className="mt-2 sm:mt-0 bg-yellow-500 text-white px-4 py-1.5 rounded-md hover:bg-yellow-600 transition"
                                >
                                    Manage
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Manage Modal */}
            {selectedVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-center">
                            Manage Vehicle
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-gray-700 mb-1">Price per Day (₹)</label>
                                <input
                                    type="number"
                                    name="pricePerDay"
                                    value={formData.pricePerDay}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pricePerDay: e.target.value })
                                    }
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Year</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={(e) =>
                                        setFormData({ ...formData, year: e.target.value })
                                    }
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full border rounded-md p-2"
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className={`px-4 py-2 rounded-md text-white ${
                                        saving
                                            ? "bg-yellow-300 cursor-not-allowed"
                                            : "bg-yellow-500 hover:bg-yellow-600"
                                    }`}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
