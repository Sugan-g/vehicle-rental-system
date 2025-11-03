import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // ✅ allows cookies if used later
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
        console.log("🔸 Token Sent:", token);
    }
    return req;
});

export default API;
