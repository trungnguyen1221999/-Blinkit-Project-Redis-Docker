import api from '../api';

// Fetch all categories for filter dropdown
const getCategoriesApi = async () => {
  const response = await api.get('/category');
  return response.data; // Return only the data array
};

export default getCategoriesApi;
