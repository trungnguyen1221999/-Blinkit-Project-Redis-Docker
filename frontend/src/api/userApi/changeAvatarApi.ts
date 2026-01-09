import api from "../api";

const changeAvatarApi = async (formData: FormData): Promise<any> => {
  const response = await api.put("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default changeAvatarApi;
