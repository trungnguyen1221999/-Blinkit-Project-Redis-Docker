import { Plus, User, Mail, Lock, Shield } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface AddUserPopupProps {
  onCancel: () => void;
  onConfirm: (userData: {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER";
  }) => void;
}

// Zod schema
const addUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "USER"]),
});

type AddUserFormData = z.infer<typeof addUserSchema>;

const AddUserPopup: React.FC<AddUserPopupProps> = ({ onCancel, onConfirm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const onSubmit = (data: AddUserFormData) => {
    onConfirm(data);
  };

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto border border-slate-200 animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-200 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Add New User</h3>
          <p className="text-slate-600">Create a new user account with the details below</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Lock size={16} className="text-slate-500" />
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password (min. 6 characters)"
              {...register("password")}
              className={`w-full border-2 ${errors.password ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-primary-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ${errors.password ? 'focus:ring-red-100' : 'focus:ring-primary-200/20'} transition-all duration-200 text-slate-800 placeholder-slate-400`}
            />
            {errors.password && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {errors.password.message}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Shield size={16} className="text-slate-500" />
              User Role
            </label>
            <select
              {...register("role")}
              className={`w-full border-2 ${errors.role ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-primary-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ${errors.role ? 'focus:ring-red-100' : 'focus:ring-primary-200/20'} transition-all duration-200 text-slate-800 bg-white`}
            >
              <option value="USER">Regular User</option>
              <option value="ADMIN">Administrator</option>
            </select>
            {errors.role && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {errors.role.message}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-200 to-primary-100 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
            >
              <Plus size={18} />
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;
