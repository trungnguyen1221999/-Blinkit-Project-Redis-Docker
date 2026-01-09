import api from "../api";

interface UpdateSubCategoryData {
  name?: string;
  category?: string[];
  image?: File;
}

const updateSubCategoryApi = async (id: string, data: UpdateSubCategoryData) => {
  try {
    const formData = new FormData();
    
    if (data.name) {
      formData.append("name", data.name);
    }
    
    if (data.category) {
      // Append multiple categories
      Array.isArray(data.category) && data.category.forEach(categoryId => {
        formData.append("category[]", categoryId);
      });
    }
    
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api({
      url: `/subcategory/edit/${id}`,
      method: "PUT",
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

export default updateSubCategoryApi;
