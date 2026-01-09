import api from "../api";

export const getRevenueApi = async (params?: { type?: string; startDate?: string; endDate?: string }) => {
  const res = await api.get("/revenue", { params });
  return res.data;
};
