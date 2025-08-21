import api from './api';

export const orderService = {
  // Place an order
  placeOrder: async (orderData) => {
    const response = await api.post('/api/orders/place-order', orderData);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/api/orders/order/${orderId}`);
    return response.data;
  },

  // Get user's orders
  getUserOrders: async (userId) => {
    const response = await api.get(`/api/orders/user/${userId}/orders`);
    return response.data;
  },

  // Download order PDF
  downloadOrderPdf: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}/download-pdf`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `order-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response;
  },

  // Download invoice PDF
  downloadInvoicePdf: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}/download-invoice`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response;
  }
};