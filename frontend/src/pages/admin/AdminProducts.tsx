import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Package, Search } from "lucide-react";
import { getAllProductsApi, createProductApi, updateProductApi, deleteProductApi } from "../../api/adminApi/productApi";
import { getCategoriesApi } from "../../api/categoryApi/categoryApi";
import { getSubCategoriesApi } from "../../api/subCategoryApi/subCategoryApi";
import { AddEditProductPopup, DeleteProductPopup } from "../../components/product";

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

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    category: [] as string[],
    SubCategory: [] as string[],
    unit: "",
    stock: 0,
    price: 0,
    discount: 0,
    description: "",
    more_details: {},
    publish: true
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Queries
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductsApi,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  const { data: subCategories = [] } = useQuery({
    queryKey: ["sub-categories"],
    queryFn: getSubCategoriesApi,
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductPopup(false);
      resetForm();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateProductApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductPopup(false);
      setEditingProduct(null);
      resetForm();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowDeletePopup(false);
      setProductToDelete(null);
    },
  });

  // Helper functions
  const resetForm = () => {
    setProductForm({
      name: "",
      category: [],
      SubCategory: [],
      unit: "",
      stock: 0,
      price: 0,
      discount: 0,
      description: "",
      more_details: {},
      publish: true
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Add form fields
    formData.append("name", productForm.name);
    formData.append("category", JSON.stringify(productForm.category));
    formData.append("SubCategory", JSON.stringify(productForm.SubCategory));
    formData.append("unit", productForm.unit);
    formData.append("stock", productForm.stock.toString());
    formData.append("price", productForm.price.toString());
    formData.append("discount", productForm.discount.toString());
    formData.append("description", productForm.description);
    formData.append("more_details", JSON.stringify(productForm.more_details));
    formData.append("publish", productForm.publish.toString());
    
    // Add images
    Array.isArray(selectedImages) && selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, data: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      category: (Array.isArray(product.category) ? product.category : []).map(c => c._id),
      SubCategory: (Array.isArray(product.SubCategory) ? product.SubCategory : []).map(s => s._id),
      unit: product.unit || '',
      stock: product.stock || 0,
      price: product.price || 0,
      discount: product.discount || 0,
      description: product.description || '',
      more_details: product.more_details || {},
      publish: product.publish === true
    });
    setImagePreviewUrls((Array.isArray(product.images) ? product.images : []).map(img => img.url));
    setShowProductPopup(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete._id);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.some(c => c._id === selectedCategory);
    return matchesSearch && matchesCategory;
  });



  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Product Management</h1>
            <p className="text-slate-600">Manage your inventory and product catalog</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Total Products: <strong className="text-slate-700">{products.length}</strong>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                In Stock: <strong className="text-slate-700">{products.filter((p: any) => p.stock > 0).length}</strong>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Low Stock: <strong className="text-slate-700">{products.filter((p: any) => p.stock < 20).length}</strong>
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            {/* Search and Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200/20 focus:border-primary-200 transition-colors text-sm bg-white shadow-sm h-[42px]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Filter Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="min-w-[150px] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200/20 focus:border-primary-200 transition-colors bg-white shadow-sm h-[42px]"
              >
                <option value="">All Categories</option>
                {(Array.isArray(categories) ? categories : []).map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide opacity-0">Action</label>
              <button 
                onClick={() => {
                  resetForm();
                  setShowProductPopup(true);
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium h-[42px]"
              >
                <Plus size={18} />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="rounded-xl shadow-md bg-white">
          <table className=" max-w-screen overflow-x-auto md:overflow-x-visible  w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="p-4 text-left font-semibold text-slate-700">Product</th>
                <th className="p-4 text-left font-semibold text-slate-700">Price</th>
                <th className="p-4 text-left font-semibold text-slate-700">Stock</th>
                <th className="p-4 text-left font-semibold text-slate-700">Category</th>
                <th className="p-4 text-left font-semibold text-slate-700">Status</th>
                <th className="p-4 text-left font-semibold text-slate-700">Created</th>
                <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(Array.isArray(filteredProducts) ? filteredProducts : []).map((product: Product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-50 transition-all duration-200 group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={product.images[0]?.url || "https://via.placeholder.com/60x60.png?text=No+Image"}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm"
                        />
                        {(product.stock || product.stock === 0) && product.stock < 10 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{product.name || 'Unnamed Product'}</p>
                        <p className="text-xs text-slate-500">Unit: {product.unit || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-slate-800">
                        ${product.price ? product.price.toFixed(2) : '0.00'}
                      </p>
                      {product.discount && product.discount > 0 && (
                        <p className="text-xs text-green-600">-{product.discount}% off</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        (product.stock || 0) > 50 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : (product.stock || 0) > 10
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {product.stock || 0} units
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(product.category) ? product.category : []).map((cat, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {cat?.name || 'Unknown Category'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      product.publish === true
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {product.publish === true ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>
                      <p className="font-medium">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString("en-US") : 'N/A'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString("en-US", { weekday: 'short' }) : 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-slate-400 hover:text-primary-200 hover:bg-primary-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                        title="Edit product"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                        title="Delete product"
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
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No products found</h3>
          <p className="text-slate-500 mb-6">Start building your product catalog by adding your first product.</p>
          <button 
            onClick={() => {
              resetForm();
              setShowProductPopup(true);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Plus size={18} />
            Add First Product
          </button>
        </div>
      )}

      {/* POPUPS */}
      <AddEditProductPopup
        isOpen={showProductPopup}
        product={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        imagePreviewUrls={imagePreviewUrls}
        setImagePreviewUrls={setImagePreviewUrls}
        categories={categories}
        subCategories={subCategories}
        onClose={() => {
          setShowProductPopup(false);
          setEditingProduct(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        isLoading={createProductMutation.isPending || updateProductMutation.isPending}
      />

      <DeleteProductPopup
        isOpen={showDeletePopup}
        product={productToDelete}
        onClose={() => {
          setShowDeletePopup(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  );
};

export default AdminProducts;
