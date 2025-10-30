import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function BookingPage() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        if (loading) return; 
        if (!startDate || !endDate) return alert("Select dates");

        try {
            setLoading(true);
            await API.post("/bookings", { vehicleId, startDate, endDate });
            alert("Booked Successfully ✅");
            navigate("/my-bookings");
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 pt-24 pb-6 max-w-md mx-auto md:pt-28">
            <h1 className="text-xl font-bold mb-4 text-center">Book Vehicle</h1>

            <label className="block mb-1 font-medium">Start Date</label>
            <input
                type="date"
                className="border p-2 w-full mb-3"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />

            <label className="block mb-1 font-medium">End Date</label>
            <input
                type="date"
                className="border p-2 w-full mb-4"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            <button
                onClick={handleBook}
                disabled={loading}
                className="bg-green-600 text-white w-full py-2 rounded-md"
            >
                {loading ? "Booking..." : "Confirm Booking"}
            </button>
        </div>
    );
}
