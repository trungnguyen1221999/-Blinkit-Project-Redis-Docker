import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import changePasswordApi from "../api/userApi/changePasswordApi";
import { useAuth } from "../Context/AuthContext";
import { Lock, Key, Shield, CheckCircle } from "lucide-react";

type ChangePasswordFormInputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormInputs>({
    resolver: zodResolver(changePasswordSchema),
  });
  const changePasswordMutation = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await changePasswordApi(user?._id || "", currentPassword, newPassword);
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      setUser({ ...user, passwordChangedAt: new Date() } as any);
      reset();
      console.log(user);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    },
  });
  const onSubmit = async (data: ChangePasswordFormInputs) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const inputClass =
    "w-full border-2 border-slate-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-primary-200/20 focus:border-primary-200 transition-all duration-200 text-slate-800 placeholder-slate-400";

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Change Password</h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Shield size={16} className="text-slate-400" />
              Update your password to keep your account secure
            </p>
          </div>
        </div>
      </div>

      {/* PASSWORD FORM */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Security Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Please enter your current password and choose a new one</p>
        </div>
        
        <form className="p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
              <Key size={16} className="text-slate-500" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
                className={`${inputClass} ${errors.currentPassword ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showCurrent ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {errors.currentPassword.message}
              </div>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
              <Lock size={16} className="text-slate-500" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
                className={`${inputClass} ${errors.newPassword ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showNew ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {errors.newPassword.message}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
              <CheckCircle size={16} className="text-slate-500" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your new password"
                className={`${inputClass} ${errors.confirmPassword ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showConfirm ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Shield size={16} className="text-slate-500" />
              Password Requirements
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                Minimum 6 characters long
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                Include both letters and numbers (recommended)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                Use a unique password not used elsewhere
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              <p>Your password will be updated immediately after submission</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isSubmitting
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
