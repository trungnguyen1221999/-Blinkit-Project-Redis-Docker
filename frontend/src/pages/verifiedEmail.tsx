import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import verifyEmail from "../api/userApi/verifyEmail";

const VerifiedEmail = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(2);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";
  const verifyEmailMutation = useMutation({
    mutationFn: async (id: string) => {
      return await verifyEmail(id);
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);
  useEffect(() => {
    if (id) {
      // Gọi API verify với ID này
      verifyEmailMutation.mutate(id);
    }
  }, [id]);

  const handleRedirectNow = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-primary-200 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <CheckCircle className="w-12 h-12 text-primary-200" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">🎉 Success!</h1>
            <p className=" text-sm">Your email has been verified</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Email Verified Successfully!
              </h2>

              <p className="text-gray-600 leading-relaxed mb-6">
                Congratulations! Your email address has been successfully
                verified. Your account is now fully activated and ready to use.
              </p>

              {/* Success Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center  text-left bg-primary-50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Account activated successfully
                  </span>
                </div>

                <div className="flex items-center  text-left bg-primary-50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Full access to Blinkit features
                  </span>
                </div>

                <div className="flex items-center  text-left bg-primary-50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Ready to start shopping
                  </span>
                </div>
              </div>
            </div>

            {/* Countdown Section */}
            <div className="border-t pt-6">
              <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Redirecting to home page in
                </p>
                <div className="text-3xl font-bold text-secondary-200 mb-2">
                  {countdown}
                </div>
                <p className="text-xs text-gray-500">seconds</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleRedirectNow}
                  className="w-full bg-primary-200 hover:opacity-90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Home className="w-4 h-4" />
                  <span>Go to Home Page Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Go to Login Instead</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Welcome to the{" "}
            <span className="font-semibold text-primary-200">Blinkit</span>{" "}
            family! 🛒
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifiedEmail;
