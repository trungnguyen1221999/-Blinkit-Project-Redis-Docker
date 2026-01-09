import api from "../api";

const resendVerifyEmail = async (registeredEmail:string) => {
  const response = await api.post(
    "/user/resend-verification-email",
   { email: registeredEmail }
  );
  return response.data;
};

export default resendVerifyEmail;
