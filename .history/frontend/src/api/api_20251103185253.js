import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // important when using cookies or auth
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    console.log("Sending token:", token);
    if (token) {
        req.headers.authorization = `Bearer ${token}`; // lowercase key
    }
    return req;
});

export default API;
