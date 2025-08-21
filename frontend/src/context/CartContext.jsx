import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { 
        ...state, 
        items: action.payload.items || [], 
        totalAmount: action.payload.totalAmount || 0,
        loading: false 
      };
    case 'ADD_ITEM':
      return { ...state, loading: false };
    case 'UPDATE_ITEM':
      return { ...state, loading: false };
    case 'REMOVE_ITEM':
      return { ...state, loading: false };
    case 'CLEAR_CART':
      return { ...state, items: [], totalAmount: 0, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, user?.id]);

  // Fetch cart from server
  const fetchCart = async () => {
    if (!user?.id) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await api.get(`/api/cart/cart-details/${user.id}`);
      const cartData = response.data.data;
      
      dispatch({ 
        type: 'SET_CART', 
        payload: {
          items: cartData?.items || [],
          totalAmount: cartData?.totalAmount || 0
        }
      });
    } catch (error) {
      // If cart doesn't exist, that's okay - user has empty cart
      if (error.response?.status === 404) {
        dispatch({ type: 'SET_CART', payload: { items: [], totalAmount: 0 } });
      } else {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user?.id) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await api.post(`/api/cart/${user.id}/add-to-cart/${productId}?quantity=${quantity}`);
      
      dispatch({ type: 'ADD_ITEM' });
      await fetchCart(); // Refresh cart data
      
      toast.success('Item added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await api.delete(`/api/cart/remove-item/${itemId}`);
      
      dispatch({ type: 'REMOVE_ITEM' });
      await fetchCart(); // Refresh cart data
      
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update item quantity
  const updateItemQuantity = async (itemId, productId, newQuantity) => {
    if (!user?.id) return { success: false };

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Remove the item first
      await api.delete(`/api/cart/remove-item/${itemId}`);
      
      // Add it back with new quantity if quantity > 0
      if (newQuantity > 0) {
        await api.post(`/api/cart/${user.id}/add-to-cart/${productId}?quantity=${newQuantity}`);
      }
      
      await fetchCart(); // Refresh cart data
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user?.id) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await api.delete(`/api/cart/${user.id}/clear-cart`);
      
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    fetchCart,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};