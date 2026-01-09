import saveUserLocalStorage from "../../ultils/saveUserLocalStorage";
import api from "../api";

const getUserApi = async (userId: string) => {
  try {
    const response = await api.get(`/user/user-info/${userId}`);
    saveUserLocalStorage(response.data.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUserApi;
