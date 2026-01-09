import api from "./../api";

const verifyEmail = async (id: string) => {
  const response = await api.post("/user/verify-successfully", { id });
  return response.data;
};

export default verifyEmail;
