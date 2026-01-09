import api from "../api";

export const createCategoryApi = async (formData: FormData) => {
  const response = await api.post("/category/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; // returns full category object
};

export const getCategoriesApi = async () => {
  const response = await api.get("/category/");
  return response.data;
};

export const deleteCategoryApi = async (categoryId: string) => {
  const response = await api.delete(`/category/delete/${categoryId}`);
  return response.data;
};

// ✅ Update category API
export const updateCategoryApi = async (
  categoryId: string,
  formData: FormData
) => {
  console.log("Sending update request for category:", categoryId);
  
  // Log FormData contents for debugging
  console.log("FormData contents:");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ":", pair[1]);
  }
  
  const response = await api.put(`/category/edit/${categoryId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  console.log("Update response:", response.data);
  return response.data; // returns updated category object
};
