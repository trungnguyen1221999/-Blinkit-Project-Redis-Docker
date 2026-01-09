import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../api/userApi/forgotPasswordApi";

// --- Zod schema ---
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// --- Types ---
type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// --- Component ---
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email: string } | "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      if (typeof state !== "string") {
        await resetPasswordApi({
          email: state.email,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        });
        // TODO: gọi API reset password
        console.log("Reset password data:", data);

        toast.success("Password reset successfully!");
        navigate("/login"); // điều hướng về trang login
      } else {
        throw new Error("Invalid email state");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-200";

  return (
    <div className="flex items-center justify-center py-10 md:py-20">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 md:p-10">
        <h1 className="text-xl font-semibold text-center mb-6">
          Reset Password
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className={inputClass}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className={inputClass}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="font-bold w-full bg-primary-200 py-2 rounded-md hover:bg-primary-100 transition-colors cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
