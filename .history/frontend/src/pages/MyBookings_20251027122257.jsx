import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        try {
            await API.put(`/bookings/${id}/cancel`);
            alert("Booking cancelled ✅ Email sent!");
            fetchData();
        } catch (error) {
            alert("Error cancelling booking");
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center">My Bookings</h1>

            {bookings.length === 0 && <p>No bookings found.</p>}

            {bookings.map(b => (
                <div key={b._id} className="border p-4 rounded-lg mb-3 shadow-sm bg-white">
                    <p className="font-semibold text-lg">
                        {b.vehicle.make} {b.vehicle.model}
                    </p>

                    <p>From: {new Date(b.startDate).toDateString()}</p>
                    <p>To: {new Date(b.endDate).toDateString()}</p>

                    <p className={`font-medium ${b.status === "cancelled" ? "text-red-600" : "text-green-600"}`}>
                        Status: {b.status}
                    </p>

                    <div className="flex gap-3 mt-3">
                        {b.status !== "cancelled" && (
                            <>
                                <Link
                                    to={`/edit-booking/${b._id}`}
                                    className="bg-blue-600 text-white px-3 py-1 rounded w-full text-center"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleCancel(b._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded w-full"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
