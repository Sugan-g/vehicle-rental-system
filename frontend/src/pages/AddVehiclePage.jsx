import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddVehiclePage() {
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState(""); // sent as make
    const [year, setYear] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [description, setDescription] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [location, setLocation] = useState(""); // NEW
    const [type, setType] = useState("");         // NEW

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("model", model);
        formData.append("make", brand);
        formData.append("year", year);
        formData.append("pricePerDay", Number(pricePerDay));
        formData.append("description", description);
        formData.append("isAvailable", isAvailable);
        formData.append("location", location); // send location
        formData.append("type", type);         // send type
        if (image) formData.append("image", image);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://vehicle-rental-system-pitf.onrender.com/api/vehicles",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                alert("Vehicle added successfully!");
                navigate("/admin");
            } else {
                alert(result.message || "Error adding vehicle!");
            }
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert("Something went wrong while adding the vehicle.");
        }
    };

    return (
        <div className="mt-24 flex justify-center px-4">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Add New Vehicle
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Model */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Vehicle Model
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Swift, Innova, Creta"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Brand
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Maruti Suzuki"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Year
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 2023"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            min="1900"
                            max={new Date().getFullYear()}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Bangalore"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Type
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Sedan, SUV, Hatchback"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Price Per Day (₹)
                        </label>
                        <input
                            type="number"
                            placeholder="Enter rental cost per day"
                            value={pricePerDay}
                            onChange={(e) => setPricePerDay(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe the vehicle, features, etc..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full p-3 min-h-[120px] rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Availability */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Availability
                        </label>
                        <select
                            value={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.value === "true")}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Upload Vehicle Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-3 rounded-xl border border-gray-300"
                        />

                        {preview && (
                            <div className="mt-4">
                                <img
                                    src={preview}
                                    alt="Vehicle Preview"
                                    className="w-48 h-32 object-cover rounded-xl shadow-md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
                    >
                        Add Vehicle
                    </button>
                </form>
            </div>
        </div>
    );
}
