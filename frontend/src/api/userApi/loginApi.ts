import api from "../api";

const loginApi = async (email: string, password: string) => {
  const response = await api.post("/user/login", { email, password });
  return response.data;
};

export default loginApi;
