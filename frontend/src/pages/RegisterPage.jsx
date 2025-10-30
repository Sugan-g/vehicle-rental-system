import { useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/register", { name, email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto mt-10 bg-white shadow rounded">
            <h2 className="text-2xl mb-4">Register</h2>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-2"/>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-2"/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full mb-2"/>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
        </form>
    );
}
