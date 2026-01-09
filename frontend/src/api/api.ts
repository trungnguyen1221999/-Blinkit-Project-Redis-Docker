import axios from "axios";

const api = axios.create({
  baseURL: "https://blinkit-clone-d0u0.onrender.com/api",
  timeout: 10000,
  withCredentials: true, // để gửi cookie HttpOnly
});

export default api;
