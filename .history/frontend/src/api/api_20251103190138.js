import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

//  Corrected interceptor
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
        console.log("🔸 Sending Token:", token); // 👀 check browser console
    }
    return req;
});

export default API;
