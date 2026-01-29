import axiosInstance from './api';

// Get all notifications
export const getNotificationsApi = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data;
};

// Mark notification as read
export const markNotificationAsReadApi = async (id: string) => {
  const response = await axiosInstance.put(`/notifications/${id}/read`);
  return response.data;
};