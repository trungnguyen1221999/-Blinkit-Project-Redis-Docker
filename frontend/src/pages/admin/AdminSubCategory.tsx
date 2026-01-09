import { useEffect, useState, useRef } from "react";
import { Edit, Trash2, Plus, FolderTree, Search, Tag, X } from "lucide-react";
import type { SubCategory } from "../../api/subCategoryApi/subCategoryApi";
import type { Category } from "../../components/category/AddCategoryPopup";
import AddSubCategoryPopup from "../../components/category/AddSubCategoryPopup";
import EditSubCategoryPopup from "../../components/category/EditSubCategoryPopup";
import { useMutation } from "@tanstack/react-query";
import {
  getSubCategoriesApi,
  deleteSubCategoryApi,
} from "../../api/subCategoryApi/subCategoryApi";
import { getCategoriesApi } from "../../api/categoryApi/categoryApi";
import { toast } from "react-toastify";

const AdminSubCategory = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [deleteSub, setDeleteSub] = useState<SubCategory | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const hasLoaded = useRef(false);

  // Load subcategories
  const getSubCategoriesMutation = useMutation<SubCategory[], any>({
    mutationFn: getSubCategoriesApi,
    onSuccess: (data) => {
      setSubCategories(data);
    },
    onError: () => toast.error("Failed to load subcategories"),
  });

  // Load categories
  const getCategoriesMutation = useMutation<Category[], any>({
    mutationFn: getCategoriesApi,
    onSuccess: (data) => {
      setCategories(data);
    },
    onError: () => toast.error("Failed to load categories"),
  });

  // Delete subcategory
  const deleteSubCategoryMutation = useMutation<void, any, string>({
    mutationFn: deleteSubCategoryApi,
    onSuccess: () => toast.success("SubCategory deleted successfully"),
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete subcategory"
      );
    },
  });

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      getSubCategoriesMutation.mutate();
      getCategoriesMutation.mutate();
    }
  }, []);

  // Handlers
  const handleAddClick = () => {
    setShowAddPopup(true);
  };

  const handleEdit = (sub: SubCategory) => {
    setEditingSub(sub);
    setShowEditPopup(true);
  };

  const handleDelete = (sub: SubCategory) => {
    setDeleteSub(sub);
  };

  const confirmDelete = () => {
    if (!deleteSub) return;
    setSubCategories((prev) => prev.filter((s) => s._id !== deleteSub._id));
    deleteSubCategoryMutation.mutate(deleteSub._id);
    setDeleteSub(null);
  };

  const cancelDelete = () => {
    setDeleteSub(null);
  };

  const handleAddSubCategory = (subCat: SubCategory) => {
    setSubCategories((prev) => [...prev, subCat]);
    setShowAddPopup(false);
  };

  const handleEditSubCategory = (subCat: SubCategory) => {
    setSubCategories((prev) =>
      (Array.isArray(prev) ? prev : []).map((s) => (s._id === subCat._id ? subCat : s))
    );
    setShowEditPopup(false);
    setEditingSub(null);
  };

  // Filter subcategories
  const filteredSubCategories = subCategories.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || 
      sub.category.some(cat => cat._id === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-2 md:p-8 space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">SubCategory Management</h1>
            <p className="text-slate-600">Organize products with detailed subcategory classifications</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Total SubCategories: <strong className="text-slate-700">{subCategories.length}</strong>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Parent Categories: <strong className="text-slate-700">{categories.length}</strong>
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            {/* Search SubCategories */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Search SubCategories</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search subcategories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/20 focus:border-primary-200 transition-colors text-sm bg-white shadow-sm h-[42px]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Filter by Parent</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="min-w-[150px] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200/20 focus:border-primary-200 transition-colors bg-white shadow-sm h-[42px]"
              >
                <option value="All">All Categories</option>
                {(Array.isArray(categories) ? categories : []).map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Add SubCategory Button */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide opacity-0">Action</label>
              <button
                onClick={handleAddClick}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium h-[42px]"
              >
                <Plus size={18} />
                <span>Add SubCategory</span>
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
                <th className="p-4 text-left font-semibold text-slate-700">SubCategory</th>
                <th className="p-4 text-left font-semibold text-slate-700">Parent Categories</th>
                <th className="p-4 text-left font-semibold text-slate-700">Details</th>
                <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slash-100">
              {(Array.isArray(filteredSubCategories) ? filteredSubCategories : []).map((sub, idx) => (
                <tr
                  key={sub._id}
                  className="hover:bg-slate-50 transition-all duration-200 group"
                >
                  <td className="p-4 text-center font-medium text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {sub.image?.url ? (
                          <img
                            src={sub.image.url}
                            alt={sub.name}
                            className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-white shadow-lg flex items-center justify-center">
                            <Tag className="text-slate-400" size={24} />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{sub.name}</h3>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {sub.category.length > 0 ? (
                        (Array.isArray(sub.category) ? sub.category : []).map((cat, catIdx) => (
                          <span
                            key={catIdx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 mr-2"
                          >
                            {cat.name}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          No parent category
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          ID: #{sub._id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Created: {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("en-US") : "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="p-2.5 text-slate-400 hover:text-primary-200 hover:bg-primary-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                        title="Edit subcategory"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(sub)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                        title="Delete subcategory"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredSubCategories.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderTree className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No subcategories found</h3>
          <p className="text-slate-500 mb-6">Start organizing your products with detailed subcategory classifications.</p>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Plus size={18} />
            Create First SubCategory
          </button>
        </div>
      )}

      {/* POPUPS */}
      {showAddPopup && (
        <AddSubCategoryPopup
          categories={categories}
          onClose={() => setShowAddPopup(false)}
          onSubmit={handleAddSubCategory}
        />
      )}

      {showEditPopup && editingSub && (
        <EditSubCategoryPopup
          categories={categories}
          subCategory={editingSub}
          onClose={() => setShowEditPopup(false)}
          onSubmit={handleEditSubCategory}
        />
      )}

      {/* Delete Confirmation Popup */}
      {deleteSub && (
        <div
          onClick={cancelDelete}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 w-[480px] max-w-full flex flex-col relative transform transition-all duration-200 scale-100"
          >
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">Delete SubCategory</h3>
              <p className="text-slate-600 text-center">
                Are you sure you want to delete this subcategory?
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <p className="text-slate-500 text-sm mb-1">SubCategory Name</p>
                <p className="font-semibold text-slate-800 text-lg">"{deleteSub.name}"</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All products in this subcategory will need to be reassigned.
              </p>
            </div>
            
            <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={cancelDelete}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium min-w-[100px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubCategory;
