import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
            <img 
                src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : "/placeholder.jpg"} 
                alt={vehicle.make} 
                className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-bold mt-2">{vehicle.make} {vehicle.model}</h2>
            <p>Year: {vehicle.year}</p>
            <p>Price per day: ₹{vehicle.pricePerDay}</p>
            <p>Location: {vehicle.location}</p>
            <Link to={`/vehicle/${vehicle._id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded">View Details</Link>
        </div>
    );
}
