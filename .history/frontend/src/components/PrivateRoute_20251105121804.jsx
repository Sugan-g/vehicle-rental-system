// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Redirect to login if not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
