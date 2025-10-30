import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchVehicles();
        fetchBookings();
    }, []);

    const fetchVehicles = async () => {
        const res = await API.get("/vehicles");
        setVehicles(res.data);
    };

    const fetchBookings = async () => {
        const res = await API.get("/bookings");
        setBookings(res.data);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

            <h3 className="text-xl font-bold mt-4">Vehicles</h3>
            <ul>
                {vehicles.map(v => <li key={v._id}>{v.make} {v.model} - ₹{v.pricePerDay}/day</li>)}
            </ul>

            <h3 className="text-xl font-bold mt-4">Bookings</h3>
            <ul>
                {bookings.map(b => <li key={b._id}>{b.user.name} booked {b.vehicle.make} {b.vehicle.model} from {new Date(b.startDate).toDateString()} to {new Date(b.endDate).toDateString()}</li>)}
            </ul>
        </div>
    );
}
