import { useEffect, useState } from "react";
import API from "../api/api";

export default function AddVehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vehiclePage, setVehiclePage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const [formData, setFormData] = useState({
        model: "",
        make: "",
        year: "",
        pricePerDay: "",
        description: "",
        location: "",
        type: "",
        isAvailable: true,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await API.get("/vehicles");
                setVehicles(res.data?.data || []);
            } catch (err) {
                console.error("Fetch vehicles error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setSaving(true);

        const fd = new FormData();
        Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
        if (image) fd.append("image", image);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                "https://vehicle-rental-system-pitf.onrender.com/api/vehicles",
                { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }
            );
            const result = await res.json();

            if (res.ok && result.success) {
                setVehicles((prev) => [...prev, result.data]);
                alert("Vehicle added successfully!");
                setFormData({
                    model: "",
                    make: "",
                    year: "",
                    pricePerDay: "",
                    description: "",
                    location: "",
                    type: "",
                    isAvailable: true,
                });
                setImage(null);
                setPreview("");
            } else {
                alert(result.message || "Failed to add vehicle");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding vehicle");
        } finally {
            setSaving(false);
        }
    };

    const deleteVehicle = async (id) => {
        if (!window.confirm("Are you sure to delete this vehicle?")) return;
        try {
            await API.delete(`/vehicles/${id}`);
            setVehicles((prev) => prev.filter((v) => v._id !== id));
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    const openModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            model: vehicle.model,
            make: vehicle.make,
            year: vehicle.year,
            pricePerDay: vehicle.pricePerDay,
            description: vehicle.description,
            location: vehicle.location,
            type: vehicle.type,
            isAvailable: vehicle.isAvailable,
        });
        setPreview(vehicle.image || "");
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
            if (image) fd.append("image", image);

            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://vehicle-rental-system-pitf.onrender.com/api/vehicles/${selectedVehicle._id}`,
                { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: fd }
            );
            const result = await res.json();

            if (res.ok && result.success) {
                setVehicles((prev) =>
                    prev.map((v) => (v._id === selectedVehicle._id ? result.data : v))
                );
                setSelectedVehicle(null);
                setFormData({
                    model: "",
                    make: "",
                    year: "",
                    pricePerDay: "",
                    description: "",
                    location: "",
                    type: "",
                    isAvailable: true,
                });
                setImage(null);
                setPreview("");
            } else {
                alert(result.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating vehicle");
        } finally {
            setSaving(false);
        }
    };

    const paginatedVehicles = vehicles.slice(
        (vehiclePage - 1) * ITEMS_PER_PAGE,
        vehiclePage * ITEMS_PER_PAGE
    );
    const totalVehiclePages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);

    if (loading) return <p className="text-center py-16 text-gray-600">Loading...</p>;

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20 sm:mt-24">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
                Vehicle Management
            </h2>

            {/* ADD VEHICLE FORM */}
            <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 mb-10 max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    {selectedVehicle ? "Update Vehicle" : "Add New Vehicle"}
                </h3>

                <form
                    onSubmit={selectedVehicle ? (e) => { e.preventDefault(); handleUpdate(); } : handleAddVehicle}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Model</label>
                        <input
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Brand</label>
                        <input
                            value={formData.make}
                            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Year</label>
                        <input
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Location</label>
                        <input
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Type</label>
                        <input
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Price per Day</label>
                        <input
                            type="number"
                            value={formData.pricePerDay}
                            onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className="mb-1 font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Availability</label>
                        <select
                            value={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === "true" })}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {preview && <img src={preview} className="w-32 h-32 object-cover mt-2 rounded-md border" />}
                    </div>

                    <div className="sm:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {saving ? "Saving..." : selectedVehicle ? "Update Vehicle" : "Add Vehicle"}
                        </button>
                    </div>
                </form>
            </div>

            {/* VEHICLE LIST */}
            <div className="bg-white shadow-md rounded-xl p-6 sm:p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Vehicles List</h3>

                {vehicles.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No vehicles found.</p>
                ) : (
                    <>
                        <ul className="space-y-4">
                            {paginatedVehicles.map((v) => (
                                <li key={v._id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                    <div className="flex items-center gap-4">
                                        {v.image && <img src={v.image} className="w-16 h-16 object-cover rounded-md border" />}
                                        <div>
                                            <p className="font-medium text-gray-800">{v.make} {v.model}</p>
                                            <p className="text-gray-600 text-sm">₹{v.pricePerDay}/day</p>
                                            <p className="text-gray-500 text-sm">{v.type} - {v.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        <button onClick={() => openModal(v)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">Update</button>
                                        <button onClick={() => deleteVehicle(v._id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* PAGINATION */}
                        <div className="flex justify-center mt-6 gap-2 flex-wrap">
                            <button
                                disabled={vehiclePage === 1}
                                onClick={() => setVehiclePage(vehiclePage - 1)}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalVehiclePages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setVehiclePage(i + 1)}
                                    className={`px-3 py-1 rounded ${vehiclePage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={vehiclePage === totalVehiclePages}
                                onClick={() => setVehiclePage(vehiclePage + 1)}
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
