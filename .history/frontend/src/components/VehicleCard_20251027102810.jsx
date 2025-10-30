import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            
            {/* Vehicle Image */}
            <img
                src={vehicle.images?.[0] || "/placeholder.jpg"}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-40 sm:h-48 object-cover"
            />

            {/* Vehicle Content */}
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    {vehicle.make} {vehicle.model}
                </h2>

                <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Year:</span> {vehicle.year}</p>
                    <p>
                        <span className="font-medium">Price:</span> 
                        <span className="text-blue-600 font-bold"> ₹{vehicle.pricePerDay}/day</span>
                    </p>
                    <p className="truncate">
                        <span className="font-medium">Location:</span> {vehicle.location}
                    </p>
                </div>

                {/* Button sticks to bottom even if text changes */}
                <div className="mt-auto pt-4">
                    <Link
                        to={`/vehicle/${vehicle._id}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
