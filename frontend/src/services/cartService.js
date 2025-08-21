import api from './api';

export const cartService = {
  // Get user's cart
  getCart: async (userId) => {
    const response = await api.get(`/api/cart/cart-details/${userId}`);
    return response.data;
  },

  // Add item to cart
  addToCart: async (userId, productId, quantity = 1) => {
    const response = await api.post(`/api/cart/${userId}/add-to-cart/${productId}?quantity=${quantity}`);
    return response.data;
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    const response = await api.delete(`/api/cart/remove-item/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (userId) => {
    const response = await api.delete(`/api/cart/${userId}/clear-cart`);
    return response.data;
  },

  // Update item quantity (we'll implement this by removing and re-adding)
  updateItemQuantity: async (userId, itemId, productId, newQuantity) => {
    // Remove the item first
    await cartService.removeItem(itemId);
    
    // Add it back with new quantity if quantity > 0
    if (newQuantity > 0) {
      return await cartService.addToCart(userId, productId, newQuantity);
    }
    
    return { success: true };
  }
};