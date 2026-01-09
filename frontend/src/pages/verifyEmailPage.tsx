import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Mail, RefreshCw, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import resendVerifyEmail from "../api/userApi/resendVerifyEmail";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const registeredEmail = queryClient.getQueryData<string>(["register_email"]);

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const resendEmailMutation = useMutation({
    mutationFn: async (email: string) => await resendVerifyEmail(email),
    onMutate: () => setIsResending(true),
    onSuccess: () => {
      setIsResending(false);
      setResendSuccess(true);
      setCountdown(30);
      setTimeout(() => setResendSuccess(false), 3000);
      toast.success(`Verification email resent to ${registeredEmail}`);
    },
    onError: () => setIsResending(false),
  });

  const handleClick = () => {
    if (registeredEmail && countdown === 0) {
      resendEmailMutation.mutate(registeredEmail);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary-200 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail className="w-10 h-10 text-secondary-200" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-blue-100 text-sm">
              We're almost done setting up your account
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Steps & Info */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Check Your Inbox
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We've sent a verification link to your email address. Please
                check your inbox and click on the link to verify your email and
                complete your registration.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-left bg-gray-50 rounded-lg p-3">
                  <div className="w-6 h-6 bg-secondary-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Check your email inbox
                  </span>
                </div>
                <div className="flex items-center text-left bg-gray-50 rounded-lg p-3">
                  <div className="w-6 h-6 bg-secondary-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Click the verification link
                  </span>
                </div>
                <div className="flex items-center text-left bg-gray-50 rounded-lg p-3">
                  <div className="w-6 h-6 bg-secondary-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Start using Blinkeyit
                  </span>
                </div>
              </div>
            </div>

            {/* Resend Section */}
            <div className="border-t pt-6 space-y-3">
              <p className="text-sm text-gray-500 mb-4 text-center">
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                onClick={handleClick}
                disabled={isResending || countdown > 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  resendSuccess
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-primary-200 hover:opacity-90 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                } ${
                  isResending || countdown > 0
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {resendSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Email Sent Successfully!</span>
                  </>
                ) : isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : countdown > 0 ? (
                  <span>Resend available in {countdown}s</span>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Email</span>
                  </>
                )}
              </button>

              {/* Go Back to Register */}
              <button
                onClick={() => navigate("/register")}
                className="w-full mt-2 py-2 px-4 cursor-pointer rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Go back to Register
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? Contact our{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
