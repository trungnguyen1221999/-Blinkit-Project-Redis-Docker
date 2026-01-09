import api from "../api";

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
  createdAt?: string;
  updatedAt?: string;
}

// Get all subcategories
export const getSubCategoriesApi = async (): Promise<SubCategory[]> => {
  const response = await api.get("/subcategory/");
  return response.data;
};

// Create new subcategory
export const createSubCategoryApi = async (formData: FormData): Promise<SubCategory> => {
  const response = await api.post("/subcategory/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update subcategory
export const updateSubCategoryApi = async (
  subCategoryId: string,
  formData: FormData
): Promise<SubCategory> => {
  const response = await api.put(`/subcategory/edit/${subCategoryId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete subcategory
export const deleteSubCategoryApi = async (subCategoryId: string): Promise<void> => {
  const response = await api.delete(`/subcategory/delete/${subCategoryId}`);
  return response.data;
};

// Get subcategories by category
export const getSubCategoriesByCategoryApi = async (categoryId: string): Promise<SubCategory[]> => {
  const response = await api.get(`/subcategory/category/${categoryId}`);
  return response.data;
};
