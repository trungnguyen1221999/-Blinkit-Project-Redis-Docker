import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import AddCategoryPopup from "../category/AddCategoryPopup";
import AddSubCategoryPopup from "../category/AddSubCategoryPopup";

interface Product {
  _id: string;
  name: string;
  images: { url: string; public_id: string }[];
  category: { _id: string; name: string }[];
  SubCategory: { _id: string; name: string }[];
  unit: string;
  stock: number;
  price: number;
  discount?: number;
  description: string;
  more_details: Record<string, any>;
  publish: boolean;
  createdAt: string;
}

interface ProductForm {
  name: string;
  category: string[];
  SubCategory: string[];
  unit: string;
  stock: number;
  price: number;
  discount: number;
  description: string;
  more_details: Record<string, any>;
  publish: boolean;
}

interface AddEditProductPopupProps {
  isOpen: boolean;
  product: Product | null;
  productForm: ProductForm;
  setProductForm: (form: ProductForm) => void;
  selectedImages: File[];
  setSelectedImages: (images: File[]) => void;
  imagePreviewUrls: string[];
  setImagePreviewUrls: (urls: string[]) => void;
  categories: any[];
  subCategories: any[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCreateCategory?: () => void;
  onCreateSubCategory?: () => void;
  onCategoryCreated?: (newCategory: any) => void;
  onSubCategoryCreated?: (newSubCategory: any) => void;
  isLoading?: boolean;
}

const AddEditProductPopup = ({
  isOpen,
  product,
  productForm,
  setProductForm,
  selectedImages,
  setSelectedImages,
  imagePreviewUrls,
  setImagePreviewUrls,
  categories,
  subCategories,
  onClose,
  onSubmit,
  onCreateCategory,
  onCreateSubCategory,
  onCategoryCreated,
  onSubCategoryCreated,
  isLoading = false
}: AddEditProductPopupProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media'>('basic');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateSubCategory, setShowCreateSubCategory] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localCategories, setLocalCategories] = useState(categories);
  const [localSubCategories, setLocalSubCategories] = useState(subCategories);

  // Update local categories when props change
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  // Update local subcategories when props change
  useEffect(() => {
    setLocalSubCategories(subCategories);
  }, [subCategories]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previews);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviews);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviewUrls];
    
    // Remove dragged items
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    const [draggedPreview] = newPreviews.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    newPreviews.splice(dropIndex, 0, draggedPreview);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviews);
    setDraggedIndex(null);
  };

  const filteredSubCategories = localSubCategories.filter((subCat: any) =>
    productForm.category.some(catId => subCat.category.some((c: any) => c._id === catId))
  );

  // Sort categories alphabetically and split A-M, N-Z
  const sortedCategories = [...localCategories].sort((a, b) => a.name.localeCompare(b.name));
  const categoriesAM = sortedCategories.filter(cat => cat.name.toLowerCase()[0] <= 'm');
  const categoriesNZ = sortedCategories.filter(cat => cat.name.toLowerCase()[0] >= 'n');

  // Sort subcategories alphabetically and split A-M, N-Z
  const sortedSubCategories = [...filteredSubCategories].sort((a, b) => a.name.localeCompare(b.name));
  const subCategoriesAM = sortedSubCategories.filter(subCat => subCat.name.toLowerCase()[0] <= 'm');
  const subCategoriesNZ = sortedSubCategories.filter(subCat => subCat.name.toLowerCase()[0] >= 'n');

  // Handle category toggle (select/deselect)
  const toggleCategory = (categoryId: string) => {
    const currentSelected = productForm.category;
    let newSelection;
    
    if (currentSelected.includes(categoryId)) {
      // Remove if already selected
      newSelection = currentSelected.filter(id => id !== categoryId);
    } else {
      // Add if not selected
      newSelection = [...currentSelected, categoryId];
    }
    
    setProductForm({...productForm, category: newSelection, SubCategory: []});
  };

  // Handle subcategory toggle (select/deselect)
  const toggleSubCategory = (subCategoryId: string) => {
    const currentSelected = productForm.SubCategory;
    let newSelection;
    
    if (currentSelected.includes(subCategoryId)) {
      // Remove if already selected
      newSelection = currentSelected.filter(id => id !== subCategoryId);
    } else {
      // Add if not selected
      newSelection = [...currentSelected, subCategoryId];
    }
    
    setProductForm({...productForm, SubCategory: newSelection});
  };

  // Remove category selection
  const removeCategory = (categoryId: string) => {
    const newCategories = productForm.category.filter(id => id !== categoryId);
    setProductForm({...productForm, category: newCategories, SubCategory: []});
  };

  // Remove subcategory selection
  const removeSubCategory = (subCategoryId: string) => {
    const newSubCategories = productForm.SubCategory.filter(id => id !== subCategoryId);
    setProductForm({...productForm, SubCategory: newSubCategories});
  };

  const addMoreDetail = () => {
    const key = `detail_${Date.now()}`;
    setProductForm({
      ...productForm,
      more_details: { ...productForm.more_details, [key]: '' }
    });
  };

  const removeMoreDetail = (key: string) => {
    const newDetails = { ...productForm.more_details };
    delete newDetails[key];
    setProductForm({ ...productForm, more_details: newDetails });
  };

  const updateMoreDetail = (key: string, value: string) => {
    setProductForm({
      ...productForm,
      more_details: { ...productForm.more_details, [key]: value }
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-200 to-primary-100 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
          >
            <X size={24} />
          </button>
          
          <div className="pr-16">
            <h3 className="text-2xl font-bold text-white mb-2">
              {product ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-white/90 text-sm">
              {product ? "Update product information and settings" : "Create a new product for your catalog"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-50 px-8 border-b border-slate-200 mt-4">
          <div className="flex space-x-1">
            {[
              { id: 'basic', label: 'Basic Info', icon: '📋' },
              { id: 'details', label: 'Details', icon: '📝' },
              { id: 'media', label: 'Media', icon: '🖼️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-200 text-black border-t-2 border-primary-200 -mb-px'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="flex-1 overflow-y-auto p-8 max-h-[calc(95vh-240px)]">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Product Name - Full width */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200 text-lg"
                    placeholder="Enter a compelling product name"
                  />
                </div>

                {/* Price Section - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price Before Discount */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Price Before Discount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">€</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                        className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Discount Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({...productForm, discount: parseFloat(e.target.value)})}
                        className="w-full px-4 pr-8 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">%</span>
                    </div>
                  </div>

                  {/* Final Price Display */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Final Price (After Discount)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">€</span>
                      <input
                        type="text"
                        readOnly
                        value={(() => {
                          const price = productForm.price || 0;
                          const discount = productForm.discount || 0;
                          return discount > 0 
                            ? (price * (1 - discount / 100)).toFixed(2)
                            : price.toFixed(2);
                        })()}
                        className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-semibold cursor-not-allowed"
                      />
                      {productForm.discount > 0 && productForm.price > 0 && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs text-green-600 font-medium">
                            Save €{((productForm.price || 0) * ((productForm.discount || 0) / 100)).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    {productForm.discount > 0 && productForm.price > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        Customer saves {productForm.discount}% (€{((productForm.price || 0) * ((productForm.discount || 0) / 100)).toFixed(2)})
                      </p>
                    )}
                  </div>
                </div>

                {/* Stock and Unit - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                      placeholder="Available quantity"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Unit of Measurement
                    </label>
                    <input
                      type="text"
                      value={productForm.unit}
                      onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                      placeholder="e.g., kg, pcs, liter, box"
                    />
                  </div>
                </div>

                {/* Categories - Full row with 2 columns */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Categories
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
                  {/* Selected Categories Display */}
                  {productForm.category.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-xs font-medium text-blue-700 mb-2">Selected Categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {productForm.category.map((categoryId) => {
                          const category = localCategories.find((c: any) => c._id === categoryId);
                          return category ? (
                            <span key={categoryId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                              {category.name}
                              <button
                                type="button"
                                onClick={() => removeCategory(categoryId)}
                                className="text-blue-600 hover:text-blue-800 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Categories A-M */}
                    <div>
                      <p className="text-xs text-slate-600 mb-2 font-medium">A - M</p>
                      <div className="w-full border border-slate-200 rounded-xl p-2 min-h-[140px] max-h-[200px] overflow-y-auto bg-white">
                        {categoriesAM.map((category: any) => {
                          const isSelected = productForm.category.includes(category._id);
                          return (
                            <div
                              key={category._id}
                              onClick={() => toggleCategory(category._id)}
                              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                                isSelected 
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300 font-medium' 
                                  : 'text-slate-700 hover:bg-blue-50'
                              }`}
                            >
                              <span className="flex items-center justify-between">
                                {category.name}
                                {isSelected && (
                                  <span className="text-blue-600 font-bold">✓</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Categories N-Z */}
                    <div>
                      <p className="text-xs text-slate-600 mb-2 font-medium">N - Z</p>
                      <div className="w-full border border-slate-200 rounded-xl p-2 min-h-[140px] max-h-[200px] overflow-y-auto bg-white">
                        {categoriesNZ.map((category: any) => {
                          const isSelected = productForm.category.includes(category._id);
                          return (
                            <div
                              key={category._id}
                              onClick={() => toggleCategory(category._id)}
                              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                                isSelected 
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300 font-medium' 
                                  : 'text-slate-700 hover:bg-blue-50'
                              }`}
                            >
                              <span className="flex items-center justify-between">
                                {category.name}
                                {isSelected && (
                                  <span className="text-blue-600 font-bold">✓</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Click to select/deselect categories from both columns</p>
                </div>

                {/* SubCategories - Full row with 2 columns */}
                {filteredSubCategories.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-slate-700">
                        SubCategories
                      </label>
                      <button
                        type="button"
                        onClick={onCreateSubCategory || (() => setShowCreateSubCategory(true))}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-200 hover:text-primary-300 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      >
                        <Plus size={14} />
                        New SubCategory
                      </button>
                    </div>
                    {/* Selected SubCategories Display */}
                    {productForm.SubCategory.length > 0 && (
                      <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-xs font-medium text-green-700 mb-2">Selected SubCategories:</p>
                        <div className="flex flex-wrap gap-2">
                          {productForm.SubCategory.map((subCategoryId) => {
                            const subCategory = localSubCategories.find((sc: any) => sc._id === subCategoryId);
                            return subCategory ? (
                              <span key={subCategoryId} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                                {subCategory.name}
                                <button
                                  type="button"
                                  onClick={() => removeSubCategory(subCategoryId)}
                                  className="text-green-600 hover:text-green-800 ml-1"
                                >
                                  ×
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SubCategories A-M */}
                      <div>
                        <p className="text-xs text-slate-600 mb-2 font-medium">A - M</p>
                        <div className="w-full border border-slate-200 rounded-xl p-2 min-h-[120px] max-h-[180px] overflow-y-auto bg-white">
                          {subCategoriesAM.map((subCategory: any) => {
                            const isSelected = productForm.SubCategory.includes(subCategory._id);
                            return (
                              <div
                                key={subCategory._id}
                                onClick={() => toggleSubCategory(subCategory._id)}
                                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                                  isSelected 
                                    ? 'bg-green-100 text-green-800 border border-green-300 font-medium' 
                                    : 'text-slate-700 hover:bg-green-50'
                                }`}
                              >
                                <span className="flex items-center justify-between">
                                  {subCategory.name}
                                  {isSelected && (
                                    <span className="text-green-600 font-bold">✓</span>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* SubCategories N-Z */}
                      <div>
                        <p className="text-xs text-slate-600 mb-2 font-medium">N - Z</p>
                        <div className="w-full border border-slate-200 rounded-xl p-2 min-h-[120px] max-h-[180px] overflow-y-auto bg-white">
                          {subCategoriesNZ.map((subCategory: any) => {
                            const isSelected = productForm.SubCategory.includes(subCategory._id);
                            return (
                              <div
                                key={subCategory._id}
                                onClick={() => toggleSubCategory(subCategory._id)}
                                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                                  isSelected 
                                    ? 'bg-green-100 text-green-800 border border-green-300 font-medium' 
                                    : 'text-slate-700 hover:bg-green-50'
                                }`}
                              >
                                <span className="flex items-center justify-between">
                                  {subCategory.name}
                                  {isSelected && (
                                    <span className="text-green-600 font-bold">✓</span>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Click to select/deselect subcategories from both columns</p>
                  </div>
                )}

                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-slate-700">Publish Product</h4>
                    <p className="text-sm text-slate-500">Make this product visible to customers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.publish}
                      onChange={(e) => setProductForm({...productForm, publish: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-200"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Product Description
                  </label>
                  <textarea
                    rows={5}
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200 resize-none"
                    placeholder="Describe your product features, benefits, and what makes it special..."
                  />
                </div>

                {/* More Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Additional Details
                    </label>
                    <button
                      type="button"
                      onClick={addMoreDetail}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-primary-200 hover:text-primary-300 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                      Add Detail
                    </button>
                  </div>

                  {/* Default Fields */}
                  <div className="space-y-3">
                    {/* Country of Origin */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value="Country of origin/country of manufacture"
                        readOnly
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={productForm.more_details["Country of origin/country of manufacture"] || ""}
                        onChange={(e) => updateMoreDetail("Country of origin/country of manufacture", e.target.value)}
                        placeholder="e.g., Norway, Vietnam, Thailand"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                      />
                      <div className="w-10 flex items-center justify-center text-slate-400">
                        <span className="text-xs">📍</span>
                      </div>
                    </div>

                    {/* EAN Code */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value="EAN code"
                        readOnly
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={productForm.more_details["EAN code"] || ""}
                        onChange={(e) => updateMoreDetail("EAN code", e.target.value)}
                        placeholder="e.g., 2000448100001"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                      />
                      <div className="w-10 flex items-center justify-center text-slate-400">
                        <span className="text-xs">🏷️</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Additional Details */}
                  <div className="space-y-3">
                    {Object.entries(productForm.more_details)
                      .filter(([key]) => key !== "Country of origin/country of manufacture" && key !== "EAN code")
                      .map(([key, value]) => (
                      <div key={key} className="flex gap-3">
                        <input
                          type="text"
                          value={key.startsWith('detail_') ? '' : key}
                          onChange={(e) => {
                            const newDetails = { ...productForm.more_details };
                            delete newDetails[key];
                            newDetails[e.target.value] = value;
                            setProductForm({ ...productForm, more_details: newDetails });
                          }}
                          placeholder="Detail name (e.g., Brand, Weight, Material)"
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                        />
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => updateMoreDetail(key, e.target.value)}
                          placeholder="Detail value"
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-200 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeMoreDetail(key)}
                          className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {Object.entries(productForm.more_details)
                    .filter(([key]) => key !== "Country of origin/country of manufacture" && key !== "EAN code")
                    .length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <p>No custom details added yet.</p>
                      <p className="text-sm">Click "Add Detail" to include specifications, features, or other product information.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Product Images
                  </label>
                  
                  {/* Upload Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 group-hover:bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                        <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-primary-200 transition-colors duration-200" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700 mb-2">Upload Product Images</h4>
                      <p className="text-slate-500 mb-4">
                        Drag and drop your images here, or click to browse
                      </p>
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-200 to-primary-100 text-white rounded-xl hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                        <Upload className="mr-2 h-5 w-5" />
                        Choose Images
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <p className="text-xs text-slate-400 mt-3">
                        PNG, JPG, GIF up to 10MB each • Maximum 10 images
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {(imagePreviewUrls.length > 0 || (product && product.images.length > 0)) && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-sm font-semibold text-slate-700">
                          {imagePreviewUrls.length > 0 ? 'New Images' : 'Current Images'}
                        </h5>
                        {imagePreviewUrls.length > 1 && (
                          <p className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            💡 Drag images to reorder
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreviewUrls.length > 0 
                          ? imagePreviewUrls.map((url, index) => (
                              <div 
                                key={index} 
                                className={`relative group cursor-move transition-all duration-200 ${
                                  draggedIndex === index ? 'scale-105 shadow-lg' : 'hover:scale-102'
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                              >
                                <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 group-hover:border-primary-200 transition-colors duration-200">
                                  <img 
                                    src={url} 
                                    alt={`Preview ${index + 1}`} 
                                    className="w-full h-32 object-cover" 
                                  />
                                  
                                  {/* Drag Handle Overlay */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                                        <div className="flex flex-col gap-1">
                                          <div className="w-4 h-0.5 bg-slate-400 rounded"></div>
                                          <div className="w-4 h-0.5 bg-slate-400 rounded"></div>
                                          <div className="w-4 h-0.5 bg-slate-400 rounded"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
                                >
                                  <X size={16} />
                                </button>
                                
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                  <span>#{index + 1}</span>
                                  {index === 0 && (
                                    <span className="text-yellow-300">⭐</span>
                                  )}
                                </div>
                                
                                {/* Drop Zone Indicator */}
                                {draggedIndex !== null && draggedIndex !== index && (
                                  <div className="absolute inset-0 border-2 border-dashed border-primary-300 bg-primary-50/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                    <span className="text-primary-400 font-medium text-sm">Drop here</span>
                                  </div>
                                )}
                              </div>
                            ))
                          : product?.images.map((img, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={img.url} 
                                  alt={`Current ${index + 1}`} 
                                  className="w-full h-32 object-cover rounded-xl border-2 border-slate-200 group-hover:border-primary-200 transition-colors duration-200" 
                                />
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                  <span>#{index + 1}</span>
                                  {index === 0 && (
                                    <span className="text-yellow-300">⭐</span>
                                  )}
                                </div>
                              </div>
                            ))
                        }
                      </div>
                      
                      {imagePreviewUrls.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="flex items-start gap-3">
                            <div className="text-blue-500 mt-0.5">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h6 className="text-sm font-medium text-blue-700 mb-1">Image Order Tips</h6>
                              <ul className="text-xs text-blue-600 space-y-1">
                                <li>• First image (⭐) will be the main product image</li>
                                <li>• Drag and drop to reorder images</li>
                                <li>• Best quality images should be first</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center p-8 bg-slate-50 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              {product ? 'Update existing product' : 'Create new product'}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 rounded-xl border border-slate-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-200 to-primary-100 hover:shadow-lg disabled:opacity-50 rounded-xl transition-all duration-200 hover:scale-105"
              >
                {isLoading
                  ? "Saving..."
                  : product
                  ? "Update Product"
                  : "Create Product"
                }
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Add Category Popup */}
      {showCreateCategory && (
        <AddCategoryPopup
          onClose={() => setShowCreateCategory(false)}
          onSubmit={(newCategory) => {
            // Add to local state immediately
            setLocalCategories(prev => [...prev, newCategory]);
            
            if (onCategoryCreated) {
              onCategoryCreated(newCategory);
            }
            setShowCreateCategory(false);
            toast.success("Category created! You can now select it.");
          }}
        />
      )}

      {/* Add SubCategory Popup */}
      {showCreateSubCategory && (
        <AddSubCategoryPopup
          categories={localCategories}
          onClose={() => setShowCreateSubCategory(false)}
          onSubmit={(newSubCategory) => {
            // Add to local state immediately
            setLocalSubCategories(prev => [...prev, newSubCategory]);
            
            if (onSubCategoryCreated) {
              onSubCategoryCreated(newSubCategory);
            }
            setShowCreateSubCategory(false);
            toast.success("SubCategory created! You can now select it.");
          }}
        />
      )}
    </div>
  );
};

export default AddEditProductPopup;
