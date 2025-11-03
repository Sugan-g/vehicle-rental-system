import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Automatically attach token for every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token"); // make sure you stored it at login
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("⚠️ No token found in localStorage");
    }
    return req;
});

export default API;
