
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // if not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // else, render the protected component
  return children;
}
