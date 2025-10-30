import { useEffect, useState } from "react";
import API from "../api/api";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);

    const fetchData = async () => {
        const res = await API.get("/bookings/my");
        setBookings(res.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        await API.put(`/bookings/${id}/cancel`);
        fetchData();
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">My Bookings</h1>

            {bookings.map(b => (
                <div key={b._id} className="border p-4 rounded-lg mb-3">
                    <p><strong>{b.vehicle.make} {b.vehicle.model}</strong></p>
                    <p>From: {new Date(b.startDate).toDateString()}</p>
                    <p>To: {new Date(b.endDate).toDateString()}</p>
                    <p>Status: {b.status}</p>

                    {b.status !== "cancelled" && (
                        <button
                            onClick={() => handleCancel(b._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded mt-3"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
