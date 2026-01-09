import api from "../api";

const logoutApi = async () => {
  const response = await api.post(
    "/user/logout",
    {},
    { withCredentials: true }
  );
  return response.data;
};
export default logoutApi;
