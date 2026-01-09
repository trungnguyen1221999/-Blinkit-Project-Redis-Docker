import { Pencil, User, Mail, Lock, Shield, Phone, CheckCircle, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import editUserApi from "../api/adminApi/editUserApi";

interface EditUserPopupProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    verify_email?: boolean;
    mobile?: string;
  };
  onCancel: () => void;
  onConfirm: (updatedData: any) => void;
}

// Validation schema
const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]),
  verify_email: z.boolean().optional(),
  mobile: z.string().optional(),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

const EditUserPopup: React.FC<EditUserPopupProps> = ({
  user,
  onCancel,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      verify_email: user.verify_email || false,
      mobile: user.mobile || "",
    },
  });

  const onSubmit = async (data: EditUserFormData) => {
    try {
      setApiError(null);
      setLoading(true);
      const response = await editUserApi(user._id, data);
      onConfirm(response.data);
    } catch (error: any) {
      console.error(error);
      setApiError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-200 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pencil className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Edit User</h3>
          <p className="text-slate-600">Update user information and permissions</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <User size={16} className="text-slate-500" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              {...register("name")}
              className={`w-full border-2 ${errors.name ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-primary-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ${errors.name ? 'focus:ring-red-100' : 'focus:ring-primary-200/20'} transition-all duration-200 text-slate-800 placeholder-slate-400`}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {errors.name.message}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail size={16} className="text-slate-500" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              className={`w-full border-2 ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-primary-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ${errors.email ? 'focus:ring-red-100' : 'focus:ring-primary-200/20'} transition-all duration-200 text-slate-800 placeholder-slate-400`}
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Lock size={16} className="text-slate-500" />
              New Password
              <span className="text-xs text-slate-500">(Leave empty to keep current)</span>
            </label>
            <input
              type="password"
              placeholder="Enter new password (optional)"
              {...register("password")}
              className="w-full border-2 border-slate-200 focus:border-primary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-200/20 transition-all duration-200 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Shield size={16} className="text-slate-500" />
              User Role
            </label>
            <select
              {...register("role")}
              className="w-full border-2 border-slate-200 focus:border-primary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-200/20 transition-all duration-200 text-slate-800 bg-white"
            >
              <option value="USER">Regular User</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Phone size={16} className="text-slate-500" />
              Mobile Number
              <span className="text-xs text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Enter mobile number"
              {...register("mobile")}
              className="w-full border-2 border-slate-200 focus:border-primary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-200/20 transition-all duration-200 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Email Verification */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input 
              type="checkbox" 
              {...register("verify_email")} 
              className="w-5 h-5 text-primary-200 border-2 border-slate-300 rounded focus:ring-primary-200/20 focus:ring-4"
            />
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <CheckCircle size={16} className="text-slate-500" />
              Email Verified
              <span className="text-xs text-slate-500">(Account verification status)</span>
            </label>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="font-medium text-sm">{apiError}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-200 to-primary-100 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPopup;
