import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Change this if your backend URL is different
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
