import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bakra-software-backend.onrender.com/api/",
    withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
