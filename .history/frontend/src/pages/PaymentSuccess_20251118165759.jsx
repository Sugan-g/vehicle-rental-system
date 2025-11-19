import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return <h2>Verifying payment...</h2>;
  }

  return (
    <div className="flex flex-col items-center p-10 mt-15">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful!
      </h1>

      <p className="mt-3">Your Stripe Session ID:</p>
      <code className="mt-1 bg-gray-100 p-2 rounded">
        {sessionId}
      </code>

      <Link
        to="/"
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded shadow"
      >
        Go Home
      </Link>
    </div>
  );
}
