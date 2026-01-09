import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Plus, Tag } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createSubCategoryApi } from "../../api/subCategoryApi/subCategoryApi";
import { toast } from "react-toastify";
import type { Category } from "./AddCategoryPopup";
import AddCategoryPopup from "./AddCategoryPopup";

export interface SubCategory {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
  category: Array<{
    _id: string;
    name: string;
  }>;
}

interface SubCategoryPopupProps {
  categories: Category[];
  onClose: () => void;
  onSubmit: (subCat: SubCategory) => void;
  onCreateCategory?: () => void;
  onCategoryCreated?: (newCategory: Category) => void;
}

interface AddFormData {
  name: string;
  image: FileList;
  categoryIds: string[];
}

const AddSubCategoryPopup = ({
  categories,
  onClose,
  onSubmit,
  onCreateCategory,
  onCategoryCreated,
}: SubCategoryPopupProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<AddFormData>();
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  // Mutation
  const addSubCategoryMutation = useMutation({
    mutationFn: createSubCategoryApi,
    onSuccess: (data: SubCategory) => {
      toast.success("SubCategory created successfully!");
      onSubmit(data);
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create subcategory"
      );
    },
  });

  // Watch image changes
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      setValue("categoryIds", newSelection);
      return newSelection;
    });
  };

  const onFormSubmit = (data: AddFormData) => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", selectedFile);
    
    // Append categories
    Array.isArray(selectedCategories) && selectedCategories.forEach(categoryId => {
      formData.append("category[]", categoryId);
    });

    addSubCategoryMutation.mutate(formData);
  };

  return (
    <div 
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-200 to-primary-100 rounded-xl flex items-center justify-center">
              <Plus className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Add New SubCategory</h3>
              <p className="text-sm text-slate-600">Create a detailed product subcategory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Name and Image */}
            <div className="space-y-6">
              {/* SubCategory Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Tag size={16} className="text-slate-500" />
                  SubCategory Name
                </label>
                <input
                  type="text"
                  placeholder="Enter subcategory name..."
                  {...register("name", { required: "SubCategory name is required" })}
                  className="w-full border-2 border-slate-200 focus:border-primary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-200/20 transition-all duration-200 text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Upload size={16} className="text-slate-500" />
                  SubCategory Image
                </label>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: "Image is required" })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-xl mx-auto border-2 border-white shadow-lg"
                        />
                        <p className="text-sm text-slate-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                          <Upload className="text-slate-400" size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Upload SubCategory Image</p>
                          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Parent Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Tag size={16} className="text-slate-500" />
                  Parent Categories
                  <span className="text-xs text-slate-500">(Select at least one)</span>
                </label>
                <button
                  type="button"
                  onClick={onCreateCategory || (() => setShowCreateCategory(true))}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-200 hover:text-primary-300 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <Plus size={14} />
                  New Category
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedCategories.includes(category._id)
                        ? 'bg-primary-100 border-2 border-primary-200 text-white'
                        : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="w-4 h-4 text-primary-200 border-2 border-slate-300 rounded focus:ring-primary-200/20 focus:ring-4"
                    />
                    <span className={`font-medium text-sm ${
                      selectedCategories.includes(category._id) 
                        ? 'text-white' 
                        : 'text-slate-700'
                    }`}>
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
              {selectedCategories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one parent category</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addSubCategoryMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-200 to-primary-100 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {addSubCategoryMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create SubCategory
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add Category Popup */}
      {showCreateCategory && (
        <AddCategoryPopup
          onClose={() => setShowCreateCategory(false)}
          onSubmit={(newCategory) => {
            if (onCategoryCreated) {
              onCategoryCreated(newCategory);
            }
            setShowCreateCategory(false);
            toast.success("Category created! You can now select it.");
          }}
        />
      )}
    </div>
  );
};

export default AddSubCategoryPopup;
