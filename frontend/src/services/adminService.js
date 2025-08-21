import api from './api';

export const adminService = {
  // Product Management
  addProduct: async (productData) => {
    const response = await api.post('/api/products/add', productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await api.put(`/api/products/product/${productId}/update`, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/products/product/${productId}/delete`);
    return response.data;
  },

  // Category Management
  addCategory: async (categoryData) => {
    const response = await api.post('/api/categories/add', categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/api/categories/category/${categoryId}/delete`);
    return response.data;
  },

  // Image Management
  uploadProductImage: async (productId, file, isPrimary = false) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      `/api/images/products/${productId}/upload?isPrimary=${isPrimary}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  uploadMultipleProductImages: async (productId, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    console.log('Uploading images for product:', productId, 'Files:', files.length);
    
    const response = await api.post(
      `/api/images/products/${productId}/upload-multiple`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('Image upload response:', response.data);
    return response.data;
  },

  deleteProductImage: async (imageId) => {
    const response = await api.delete(`/api/images/${imageId}`);
    return response.data;
  },

  setPrimaryImage: async (productId, imageId) => {
    const response = await api.put(`/api/images/products/${productId}/primary/${imageId}`);
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await api.get('/api/users/all');
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/delete/${userId}`);
    return response.data;
  },

  // Order Management
  getAllOrders: async () => {
    const response = await api.get('/api/orders/all'); // You might need to add this endpoint
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    // This would be a custom endpoint that returns dashboard statistics
    const response = await api.get('/api/admin/dashboard-stats');
    return response.data;
  },

  // Low Stock Products
  getLowStockProducts: async (threshold = 10) => {
    const response = await api.get(`/api/products/low-stock?threshold=${threshold}`);
    return response.data;
  }
};