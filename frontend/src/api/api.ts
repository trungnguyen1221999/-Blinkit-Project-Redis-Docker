import axios from "axios";

const api = axios.create({
  baseURL: "http://103.82.24.142:5000/api", 
  timeout: 10000,
  withCredentials: true, // để gửi cookie HttpOnly
});

export default api;
