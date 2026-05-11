import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/^\"|\"$/g, "") || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;