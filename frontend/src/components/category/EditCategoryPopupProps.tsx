import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import type { Category } from "./AddCategoryPopup";

interface EditCategoryPopupProps {
  initialData: Category;
  onClose: () => void;
  onSubmit: (cat: Category, newImage?: File) => void;
  loading?: boolean;
}

interface FormData {
  name: string;
  image: FileList;
}

const EditCategoryPopup = ({
  initialData,
  onClose,
  onSubmit,
  loading = false,
}: EditCategoryPopupProps) => {
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState(initialData.image.url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    reset({
      name: initialData.name,
      image: undefined as any,
    });
    setImagePreview(initialData.image.url);
    setSelectedFile(null);
  }, [initialData, reset]);

  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (!selectedFile) {
      setImagePreview(initialData.image.url);
    }
  }, [watchImage, initialData.image.url, selectedFile]);

  const onSubmitForm = (data: FormData) => {
    if (!data.name) return;
    onSubmit(
      {
        _id: initialData._id,
        name: data.name,
        image: initialData.image, // giữ object cũ nếu không đổi
      },
      selectedFile || undefined
    );
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 w-[480px] max-w-full flex flex-col relative transform transition-all duration-200 scale-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <X size={18} />
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Edit Category</h3>
          <p className="text-slate-600 text-sm">
            Update category information and image
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
              defaultValue={initialData.name}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category Image</label>
            <div
              className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => !loading && document.getElementById("editCatFileInput")?.click()}
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
                  <span className="text-slate-500 text-sm font-medium">Click to upload new image</span>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              {...register("image")}
              id="editCatFileInput"
              className="hidden"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-200 to-primary-100 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium min-w-[100px]"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPopup;
