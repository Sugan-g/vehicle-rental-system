import { useEffect, useState } from "react";
import API from "../api/api.js";
import VehicleCard from "../components/VehicleCard.jsx";
import DashboardCharts from "../components/DashboardCharts.jsx";

export default function HomePage() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Get logged-in user (for admin check)
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await API.get("/vehicles");
                setVehicles(res.data);
                setFilteredVehicles(res.data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    //  Live search filter
    useEffect(() => {
        const search = searchTerm.toLowerCase();

        const result = vehicles.filter((v) => {
            return (
                (v?.make || "").toLowerCase().includes(search) ||
                (v?.model || "").toLowerCase().includes(search) ||
                (v?.type || "").toLowerCase().includes(search) ||
                (v?.location || "").toLowerCase().includes(search)
            );
        });

        setFilteredVehicles(result);
    }, [searchTerm, vehicles]);

    // Loading UI
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">Loading vehicles...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 mt-15">

            {/* Title + Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Available Vehicles</h1>

                <input
                    type="text"
                    placeholder="Search (make, model, type, location)..."
                    className="w-full md:w-64 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* No results */}
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

            {/*  ADMIN ONLY PIE CHART */}
            {isAdmin && <DashboardCharts />}
        </div>
    );
}
