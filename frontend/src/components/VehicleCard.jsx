import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
const backendURL = "[https://vehicle-rental-system-pitf.onrender.com](https://vehicle-rental-system-pitf.onrender.com)";

return ( <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">


  {/* Image */}
  <img
    src={
      vehicle.images?.[0]
        ? `${backendURL}/${vehicle.images[0]}`
        : "/placeholder.jpg"
    }
    alt={`${vehicle.make} ${vehicle.model}`}
    className="w-full h-40 sm:h-48 object-cover"
  />

  {/* Details */}
  <div className="p-4 flex flex-col flex-grow text-gray-800">
    <h2 className="text-lg font-semibold mb-1">
      {vehicle.make} {vehicle.model}
    </h2>

    <p className="text-sm mb-1">
      <span className="font-medium">Year:</span> {vehicle.year}
    </p>

    <p className="text-sm mb-1">
      <span className="font-medium">Type:</span> {vehicle.type}
    </p>

    <p className="text-sm mb-1">
      <span className="font-medium">Location:</span> {vehicle.location}
    </p>

    <p className="text-sm mb-4">
      <span className="font-medium">Price:</span> ₹{vehicle.pricePerDay}/day
    </p>

    <div className="mt-auto">
      {vehicle.available ? (
        <Link
          to={`/book/${vehicle._id}`}
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Book Now
        </Link>
      ) : (
        <button
          disabled
          className="block text-center bg-gray-400 cursor-not-allowed text-white font-medium py-2 rounded-lg transition"
        >
          Not Available
        </button>
      )}
    </div>
  </div>
</div>


);
}
