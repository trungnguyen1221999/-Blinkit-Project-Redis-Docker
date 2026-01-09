import api from "../api";

const editUserApi = async (userId: string, userData: any) => {
  const response = await api.put(`/user/admin/edit/${userId}`, userData);
  return response.data;
};

export default editUserApi;
