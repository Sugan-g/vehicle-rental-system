import { useEffect, useState } from "react";
import API from "../api/api.js";
import VehicleCard from "../components/VehicleCard.jsx";

export default function HomePage() {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            const res = await API.get("/vehicles");
            setVehicles(res.data);
        };
        fetchVehicles();
    }, []);

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map(vehicle => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
        </div>
    );
}
