import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createCategoryApi } from "../../api/categoryApi/categoryApi";
import { toast } from "react-toastify";

export interface Category {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

interface CategoryPopupProps {
  initialData?: Category | null;
  onClose: () => void;
  onSubmit: (cat: Category) => void;
}

interface FormData {
  name: string;
  image: FileList;
}

const AddCategoryPopup = ({
  initialData,
  onClose,
  onSubmit,
}: CategoryPopupProps) => {
  const { register, handleSubmit, watch, reset } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState(
    initialData?.image?.url || ""
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = new window.FormData();
      data.append("name", formData.name);
      if (formData.image && formData.image.length > 0) {
        data.append("image", formData.image[0]);
      }
      return await createCategoryApi(data);
    },
    onSuccess: (newCat) => {
      toast.success("Category created successfully");
      onSubmit(newCat);
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to create category";
      toast.error(msg);
    },
  });

  const isLoading = addCategoryMutation.isPending;

  useEffect(() => {
    reset({
      name: initialData?.name || "",
      image: undefined as any,
    });
    setImagePreview(initialData?.image?.url || "");
    setSelectedFile(null);
  }, [initialData, reset]);

  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (!selectedFile && initialData?.image) {
      setImagePreview(initialData.image.url);
    } else if (!selectedFile) {
      setImagePreview("");
    }
  }, [watchImage]);

  const onSubmitForm = (data: FormData) => {
    if (!data.name || isLoading) return;
    addCategoryMutation.mutate(data);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-[480px] max-w-full flex flex-col relative transform transition-all duration-200 scale-100"
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            {initialData ? "Edit Category" : "Add Category"}
          </h3>
          <p className="text-slate-600 text-sm">
            {initialData ? "Update category information" : "Create a new product category"}
          </p>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category Name</label>
            <input
              type="text"
              placeholder="Enter category name..."
              {...register("name", { required: true })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/20 focus:border-primary-200 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category Image</label>
            <div 
              className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => !isLoading && document.getElementById("catFileInput")?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-slate-400 text-lg">📷</span>
                  </div>
                  <span className="text-slate-500 text-sm font-medium">Click to upload image</span>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              {...register("image")}
              id="catFileInput"
              className="hidden"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-200 to-primary-100 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium min-w-[100px]"
            >
              {isLoading ? "Processing..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPopup;
