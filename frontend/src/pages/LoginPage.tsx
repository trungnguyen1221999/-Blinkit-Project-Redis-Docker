import { FaRegUserCircle } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import loginApi from "../api/userApi/loginApi";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import getUserApi from "../api/userApi/getUserApi";

type LoginFormInputs = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, setLoading, setIsAuthenticated, user, setUser } = useAuth();
  
  // Get the intended destination from location state
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'trungnguyen1221999@gmail.com',
      password: '123456',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormInputs) => {
      return await loginApi(email, password);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
    },
    onSuccess: () => {
      toast.success("Login successful!");
      navigate(from, { replace: true }); // Redirect to intended page
      setLoading(false);
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data, {
      onSuccess: async (res) => {
        try {
          // 1. Set authenticated
          setIsAuthenticated(true);

          // 2. Lấy user từ server
          const userData = await getUserApi(res.data.id);
          // 3. Lưu user vào context
          setUser(userData.data);
          console.log(user);
          // 4. Navigate to intended destination
          navigate(from, { replace: true });
        } catch (err) {
          console.error("Failed to fetch user after login:", err);
        }
      },
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-200";

  return (
    <div className="flex items-center justify-center py-10 md:py-20">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 justify-center mb-6 bg-primary-100 py-2 rounded-md">
          <FaRegUserCircle size={25} />
          <h1 className="text-xl font-semibold">Login to your account</h1>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={inputClass}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1" htmlFor="password">
              Password
            </label>

            {/* ✅ bọc input + icon trong relative container */}
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={inputClass}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500"
              >
                {showPassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="font-bold w-full bg-primary-200 py-2 rounded-md hover:bg-primary-100 transition-colors cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-3 text-center">
          <Link to="/forgot-password" className="hover:underline font-semibold">
            Forgot password?
          </Link>
        </div>

        {/* Register Link */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary-200 hover:underline font-bold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
