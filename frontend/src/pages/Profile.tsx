import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../Context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import changeNameApi from "../api/userApi/changeNameApi";
import changeAvatarApi from "../api/userApi/changeAvatarApi";
import getUserApi from "../api/userApi/getUserApi";
import { Camera, Save, Shield } from "lucide-react";

// Zod Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

type ProfileForm = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, setUser } = useAuth();
  const [preview, setPreview] = useState<string>(
    user?.avatar ||
      "https://static.vecteezy.com/system/resources/previews/020/911/750/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
  );
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "" },
  });

  // Fetch lại user khi load trang để giữ avatar
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?._id) return;
      try {
        const data = await getUserApi(user._id);
        if (data) {
          setUser(data.data);
          setPreview(
            data.data.avatar ||
              "https://static.vecteezy.com/system/resources/previews/020/911/750/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
          );
          reset({ name: data.name });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Mutation đổi tên
  const changeNameMutation = useMutation({
    mutationFn: async (newName: string) => {
      await changeNameApi(user?._id || "", newName);
      return newName;
    },
    onSuccess: (newName: string) => {
      toast.success("Name updated successfully");
      if (user) setUser({ ...user, name: newName });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to change name");
    },
  });

  // Mutation đổi avatar
  const changeAvatarMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await changeAvatarApi(formData);
    },
    onSuccess: (data: any) => {
      toast.success("Avatar updated successfully");
      if (data?.data?.avatar && user) {
        const updatedUser = { ...user, avatar: data.data.avatar };
        setUser(updatedUser);
        setPreview(data.data.avatar);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to change avatar");
    },
  });

  // Handle chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > 1024 * 1024) {
      toast.error("File too large (max 1MB)");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Handle submit form
  const onSubmit = async (data: ProfileForm) => {
    try {
      if (data.name !== user?.name) {
        await changeNameMutation.mutateAsync(data.name);
      }
      if (file) {
        const formData = new FormData();
        formData.append("avatar", file);
        await changeAvatarMutation.mutateAsync(formData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-100 rounded-2xl flex items-center justify-center shadow-lg">
            {/* User icon removed, use avatar or placeholder if needed */}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Shield size={16} className="text-slate-400" />
              Manage and protect your account information
            </p>
          </div>
        </div>
      </div>

      {/* PROFILE FORM */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Account Information</h2>
          <p className="text-sm text-slate-500 mt-1">Update your personal details and profile picture</p>
        </div>
        
        <form className="p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full border-2 ${
                errors.name ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-primary-200"
              } rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ${
                errors.name ? "focus:ring-red-100" : "focus:ring-primary-200/20"
              } transition-all duration-200 text-slate-800 placeholder-slate-400`}
              placeholder="Enter your full name"
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

          {/* Avatar Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
              <Camera size={16} className="text-slate-500" />
              Profile Picture
            </label>
            
            <div className="flex items-start gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={preview || "/default-avatar.png"}
                    alt="avatar preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-200">
                  <Camera size={14} className="text-white" />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/jpeg, image/png"
                    hidden
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-200 to-primary-100 text-white rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                  >
                    <Camera size={16} />
                    Choose New Picture
                  </label>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-700 mb-2">Upload Requirements</h4>
                  <ul className="space-y-1 text-sm text-slate-500">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      Maximum file size: 1 MB
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      Supported formats: JPEG, PNG
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      Recommended: Square aspect ratio
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              <p>Changes will be saved to your account immediately</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isSubmitting
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-200 to-primary-100 text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
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

export default Profile;
