import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">

            {/* Vehicle Image */}
            <div className="w-full">
                <img
                    src={vehicle.images?.[0] || "/placeholder.jpg"}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-40 sm:h-44 lg:h-48 object-cover"
                />
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-5 flex flex-col flex-grow text-gray-800 min-h-[180px]">

                <h2 className="text-base sm:text-lg font-semibold leading-tight mb-2">
                    {vehicle.make} {vehicle.model}
                </h2>

                <p className="text-sm">
                    <span className="font-medium">Year:</span> {vehicle.year}
                </p>

                <p className="text-sm mt-1">
                    <span className="font-medium">Price:</span>
                    <span className="text-blue-600 font-bold"> ₹{vehicle.pricePerDay}/day</span>
                </p>

                <p className="text-sm truncate mt-1">
                    <span className="font-medium">Location:</span> {vehicle.location}
                </p>

                {/* Button pinned bottom */}
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
