import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import ImagePreviewPopup from "./ImagePreviewPopup";
import type { Category } from "./CategoryTag";
import CategoryTag from "./CategoryTag";

export interface SubCategory {
  _id: string;
  name: string;
  image: string;
  category: Category[];
}

interface AddSubCategoryForm {
  name: string;
  image: FileList;
  category: string;
}

interface SubCategoryPopupProps {
  categories: Category[];
  initialData?: SubCategory | null;
  onClose: () => void;
  onSubmit: (data: SubCategory) => void;
}

const SubCategoryPopup = ({
  categories,
  initialData = null,
  onClose,
  onSubmit,
}: SubCategoryPopupProps) => {
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<AddSubCategoryForm>({
      defaultValues: { name: initialData?.name || "" },
    });

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialData?.category || []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [showLargePreview, setShowLargePreview] = useState(false);

  const watchName = watch("name");
  const watchImage = watch("image");
  const watchCategory = watch("category");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [watchImage]);

  useEffect(() => {
    if (watchCategory && watchCategory !== "") {
      const cat = categories.find((c) => c._id === watchCategory);
      if (cat && !selectedCategories.some((c) => c._id === cat._id)) {
        setSelectedCategories((prev) => [...prev, cat]);
      }
      setValue("category", "");
    }
  }, [watchCategory]);

  const removeCategory = (id: string) =>
    setSelectedCategories((prev) => prev.filter((c) => c._id !== id));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleFormSubmit = () => {
    if (!watchName) return;
    const newSub: SubCategory = {
      _id: initialData?._id || Date.now().toString(),
      name: watchName,
      image: imagePreview || "",
      category: selectedCategories,
    };
    onSubmit(newSub);
    reset();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-8 w-[500px] max-w-[90%] flex flex-col relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-semibold mb-6">
          {initialData ? "Edit SubCategory" : "Add SubCategory"}
        </h3>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <input
            type="text"
            placeholder="SubCategory Name"
            {...register("name", { required: true })}
            className="border rounded px-3 py-2 w-full"
          />

          <select
            {...register("category")}
            className="border rounded px-3 py-2 w-full"
            disabled={!watchName}
          >
            <option value="">Select category...</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((c) => (
              <CategoryTag key={c._id} category={c} onRemove={removeCategory} />
            ))}
          </div>

          <div
            className="w-32 h-32 border rounded flex items-center justify-center overflow-hidden mt-2 cursor-pointer"
            onClick={() => imagePreview && setShowLargePreview(true)}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Preview</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            {...register("image")}
            id="subFileInput"
            className="hidden"
            disabled={!watchName}
          />
          <button
            type="button"
            onClick={() => document.getElementById("subFileInput")?.click()}
            disabled={!watchName}
            className={`px-4 py-2 rounded-lg ${
              watchName
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Upload Image
          </button>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={!watchName || !imagePreview}
            >
              {initialData ? "Save" : "Add"}
            </button>
          </div>

          {showLargePreview && imagePreview && (
            <ImagePreviewPopup
              src={imagePreview}
              onClose={() => setShowLargePreview(false)}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default SubCategoryPopup;
