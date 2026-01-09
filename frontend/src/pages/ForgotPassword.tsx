import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FaRegEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import forgotPasswordApi, {
  verifyOtpForgotPasswordApi,
} from "../api/userApi/forgotPasswordApi";

// --- Zod schemas ---
const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must be numeric"),
});

// --- Types ---
type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
type OtpInput = z.infer<typeof otpSchema>;

const ForgotPassword = () => {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [emailSent, setEmailSent] = useState("");
  const [timer, setTimer] = useState(120); // 2 phút countdown
  const [resendEnabled, setResendEnabled] = useState(false);

  const navigate = useNavigate();

  // --- Form hooks ---
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
  });

  // --- Countdown ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isOtpOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [isOtpOpen, timer]);

  // --- Submit email ---
  const onSubmitEmail = (data: ForgotPasswordInput) => {
    forgotPasswordApi(data.email)
      .then(() => {
        toast.success("Password reset link sent! Enter OTP.");
        setIsOtpOpen(true);
        setEmailSent(data.email);
        setTimer(120);
        setResendEnabled(false);
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || "Failed to send email.");
      });
  };

  // --- Submit OTP ---
  const onSubmitOtp = (data: OtpInput) => {
    verifyOtpForgotPasswordApi(emailSent, data.otp)
      .then(() => {
        toast.success("OTP verified successfully!");
        setIsOtpOpen(false);
        navigate("/reset-password", { state: { email: emailSent } });
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || "Invalid OTP. Try again.");
      });
  };

  // --- Resend OTP ---
  const handleResend = () => {
    if (!resendEnabled) return;
    forgotPasswordApi(emailSent)
      .then(() => {
        toast.success("OTP resent!");
        setTimer(120);
        setResendEnabled(false);
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || "Failed to resend OTP.");
      });
  };

  // --- Change Email ---
  const handleChangeEmail = () => {
    setIsOtpOpen(false);
    setEmailSent("");
    setTimer(120);
    setResendEnabled(false);
  };

  // --- Format timer mm:ss ---
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center justify-center py-10 md:py-20">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 justify-center mb-6 bg-primary-100 py-2 rounded-md">
          <FaRegEnvelope size={25} />
          <h1 className="text-xl font-semibold">Forgot your password?</h1>
        </div>

        {/* Email Form */}
        {!isOtpOpen && (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmitEmail)}>
            <div>
              <label className="block text-gray-700 mb-1">
                Your email address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm -mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="font-bold w-full bg-primary-200 py-2 rounded-md hover:bg-primary-100 transition-colors cursor-pointer"
            >
              Send
            </button>
          </form>
        )}

        {/* OTP Popup */}
        {isOtpOpen && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Enter the 4-digit OTP sent to{" "}
              <span className="font-semibold">{emailSent}</span>
            </p>
            <form className="space-y-2" onSubmit={handleSubmitOtp(onSubmitOtp)}>
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-200 text-center"
                {...registerOtp("otp")}
                maxLength={4}
                inputMode="numeric"
              />
              {otpErrors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {otpErrors.otp.message}
                </p>
              )}
              <button
                type="submit"
                className="mt-2 w-full bg-primary-200 py-2 rounded-md cursor-pointer hover:bg-primary-100 font-bold transition-colors"
              >
                Verify OTP
              </button>
            </form>

            {/* Countdown + Resend */}
            <div className="text-center mt-2">
              <p className="text-gray-500">Resend OTP in {formatTime(timer)}</p>
              <button
                onClick={handleResend}
                disabled={!resendEnabled}
                className={`mt-2 font-bold py-1 px-3 rounded-md cursor-pointer ${
                  resendEnabled
                    ? "bg-primary-200 hover:bg-primary-100"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Resend OTP
              </button>
            </div>

            {/* Change Email */}
            <div className="text-center mt-2">
              <button
                onClick={handleChangeEmail}
                className="text-sm text-primary-200 hover:underline cursor-pointer"
              >
                Change Email
              </button>
            </div>
          </div>
        )}

        {/* Back to login */}
        <p className="mt-4 text-center text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-primary-200 hover:underline font-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
