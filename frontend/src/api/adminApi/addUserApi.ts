import api from "../api";

const addUserApi = async (userData: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
}) => {
  const response = await api.post("/user/admin/add-user", userData);
  return response.data;
};

export default addUserApi;
