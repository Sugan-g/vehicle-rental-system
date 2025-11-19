import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="p-10 text-center mt-15">
      <h1 className="text-3xl font-bold text-red-600">
         Payment Cancelled
      </h1>

      <p className="mt-3 text-gray-700">
        Your payment was not completed. You can try again anytime.
      </p>

      <Link
        to="/my-bookings"
        className="mt-6 inline-block px-6 py-2 rounded bg-blue-600 text-white"
      >
        Go Back to My Bookings
      </Link>
    </div>
  );
}
