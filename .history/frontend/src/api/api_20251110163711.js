import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:5000/api" // local backend for dev
            : "https://vehicle-rental-system-pitf.onrender.com/api", // deployed backend (Render)
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

//  Attach token if exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
