import api from "../api";

// Lấy tất cả subcategories
const getAllSubCategoriesApi = async () => {
  try {
    const response = await api({
      url: "/subcategory",
      method: "GET",
    });
    // Return only the data array
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAllSubCategoriesApi;
