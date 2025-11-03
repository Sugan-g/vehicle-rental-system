import { useEffect, useState } from "react";
import API from "../api/api.js";

export default function RentalHistoryPage() {
    const [bookings, setBookings] = useState([]);

    

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                My Rentals
            </h2>

            {bookings.length === 0 ? (
                <p className="text-center text-gray-600">
                    No rental history available
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((b) => (
                        <div
                            key={b._id}
                            className="bg-white p-4 shadow-md rounded-lg border hover:shadow-lg transition"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                {b.vehicle.make} {b.vehicle.model}
                            </h3>

                            <p className="text-sm text-gray-700 mt-1">
                                📍 {b.vehicle.location}
                            </p>

                            <div className="mt-2 text-sm text-gray-700">
                                <p>
                                    📅 {new Date(b.startDate).toLocaleDateString()} →{" "}
                                    {new Date(b.endDate).toLocaleDateString()}
                                </p>

                                {/* ✅ Amount fetched from Vehicle document */}
                                <p>💰 ₹{b.vehicle.pricePerDay || "0"}</p>
                            </div>

                            <p
                                className={`mt-2 font-medium ${
                                    b.paymentStatus === "Paid"
                                        ? "text-green-600"
                                        : "text-orange-600"
                                }`}
                            >
                                {b.paymentStatus || "Pending"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}