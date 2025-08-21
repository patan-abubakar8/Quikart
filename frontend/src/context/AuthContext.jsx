import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null,
        token: null,
        loading: false,
        error: null 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true, // Start with loading true to check for existing auth
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthState = () => {
      console.log('Checking auth state...'); // Debug log
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('Token:', token, 'User:', user); // Debug log
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          console.log('Parsed user:', parsedUser); // Debug log
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: parsedUser, token }
          });
        } catch (error) {
          console.log('Error parsing user data:', error); // Debug log
          // Invalid stored data, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        console.log('No existing auth, stopping loading'); // Debug log
        // No existing auth, stop loading
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthState();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.post('/auth/login', credentials);
      const { data } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        email: data.email,
        role: data.role
      }));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            id: data.userId,
            email: data.email,
            role: data.role
          },
          token: data.accessToken
        }
      });
      
      toast.success('Login successful!');
      return { success: true, user: { id: data.userId, email: data.email, role: data.role } };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.post('/auth/register', userData);
      const { data } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        email: data.email,
        role: data.role
      }));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            id: data.userId,
            email: data.email,
            role: data.role
          },
          token: data.accessToken
        }
      });
      
      toast.success('Registration successful!');
      return { success: true, user: { id: data.userId, email: data.email, role: data.role } };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};