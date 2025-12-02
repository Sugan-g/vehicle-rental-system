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

    // ========================= FETCH VEHICLES =========================
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

    // ========================= IMAGE PREVIEW =========================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // ========================= ADD VEHICLE =========================
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

    // ========================= DELETE VEHICLE =========================
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

    // ========================= UPDATE VEHICLE =========================
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

    // ========================= PAGINATION =========================
    const paginatedVehicles = vehicles.slice(
        (vehiclePage - 1) * ITEMS_PER_PAGE,
        vehiclePage * ITEMS_PER_PAGE
    );
    const totalVehiclePages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);

    if (loading) return <p className="text-center py-16">Loading...</p>;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto mt-28 sm:mt-32">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">
                Vehicle Management
            </h2>

            {/* ================== ADD VEHICLE FORM ================== */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10 max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
                    {selectedVehicle ? "Update Vehicle" : "Add New Vehicle"}
                </h3>

                <form onSubmit={selectedVehicle ? (e) => { e.preventDefault(); handleUpdate(); } : handleAddVehicle} className="space-y-4">
                    <div>
                        <label>Model</label>
                        <input
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Brand</label>
                        <input
                            value={formData.make}
                            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Year</label>
                        <input
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Location</label>
                        <input
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Type</label>
                        <input
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Price per Day</label>
                        <input
                            type="number"
                            value={formData.pricePerDay}
                            onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Availability</label>
                        <select
                            value={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === "true" })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>

                    <div>
                        <label>Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {preview && <img src={preview} className="w-32 mt-2" />}
                    </div>

                    <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
                        {saving ? "Saving..." : selectedVehicle ? "Update Vehicle" : "Add Vehicle"}
                    </button>
                </form>
            </div>

            {/* ================== VEHICLE LIST ================== */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Vehicles List</h3>

                {vehicles.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No vehicles found.</p>
                ) : (
                    <>
                        <ul className="space-y-3">
                            {paginatedVehicles.map((v) => (
                                <li key={v._id} className="border p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <strong>{v.make} {v.model}</strong> - ₹{v.pricePerDay}/day
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => openModal(v)} className="px-2 py-1 bg-yellow-500 text-white rounded">Update</button>
                                        <button onClick={() => deleteVehicle(v._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* VEHICLE PAGINATION */}
                        <div className="flex justify-center mt-4 gap-2">
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
                                    className={`px-3 py-1 rounded ${vehiclePage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
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
        </div>
    );
}
