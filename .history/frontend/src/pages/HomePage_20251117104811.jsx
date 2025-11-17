import { useEffect, useState } from "react";
import API from "../api/api.js";
import VehicleCard from "../components/VehicleCard.jsx";

export default function HomePage() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await API.get("/vehicles");
                setVehicles(res.data);
                setFilteredVehicles(res.data); // initial load
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    // 🔍 Safe filtering (prevents undefined errors)
    useEffect(() => {
        const result = vehicles.filter((v) => {
            const name = (v?.name || "").toString().toLowerCase();
            const search = searchTerm.toLowerCase();
            return name.includes(search);
        });

        setFilteredVehicles(result);
    }, [searchTerm, vehicles]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">Loading vehicles...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* 🔍 Search Box */}
            <div className="flex justify-center md:justify-start mb-6">
                <input
                    type="text"
                    placeholder="Search vehicle by name..."
                    className="w-full md:w-64 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
                Available Vehicles
            </h1>

            {/* No results found */}
            {!filteredVehicles.length ? (
                <p className="text-center text-gray-500">No matching vehicles found</p>
            ) : (
                <div
                    className="
                        grid gap-6
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                    "
                >
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                </div>
            )}
        </div>
    );
}
