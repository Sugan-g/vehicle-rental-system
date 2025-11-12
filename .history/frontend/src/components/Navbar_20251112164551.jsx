import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // Import context

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useAuth(); //  Use context
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); //  Call context logout
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-5 py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Vehicle Rental
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/">Home</Link>

          {isLoggedIn && (
            <>
              <Link to="/my-bookings">My Bookings</Link>
              <Link to="/rental-history">Rental History</Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link to="/admin" className="text-yellow-400 font-semibold">
              Admin Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-80 mt-3" : "max-h-0"
        }`}
      >
        <div className="bg-gray-800 p-5 rounded-lg flex flex-col space-y-4 text-center">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
              <Link to="/rental-history" onClick={() => setMenuOpen(false)}>
                Rental History
              </Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-yellow-400 font-semibold"
            >
              Admin Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-400 font-semibold"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
