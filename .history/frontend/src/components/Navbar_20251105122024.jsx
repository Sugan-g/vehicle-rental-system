import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);

  // ✅ Check login + role on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setRole(userRole);
    };

    checkAuth();

    // Handle login/logout changes from other tabs or components
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-5 py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center">
        {/* Logo / Home Link */}
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

          {/* Show Admin link only for admins */}
          {isLoggedIn && role === "admin" && (
            <Link to="/admin" className="font-semibold text-yellow-400">
              Admin Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:text-red-400">
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

      {/* ✅ Mobile Dropdown Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-60 mt-3" : "max-h-0"
        }`}
      >
        <div className="bg-gray-800 p-5 rounded-lg flex flex-col space-y-4 text-center">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link
                to="/rental-history"
                onClick={() => setMenuOpen(false)}
              >
                Rental History
              </Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-yellow-400"
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
