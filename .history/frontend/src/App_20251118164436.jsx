import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import VehiclePage from "./pages/VehiclePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RentalHistoryPage from "./pages/RentalHistoryPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import EditBooking from "./pages/EditBooking.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// ⭐ ADD THIS IMPORT
import PaymentSuccess from "./pages/PaymentSuccess.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicle/:id" element={<VehiclePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ⭐ ADD THIS ROUTE ONLY */}
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Protected routes (login required) */}
          <Route
            path="/rental-history"
            element={
              <PrivateRoute>
                <RentalHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/book/:vehicleId"
            element={
              <PrivateRoute>
                <BookingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-booking/:id"
            element={
              <PrivateRoute>
                <EditBooking />
              </PrivateRoute>
            }
          />

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
