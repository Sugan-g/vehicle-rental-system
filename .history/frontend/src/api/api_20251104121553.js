import axios from "axios";

const API = axios.create({
    // baseURL: "https://vehicle-rental-system-pitf.onrender.com/api",
    baseURL: "https://vehicle-rental-system-pitf.onrender.com/api",
    withCredentials: true, // allows cookies if used later
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
