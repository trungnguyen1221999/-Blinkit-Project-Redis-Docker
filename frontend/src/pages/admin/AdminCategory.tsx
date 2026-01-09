import { useEffect, useState, useRef } from "react";
import { Edit, Trash2, Plus, Search, FolderOpen } from "lucide-react";
import type { Category } from "../../components/category/AddCategoryPopup";
import AddCategoryPopup from "../../components/category/AddCategoryPopup";
import EditCategoryPopup from "../../components/category/EditCategoryPopupProps";
import DeletePopup from "../../components/category/DeletePopup";
import { useMutation } from "@tanstack/react-query";
import {
  getCategoriesApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "../../api/categoryApi/categoryApi";
import { toast } from "react-toastify";

const AdminCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const hasLoaded = useRef(false);

  // Load categoriescd
  const getCategoriesMutation = useMutation<Category[], any>({
    mutationFn: getCategoriesApi,
    onSuccess: (data) => {
      setCategories(data);
    },
    onError: () => toast.error("Failed to load categories"),
  });

  // Delete category
  const deleteCategoryMutation = useMutation<void, any, string>({
    mutationFn: deleteCategoryApi,
    onSuccess: () => toast.success("Category deleted successfully"),
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete category"
      );
    },
  });

  // Update category
  const updateCategoryMutation = useMutation<
    Category, // result type
    any, // error type
    { id: string; formData: FormData } // variables type
  >({
    mutationFn: ({ id, formData }) => {
      console.log("Calling updateCategoryApi with id:", id);
      return updateCategoryApi(id, formData);
    },
    onSuccess: (updatedCat) => {
      console.log("Category updated successfully:", updatedCat);
      setCategories((prev) =>
        (Array.isArray(prev) ? prev : []).map((c) => (c._id === updatedCat._id ? updatedCat : c))
      );
      toast.success("Category updated successfully");
      setShowEditPopup(false);
      setEditingCat(null);
    },
    onError: (err: any) => {
      console.error("Update category error:", err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update category"
      );
    },
  });

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      getCategoriesMutation.mutate();
    }
  }, []);

  const handleAddCategory = (cat: Category) => {
    setCategories((prev) => [...prev, cat]);
    setShowAddPopup(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingCat(cat);
    setShowEditPopup(true);
  };

  const handleDelete = (cat: Category) => setDeleteCat(cat);

  const confirmDelete = () => {
    if (!deleteCat) return;
    setCategories((prev) => prev.filter((c) => c._id !== deleteCat._id));
    deleteCategoryMutation.mutate(deleteCat._id);
    setDeleteCat(null);
  };

  const cancelDelete = () => setDeleteCat(null);
  const handleEditCategory = (cat: Category, newImage?: File) => {
    const formData = new FormData();
    formData.append("name", cat.name);
    
    // Only append image if there's a new image file
    if (newImage) {
      console.log('Uploading new image:', newImage.name, newImage.size);
      formData.append("image", newImage);
    }
    
    // Log FormData contents for debugging
    console.log('FormData contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    
    updateCategoryMutation.mutate({ id: cat._id, formData });
  };
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 md:p-8 space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Category Management</h1>
            <p className="text-slate-600">Organize and manage product categories</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Total Categories: <strong className="text-slate-700">{categories.length}</strong>
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            {/* Search */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Search Categories</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/20 focus:border-primary-200 transition-colors text-sm bg-white shadow-sm h-[42px]"
                />
              </div>
            </div>

            {/* Add Category Button */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide opacity-0">Action</label>
              <button
                onClick={() => setShowAddPopup(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium h-[42px]"
              >
                <Plus size={18} />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="p-4 text-center font-semibold text-slate-700 w-16">#</th>
                <th className="p-4 text-left font-semibold text-slate-700">Category</th>
                <th className="p-4 text-left font-semibold text-slate-700">Id</th>
                <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length > 0 ? (
                (Array.isArray(filteredCategories) ? filteredCategories : []).map((cat, idx) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-slate-50 transition-all duration-200 group"
                  >
                    <td className="p-4 text-center font-medium text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={cat.image.url}
                            alt={cat.name}
                            className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{cat.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        #{cat._id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-slate-400 hover:text-primary-200 hover:bg-primary-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                          title="Edit category"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No categories found</h3>
          <p className="text-slate-500 mb-6">
            {search 
              ? `No categories match "${search}". Try adjusting your search.`
              : "Start organizing your products by creating your first category."
            }
          </p>
          {!search && (
            <button
              onClick={() => setShowAddPopup(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Plus size={18} />
              Add First Category
            </button>
          )}
        </div>
      )}

      {/* POPUPS */}
      {showAddPopup && (
        <AddCategoryPopup
          onClose={() => setShowAddPopup(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {showEditPopup && editingCat && (
        <EditCategoryPopup
          initialData={editingCat}
          onClose={() => {
            setShowEditPopup(false);
            setEditingCat(null);
          }}
          onSubmit={handleEditCategory}
        />
      )}

      {deleteCat && (
        <DeletePopup
          itemName={deleteCat.name}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AdminCategory;
