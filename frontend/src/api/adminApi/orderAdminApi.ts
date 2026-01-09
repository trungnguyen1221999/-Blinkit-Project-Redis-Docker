import api from "../api";

export const getOrdersAdminApi = async (params?: { type?: string; startDate?: string; endDate?: string }) => {
  const res = await api.get("/order", { params });
  return res.data;
};
