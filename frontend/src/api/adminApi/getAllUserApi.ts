import api from "../api";

export const getAllUserApi = async () => {
  const response = await api.get("/user/admin/all-users");
  return response.data;
};
