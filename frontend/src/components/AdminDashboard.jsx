import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [bookingPage, setBookingPage] = useState(1);
    const [vehiclePage, setVehiclePage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({
        pricePerDay: "",
        year: "",
        description: "",
        location: "",
        type: "",
    });
    const [saving, setSaving] = useState(false);

    // Fetch all data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleRes, bookingRes] = await Promise.all([
                    API.get("/vehicles"),
                    API.get("/bookings?page=1&limit=200"),
                ]);

                setVehicles(vehicleRes.data?.data || []);
                setBookings(bookingRes.data?.data || []);
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
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

    // DELETE VEHICLE ===================================
    const deleteVehicle = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?"))
            return;

        try {
            await API.delete(`/vehicles/${id}`);

            setVehicles((prev) => prev.filter((v) => v._id !== id));

            alert("Vehicle deleted successfully");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete vehicle");
        }
    };

    // OPEN MODAL =======================================
    const openModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            pricePerDay: vehicle.pricePerDay || "",
            year: vehicle.year || "",
            description: vehicle.description || "",
            location: vehicle.location || "",
            type: vehicle.type || "",
        });
    };

    // CLOSE MODAL ======================================
    const closeModal = () => {
        setSelectedVehicle(null);
        setFormData({
            pricePerDay: "",
            year: "",
            description: "",
            location: "",
            type: "",
        });
    };

    // UPDATE VEHICLE ===================================
    const handleUpdate = async () => {
        try {
            setSaving(true);

            await API.put(`/vehicles/${selectedVehicle._id}`, formData);

            setVehicles((prev) =>
                prev.map((v) =>
                    v._id === selectedVehicle._id
                        ? { ...v, ...formData }
                        : v
                )
            );

            closeModal();
        } catch (err) {
            console.error("Update Error:", err);
            alert("Failed to update vehicle");
        } finally {
            setSaving(false);
        }
    };

    // PAGINATION ===========================
    const paginatedBookings = bookings.slice(
        (bookingPage - 1) * ITEMS_PER_PAGE,
        bookingPage * ITEMS_PER_PAGE
    );
    const totalBookingPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

    const paginatedVehicles = vehicles.slice(
        (vehiclePage - 1) * ITEMS_PER_PAGE,
        vehiclePage * ITEMS_PER_PAGE
    );
    const totalVehiclePages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);

    // STATS ===========================================
    const totalRevenue = bookings.reduce((sum, b) => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const amount = b.amount ?? (b.vehicle?.pricePerDay || 0) * days;
        return sum + amount;
    }, 0);

    const totalVehicles = vehicles.length;
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

            {/* ================== VEHICLES SECTION ================== */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Vehicles</h3>

                {vehicles.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No vehicles found.</p>
                ) : (
                    <>
                        <ul className="space-y-3">
                            {paginatedVehicles.map((v) => (
                                <li
                                    key={v._id}
                                    className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center hover:shadow-md"
                                >
                                    <div>
                                        <span className="font-semibold text-gray-800">
                                            {v.make} {v.model}
                                        </span>{" "}
                                        - ₹{v.pricePerDay}/day
                                    </div>

                                    <div className="flex gap-3 mt-2 sm:mt-0">
                                        <button
                                            onClick={() => openModal(v)}
                                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md hover:bg-yellow-600"
                                        >
                                            Manage
                                        </button>

                                        <button
                                            onClick={() => deleteVehicle(v._id)}
                                            className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* VEHICLE PAGINATION */}
                        <div className="flex justify-center mt-6 gap-2">
                            <button
                                disabled={vehiclePage === 1}
                                onClick={() => setVehiclePage(vehiclePage - 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalVehiclePages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setVehiclePage(i + 1)}
                                    className={`px-3 py-1 rounded ${
                                        vehiclePage === i + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={vehiclePage === totalVehiclePages}
                                onClick={() => setVehiclePage(vehiclePage + 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ================== UPDATE MODAL ================== */}
            {selectedVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                                <label className="block text-gray-700 mb-1">Price per Day</label>
                                <input
                                    type="number"
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
                                    value={formData.year}
                                    onChange={(e) =>
                                        setFormData({ ...formData, year: e.target.value })
                                    }
                                    className="w-full border rounded-md p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    className="w-full border rounded-md p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Vehicle Type</label>
                                <input
                                    type="text"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value })
                                    }
                                    className="w-full border rounded-md p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full border rounded-md p-2"
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
