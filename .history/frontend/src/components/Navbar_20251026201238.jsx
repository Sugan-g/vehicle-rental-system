import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // For hamburger icons

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
  <nav className="bg-gray-900 text-white px-5 py-4 shadow-md fixed top-0 left-0 w-full z-50">
    <div className="flex justify-between items-center">
      
      <Link to="/" className="text-xl font-bold">
        Vehicle Rental
      </Link>

      {/* Hamburger */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/">Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/rental-history">My Rentals</Link>
            <button onClick={handleLogout} className="hover:text-red-400">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>

    {/* ✅ Mobile Menu Full Width */}
    <div
      className={`md:hidden transition-all duration-300 overflow-hidden ${
        menuOpen ? "max-h-60 mt-3" : "max-h-0"
      }`}
    >
      <div className="bg-gray-800 p-5 rounded-lg flex flex-col space-y-4 text-center">
        <Link to="/" onClick={() => setMenuOpen(false)} className="block">
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/rental-history"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              My Rentals
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-400 font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
);
