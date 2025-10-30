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
    <nav className="bg-gray-800 text-white px-5 py-4 shadow-md">
      <div className="flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Vehicle Rental
        </Link>

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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 bg-gray-700 p-4 rounded-lg text-center">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/rental-history" onClick={() => setMenuOpen(false)}>
                My Rentals
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-red-300"
              >
                Logout
              </button>
            </>
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
      )}
    </nav>
  );
}
