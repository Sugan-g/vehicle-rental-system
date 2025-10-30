import { useEffect, useState } from "react";
import API from "../api/api.js";
import VehicleCard from "../components/VehicleCard.jsx";

export default function HomePage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await API.get("/vehicles");
                setVehicles(res.data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">Loading vehicles...</p>
            </div>
        );
    }

    if (!vehicles.length) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">No vehicles available</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
                Available Vehicles
            </h1>

            <div className="
                grid gap-6
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            ">
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
            </div>
        </div>
    );
}
