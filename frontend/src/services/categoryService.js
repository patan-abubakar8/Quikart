import api from './api';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/api/categories/all');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/api/categories/category/${id}/category`);
    return response.data;
  }
};