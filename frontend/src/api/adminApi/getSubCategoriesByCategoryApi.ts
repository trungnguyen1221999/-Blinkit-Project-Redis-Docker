import api from "../api";

// Lấy subcategories theo category ID
const getSubCategoriesByCategoryApi = async (categoryId: string) => {
  try {
    const response = await api({
      url: `/subcategory/category/${categoryId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default getSubCategoriesByCategoryApi;
