const generateOTP = () => {
  return Math.floor(Math.random() * 9000) + 1000; // Generates a random 4-digit OTP
};

export default generateOTP;
