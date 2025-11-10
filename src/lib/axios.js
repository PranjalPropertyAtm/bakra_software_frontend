import axios from "axios";

const axiosInstance = axios.create({
   baseURL: "https://bakra-software-backend.onrender.com/api/",
 // baseURL: "http://localhost:3000/api/",
  // baseURL : import.meta.env.VITE_API_URL/api/,
    withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
