import api from "../api";

const deleteSubCategoryApi = async (id: string) => {
  try {
    const response = await api({
      url: `/subcategory/delete/${id}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default deleteSubCategoryApi;
