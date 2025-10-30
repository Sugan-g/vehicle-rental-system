import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
            <img
                src={vehicle.images?.length > 0 ? vehicle.images[0] : "/placeholder.jpg"}
                alt={vehicle.make}
                className="w-full h-48 object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg md:text-xl font-semibold mb-1">
                    {vehicle.make} {vehicle.model}
                </h2>

                <p className="text-gray-600 text-sm md:text-base">
                    Year: {vehicle.year}
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                    Price per day: <span className="font-semibold text-blue-600">₹{vehicle.pricePerDay}</span>
                </p>
                <p className="text-gray-600 text-sm md:text-base mb-3 truncate">
                    Location: {vehicle.location}
                </p>

                <Link 
                    to={`/vehicle/${vehicle._id}`} 
                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
