import api from "../api";

type registerUserType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const registerApi = async (user: registerUserType) => {
  const response = await api.post("/user/register", {
    name: user.name,
    email: user.email,
    password: user.password,
  });
  return response.data;
};

export default registerApi;
