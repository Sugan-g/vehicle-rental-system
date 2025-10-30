import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchVehicles(), fetchBookings()]);
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await API.get("/vehicles");
            setVehicles(res.data);
        } catch {
            console.error("Error fetching vehicles");
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await API.get("/bookings");
            setBookings(res.data);
        } catch {
            console.error("Error fetching bookings");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const pending = bookings.filter(b => b.paymentStatus === "Pending").length;
    const completed = bookings.filter(b => b.paymentStatus === "Paid").length;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h2>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                    <h4 className="text-2xl font-bold">{vehicles.length}</h4>
                    <p>Total Vehicles</p>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
                    <h4 className="text-2xl font-bold">{bookings.length}</h4>
                    <p>Total Bookings</p>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md">
                    <h4 className="text-2xl font-bold">₹{totalRevenue}</h4>
                    <p>Total Revenue</p>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-200 text-left">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Vehicle</th>
                            <th className="p-3">Start</th>
                            <th className="p-3">End</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b._id} className="border-b">
                                <td className="p-3">{b?.user?.name || "Unknown"}</td>
                                <td className="p-3">{b?.vehicle?.make} {b?.vehicle?.model}</td>
                                <td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td>
                                <td className="p-3">{new Date(b.endDate).toLocaleDateString()}</td>
                                <td className="p-3">₹{b.amount}</td>
                                <td className={`p-3 font-semibold ${
                                    b.paymentStatus === "Paid" ? "text-green-600" : "text-red-500"
                                }`}>
                                    {b.paymentStatus}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Vehicles</h3>
                <ul className="space-y-3">
                    {vehicles.map(v => (
                        <li key={v._id} className="border p-3 rounded-md flex justify-between items-center">
                            <div>
                                <span className="font-semibold">{v.make} {v.model}</span> - ₹{v.pricePerDay}/day
                            </div>
                            <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600">
                                Manage
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
