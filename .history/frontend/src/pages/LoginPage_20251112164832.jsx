import { useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // added

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // added

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data && res.data.token && res.data.user) {
        // ✅ Instead of manually setting localStorage, use context
        login(res.data.token, res.data.user.role);

        // Navigate based on role (admin/home)
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        alert("Invalid server response");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";
      alert(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg w-full transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
