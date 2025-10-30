import { useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ vehicleId, pricePerDay }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    const handleBooking = async (e) => {
        e.preventDefault();
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const amount = days * pricePerDay;

        try {
            const res = await API.post("/bookings", { vehicle: vehicleId, startDate, endDate, amount });
            alert("Booking created! Check your email for confirmation.");
            navigate("/rental-history");
        } catch (error) {
            console.error(error);
            alert("Booking failed");
        }
    };

    return (
        <form onSubmit={handleBooking} className="bg-white p-4 shadow rounded">
            <label className="block">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 w-full mb-2"/>
            <label className="block">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 w-full mb-2"/>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-2">Book Now</button>
        </form>
    );
}
