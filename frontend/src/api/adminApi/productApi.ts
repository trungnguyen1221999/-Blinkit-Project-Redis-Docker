import api from "../api";

// Get all products
export const getAllProductsApi = async () => {
  const response = await api.get("/product/get-products");
  return response.data;
};

// Get product by ID
export const getProductByIdApi = async (id: string) => {
  const response = await api.get(`/product/get-product/${id}`);
  return response.data;
};

// Get products by category
export const getProductsByCategoryApi = async (categoryId: string) => {
  const response = await api.get(`/product/category/${categoryId}`);
  return response.data;
};

// Get products by subcategory
export const getProductsBySubCategoryApi = async (subCategoryId: string) => {
  const response = await api.get(`/product/subcategory/${subCategoryId}`);
  return response.data;
};

// Create product
export const createProductApi = async (productData: FormData) => {
  const response = await api.post("/product/create-product", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update product
export const updateProductApi = async (id: string, productData: FormData) => {
  const response = await api.put(`/product/update-product/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete product
export const deleteProductApi = async (id: string) => {
  const response = await api.delete(`/product/delete-product/${id}`);
  return response.data;
};
