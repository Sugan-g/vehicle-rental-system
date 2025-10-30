import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <nav className="bg-gray-800 p-4 text-white flex justify-between">
            <Link to="/" className="text-xl font-bold">Vehicle Rental</Link>
            <div className="space-x-4">
                <Link to="/">Home</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/rental-history">My Rentals</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
