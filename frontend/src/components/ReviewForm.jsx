import { useState } from "react";
import API from "../api/api.js";

export default function ReviewForm({ vehicleId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/reviews", { vehicle: vehicleId, rating, comment });
            setComment("");
            onReviewAdded();
            alert("Review submitted");
        } catch (error) {
            console.error(error);
            alert("Failed to submit review");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded">
            <label>Rating:</label>
            <select value={rating} onChange={e => setRating(e.target.value)} className="border p-2 w-full mb-2">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <label>Comment:</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} className="border p-2 w-full mb-2"></textarea>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Review</button>
        </form>
    );
}
