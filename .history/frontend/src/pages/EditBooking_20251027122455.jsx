import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EditBooking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchBooking = async () => {
        const res = await API.get(`/bookings/${id}`);
        setStartDate(res.data.startDate.split("T")[0]);
        setEndDate(res.data.endDate.split("T")[0]);
    };

    useEffect(() => { fetchBooking(); }, []);

    const handleUpdate = async () => {
        if (!startDate || !endDate) return alert("Select dates");

        try {
            setLoading(true);
            await API.put(`/bookings/${id}`, { startDate, endDate });
            alert("Booking Updated ✅ Email Sent!");
            navigate("/my-bookings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Edit Booking</h1>

            <label className="block mb-1 font-medium">Start Date</label>
            <input type="date" className="border p-2 w-full mb-3"
                value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <label className="block mb-1 font-medium">End Date</label>
            <input type="date" className="border p-2 w-full mb-4"
                value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-blue-600 text-white w-full py-2 rounded-md"
            >
                {loading ? "Updating..." : "Save Changes"}
            </button>
        </div>
    );
}
