import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setError("Missing session ID");
            setLoading(false);
            return;
        }

        async function verifyPayment() {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/payments/verify?session_id=${sessionId}`
                );

                setStatus(response.data.paymentStatus);
                setBookingId(response.data.bookingId);
            } catch (err) {
                setError("Payment verification failed");
            } finally {
                setLoading(false);
            }
        }

        verifyPayment();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-xl font-semibold text-gray-700">
                    Verifying your payment...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center mt-20">
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                    Payment Verification Error
                </h2>
                <p className="text-gray-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-20 px-4">
            <h1 className="text-4xl font-bold text-green-600 mb-4">
            </h1>

            <p className="text-lg text-gray-800">
                Status: <span className="font-semibold text-green-700">{status}</span>
            </p>

            <p className="text-lg text-gray-800 mt-1">
                Booking ID: <span className="font-semibold text-blue-700">{bookingId}</span>
            </p>

            <a href="/dashboard" className="mt-6">
                <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition font-medium"
                >
                    Go to Dashboard
                </button>
            </a>
        </div>
    );
}
