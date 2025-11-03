import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",

});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    console.log("Token sent:", token); // 👀 check console
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default API;
