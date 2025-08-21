import api from './api';

export const productService = {
  // Get all products with pagination
  getAllProducts: async (page = 0, size = 12) => {
    const response = await api.get(`/api/products/page?page=${page}&size=${size}`);
    return response.data;
  },

  // Get all products (no pagination)
  getAllProductsSimple: async () => {
    const response = await api.get('/api/products/all');
    return response.data;
  },

  // Search products by name
  searchProducts: async (query) => {
    const response = await api.get(`/api/products/search?name=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/api/products/product/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/api/products/category/${categoryId}`);
    return response.data;
  },

  // Get products by brand
  getProductsByBrand: async (brand) => {
    const response = await api.get(`/api/products/brand/${encodeURIComponent(brand)}`);
    return response.data;
  },

  // Get products by price range
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    const response = await api.get(`/api/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  },

  // Filter products with multiple criteria
  filterProducts: async (filters) => {
    const params = new URLSearchParams();
    
    if (filters.name) params.append('name', filters.name);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

    const response = await api.get(`/api/products/filter?${params.toString()}`);
    return response.data;
  },

  // Get product images
  getProductImages: async (productId) => {
    const response = await api.get(`/api/images/products/${productId}`);
    return response.data;
  },

  // Get primary product image
  getPrimaryProductImage: async (productId) => {
    const response = await api.get(`/api/images/products/${productId}/primary`);
    return response.data;
  }
};