import api from "../api";

const deleteUserApi = async (id: string): Promise<void> => {
  const response = await api.delete("/user/admin/delete/" + id);

  return response.data;
};

export default deleteUserApi;
