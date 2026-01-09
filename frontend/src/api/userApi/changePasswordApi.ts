import api from "../api";

const changePasswordApi = async (
  _id: string,
  currentPassword: string,
  newPassword: string
) => {
  const response = await api.put(`/user/change-password`, {
    _id,
    currentPassword,
    newPassword,
  });
  return response.data;
};

export default changePasswordApi;
