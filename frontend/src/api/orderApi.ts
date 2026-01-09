import api from "./api";


export const createAbandonOrderApi = async (orderData: any) => {
  const res = await api.post('/order/abandon', orderData);
  return res.data;
};

export const completeAbandonOrderApi = async (orderData: any) => {
  const res = await api.put('/order/abandon/complete', orderData);
  return res.data;
};


export const createOrderApi = async (orderData: any) => {
  const res = await api.post('/order', orderData);
  return res.data;
};

export const getOrderApi = async (id: string) => {
  const res = await api.get(`/order/${id}`);
  return res.data;
};

export const getOrdersApi = async (params?: { userId?: string; guestId?: string }) => {
  const res = await api.get('/order', { params });
  return res.data;
};
