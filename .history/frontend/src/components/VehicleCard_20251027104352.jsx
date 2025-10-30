import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl 
                        transition-all duration-300 overflow-hidden 
                        flex flex-col h-full">

            {/* Vehicle Image */}
            <img
                src={vehicle.images?.[0] || "/placeholder.jpg"}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-44 sm:h-48 lg:h-56 object-cover"
            />

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-grow text-gray-800">

                <h2 className="text-base sm:text-lg font-semibold leading-tight mb-2">
                    {vehicle.make} {vehicle.model}
                </h2>

                <div className="space-y-1 text-sm">
                    <p>
                        <span className="font-medium">Year:</span> {vehicle.year}
                    </p>

                    <p>
                        <span className="font-medium">Price:</span> 
                        <span className="text-blue-600 font-bold"> ₹{vehicle.pricePerDay}/day</span>
                    </p>

                    <p className="truncate">
                        <span className="font-medium">Location:</span> {vehicle.location}
                    </p>
                </div>

                {/* Button pinned bottom even if text is short */}
                <div className="mt-auto pt-4">
                    <Link
                        to={`/vehicle/${vehicle._id}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 
                                   text-white text-center py-2 rounded-lg 
                                   font-medium transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
