import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddVehiclePage() {
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [description, setDescription] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);

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

        // 🔥 FormData for image upload
        const formData = new FormData();
        formData.append("model", model);
        formData.append("brand", brand);
        formData.append("pricePerDay", Number(pricePerDay));
        formData.append("description", description);
        formData.append("isAvailable", isAvailable);
        if (image) formData.append("image", image);

        try {
            const response = await fetch(
                "https://vehicle-rental-system-pitf.onrender.com/vehicles",
                {
                    method: "POST",
                    body: formData, // Not JSON! Images need multipart/form-data
                }
            );

            if (response.ok) {
                alert("Vehicle added successfully!");
                navigate("/admin");
            } else {
                alert("Error adding vehicle!");
            }
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert("Failed to add vehicle.");
        }
    };

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4">Add New Vehicle</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Model */}
                <div>
                    <label className="block text-sm font-medium">Model</label>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium">Brand</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium">Price per Day</label>
                    <input
                        type="number"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                        required
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 p-2 border rounded w-full"
                    ></textarea>
                </div>

                {/* Availability */}
                <div>
                    <label className="block text-sm font-medium">Available</label>
                    <select
                        value={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.value === "true")}
                        className="mt-1 p-2 border rounded w-full"
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium">Vehicle Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 p-2 border rounded w-full"
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-3 w-40 rounded-lg shadow"
                        />
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add Vehicle
                </button>
            </form>
        </div>
    );
}
