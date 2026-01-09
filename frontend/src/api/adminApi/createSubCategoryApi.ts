import api from "../api";

interface CreateSubCategoryData {
  name: string;
  category: string[];
  image: File;
}

const createSubCategoryApi = async (data: CreateSubCategoryData) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    
    // Append multiple categories
    Array.isArray(data.category) && data.category.forEach(categoryId => {
      formData.append("category[]", categoryId);
    });
    
    formData.append("image", data.image);

    const response = await api({
      url: "/subcategory/create",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default createSubCategoryApi;
