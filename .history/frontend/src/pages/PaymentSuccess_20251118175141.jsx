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
        return <h2>Verifying your payment...</h2>;
    }

    if (error) {
        return (
            <div>
                <h2>Payment Verification Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Payment Successful 🎉</h1>

            <p>Status: <strong>{status}</strong></p>
            <p>Booking ID: <strong>{bookingId}</strong></p>

            <a href="/dashboard">
                <button
                    style={{
                        padding: "10px 20px",
                        marginTop: "20px",
                        background: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Go to Dashboard
                </button>
            </a>
        </div>
    );
}
