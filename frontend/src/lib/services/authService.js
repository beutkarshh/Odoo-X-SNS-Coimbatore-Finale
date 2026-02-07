import api from '../api.js';

export const authService = {
  /**
   * Login with email and password
   * POST /api/auth/login
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      // Store user with token in localStorage
      const userWithToken = { ...user, token };
      localStorage.setItem('currentUser', JSON.stringify(userWithToken));
      
      return {
        success: true,
        user: userWithToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  },

  /**
   * Register new customer account
   * POST /api/auth/register
   */
  register: async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { user, token } = response.data.data;
      
      // Store user with token in localStorage
      const userWithToken = { ...user, token };
      localStorage.setItem('currentUser', JSON.stringify(userWithToken));
      
      return {
        success: true,
        user: userWithToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  },

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get user profile',
      };
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout: () => {
    localStorage.removeItem('currentUser');
    return { success: true };
  },
};

export default authService;
