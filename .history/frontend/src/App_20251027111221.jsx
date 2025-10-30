import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import VehiclePage from "./pages/VehiclePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RentalHistoryPage from "./pages/RentalHistoryPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/vehicle/:id" element={<VehiclePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/rental-history" element={<RentalHistoryPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/book/:vehicleId" element={<BookingPage />} />
                <Route path="/my-bookings" element={<MyBookings />} />

            </Routes>
        </Router>
    );
}

export default App;
