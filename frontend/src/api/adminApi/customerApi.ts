import api from "../api";

export const getCustomersApi = async () => {
  const res = await api.get("/customer");
  return res.data;
};
