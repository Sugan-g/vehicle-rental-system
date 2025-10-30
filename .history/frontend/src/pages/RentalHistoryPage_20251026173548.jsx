import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function RentalHistoryPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const res = await API.get("/bookings/my");
            setBookings(res.data);
        };
        fetchBookings();
    }, []);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">My Rentals</h2>
            <ul>
                {bookings.map(b => (
                    <li key={b._id}>
                        {b.vehicle.make} {b.vehicle.model} from {new Date(b.startDate).toDateString()} to {new Date(b.endDate).toDateString()} - ₹{b.amount} - {b.paymentStatus}
                    </li>
                ))}
            </ul>
        </div>
    );
}
