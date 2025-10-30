import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api.js";
import BookingForm from "../components/BookingForm.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

export default function VehiclePage() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        const res = await API.get(`/reviews/${id}`);
        setReviews(res.data);
    };

    useEffect(() => {
        const fetchVehicle = async () => {
            const res = await API.get(`/vehicles/${id}`);
            setVehicle(res.data);
        };
        fetchVehicle();
        fetchReviews();
    }, [id]);

    if (!vehicle) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{vehicle.make} {vehicle.model}</h1>
            <p>Year: {vehicle.year}</p>
            <p>Price/day: ₹{vehicle.pricePerDay}</p>
            <p>Location: {vehicle.location}</p>

            <BookingForm vehicleId={vehicle._id} pricePerDay={vehicle.pricePerDay} />

            <h2 className="text-xl font-bold mt-4">Reviews</h2>
            <ReviewForm vehicleId={vehicle._id} onReviewAdded={fetchReviews} />
            <ul>
                {reviews.map(r => (
                    <li key={r._id}>
                        <strong>{r.user.name}:</strong> {r.rating}/5 - {r.comment}
                    </li>
                ))}
            </ul>
        </div>
    );
}
